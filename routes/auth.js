const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const oauth2Client = require('../config/gmail');
const router = express.Router();

// Error handling middleware
const handleServerError = (res, err) => {
  console.error(err.message);
  res.status(500).send('Server error');
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email }).lean().exec();
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    user.verificationToken = verificationToken;

    await user.save();

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'lune130602@gmail.com', // Ganti dengan alamat email Anda
        clientId: oauth2Client._clientId,
        clientSecret: oauth2Client._clientSecret,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: 'lune130602@gmail.com',
      to: user.email,
      subject: 'Email Verification',
      text: `Please verify your email using this link: http://localhost:5000/api/auth/verify-email?token=${verificationToken}`,
      html: `<h3>Please verify your email using this <a href="http://localhost:5000/api/auth/verify-email?token=${verificationToken}">link</a></h3>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: 'User registered, verification email sent' });
  } catch (err) {
    handleServerError(res, err);
  }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).lean().exec();

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await User.updateOne({ email: decoded.email }, { $set: { isVerified: true, verificationToken: null } });

    res.status(200).json({ msg: 'Email verified successfully' });
  } catch (err) {
    handleServerError(res, err);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).lean().exec();
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Email not verified' });
    }

    // Payload untuk token JWT
    const payload = {
      user: {
        id: user._id,
      },
    };

    // Membuat token JWT
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        handleServerError(res, err);
      } else {
        res.json({ token });
      }
    });
  } catch (err) {
    handleServerError(res, err);
  }
});

// Endpoint untuk mengirimkan email reset password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email }).lean().exec();
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '10m', // Token berlaku selama 10 menit
      });
  
      // Simpan token reset di database user
      await User.updateOne({ email }, { $set: { resetToken } });
  
      // Kirim email reset password
      const accessToken = await oauth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'lune130602@gmail.com', // Ganti dengan alamat email Anda
          clientId: oauth2Client._clientId,
          clientSecret: oauth2Client._clientSecret,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
          accessToken: accessToken.token,
        },
      });
  
      const mailOptions = {
        from: 'lune130602@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `Silakan reset password Anda menggunakan tautan ini: http://localhost:5000/api/auth/reset-password/${resetToken}`,
        html: `<p>Silakan reset password Anda menggunakan <a href="http://localhost:5000/api/auth/reset-password/${resetToken}">tautan ini</a>.</p>`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ msg: 'Email reset password telah dikirim' });
    } catch (err) {
      handleServerError(res, err);
    }
  });
  
  // Endpoint untuk reset password berdasarkan token
  router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email } = decoded;
  
      // Cari user berdasarkan email dan token reset
      const user = await User.findOne({ email, resetToken: token }).lean().exec();
      if (!user) {
        return res.status(400).json({ msg: 'Invalid or expired token' });
      }
  
      // Enkripsi password baru
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update password di database
      await User.updateOne({ email }, { $set: { password: hashedPassword, resetToken: null } });
  
      res.status(200).json({ msg: 'Password reset berhasil' });
    } catch (err) {
      handleServerError(res, err);
    }
  });

module.exports = router;
