const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const router = express.Router();
const validator = require('validator'); // Tambahkan ini di bagian atas file


// Error handling middleware
const handleServerError = (res, err) => {
  console.error(err.message);
  res.status(500).send('Server error');
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Register request received:', { name, email, password });

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

    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io', // Mailtrap SMTP host
      port: 587, // Mailtrap SMTP port
      auth: {
        user: process.env.MAILTRAP_USER, // Ganti dengan user Mailtrap Anda
        pass: process.env.MAILTRAP_PASS, // Ganti dengan password Mailtrap Anda
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_AUTH, // Ganti dengan alamat email Anda atau nama pengirim yang dikenali
      to: user.email,
      subject: 'Verifikasi Email Anda - Portal Pelanggan [Company]',
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Verifikasi alamat email Anda</title>
  <style type="text/css" rel="stylesheet" media="all">
    /* Base ------------------------------ */
    *:not(br):not(tr):not(html) {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      line-height: 1.4;
      background-color: #F5F7F9;
      color: #839197;
      -webkit-text-size-adjust: none;
    }
    a {
      color: #414EF9;
    }

    /* Layout ------------------------------ */
    .email-wrapper {
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: #F5F7F9;
    }
    .email-content {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Masthead ----------------------- */
    .email-masthead {
      padding: 25px 0;
      text-align: center;
    }
    .email-masthead_logo {
      max-width: 400px;
      border: 0;
    }
    .email-masthead_name {
      font-size: 16px;
      font-weight: bold;
      color: #839197;
      text-decoration: none;
      text-shadow: 0 1px 0 white;
    }

    /* Body ------------------------------ */
    .email-body {
      width: 100%;
      margin: 0;
      padding: 0;
      border-top: 1px solid #E7EAEC;
      border-bottom: 1px solid #E7EAEC;
      background-color: #FFFFFF;
    }
    .email-body_inner {
      width: 570px;
      margin: 0 auto;
      padding: 0;
    }
    .email-footer {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      text-align: center;
    }
    .email-footer p {
      color: #839197;
    }
    .body-action {
      width: 100%;
      margin: 30px auto;
      padding: 0;
      text-align: center;
    }
    .body-sub {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #E7EAEC;
    }
    .content-cell {
      padding: 35px;
    }
    .align-right {
      text-align: right;
    }

    /* Type ------------------------------ */
    h1 {
      margin-top: 0;
      color: #292E31;
      font-size: 19px;
      font-weight: bold;
      text-align: left;
    }
    h2 {
      margin-top: 0;
      color: #292E31;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }
    h3 {
      margin-top: 0;
      color: #292E31;
      font-size: 14px;
      font-weight: bold;
      text-align: left;
    }
    p {
      margin-top: 0;
      color: #839197;
      font-size: 16px;
      line-height: 1.5em;
      text-align: left;
    }
    p.sub {
      font-size: 12px;
    }
    p.center {
      text-align: center;
    }

    /* Buttons ------------------------------ */
    .button {
      display: inline-block;
      width: 200px;
      background-color: #414EF9;
      border-radius: 3px;
      color: #ffffff;
      font-size: 15px;
      line-height: 45px;
      text-align: center;
      text-decoration: none;
      -webkit-text-size-adjust: none;
      mso-hide: all;
    }
    .button--green {
      background-color: #28DB67;
    }
    .button--red {
      background-color: #FF3665;
    }
    .button--blue {
      background-color: #414EF9;
    }

    /*Media Queries ------------------------------ */
    @media only screen and (max-width: 600px) {
      .email-body_inner,
      .email-footer {
        width: 100% !important;
      }
    }
    @media only screen and (max-width: 500px) {
      .button {
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
          <!-- Logo -->
          <tr>
            <td class="email-masthead">
              <a class="email-masthead_name">Cendekiawan Aswaja</a>
            </td>
          </tr>
          <!-- Email Body -->
          <tr>
            <td class="email-body" width="100%">
              <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">
                <!-- Body content -->
                <tr>
                  <td class="content-cell">
                    <h1>Verifikasi alamat email Anda</h1>
                    <p>Hai ${user.name}, terima kasih telah mendaftar di Cendekiawan Aswaja! Klik di bawah untuk mengonfirmasi alamat email Anda.</p>
                    <!-- Action -->
                    <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <div>
                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{action_url}}" style="height:45px;v-text-anchor:middle;width:200px;" arcsize="7%" stroke="f" fill="t">
                            <v:fill type="tile" color="#414EF9" />
                            <w:anchorlock/>
                            <center style="color:#ffffff;font-family:sans-serif;font-size:15px;">Verifikasi Email</center>
                          </v:roundrect><![endif]-->
                            <a href="http://localhost:5000/api/auth/verify-email?token=${verificationToken}" class="button button--blue">Verifikasi Email</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p>Terima kasih,<br>Tim Cendekiawan Aswaja</p>
                    <!-- Sub copy -->
                    <table class="body-sub">
                      <tr>
                        <td>
                          <p class="sub">Jika Anda mengalami masalah saat mengklik tombol, salin dan tempel URL di bawah ini ke browser web Anda.
                          </p>
                          <p class="sub"><a href="http://localhost:5000/api/auth/verify-email?token=${verificationToken}">http://localhost:5000/api/auth/verify-email?token=${verificationToken}</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-cell">
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

      `,
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

    // Redirect to Next.js frontend after successful verification
    res.redirect(`${process.env.FRONTEND_URL}/verification-success`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Validasi email menggunakan validator
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ msg: 'Email is required and must be valid' });
    }

    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ msg: 'User not found' });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });
    console.log(`Generated reset token for email ${email}: ${resetToken}`);
    console.log(`Reset token length: ${resetToken.length}`);

    // Simpan resetToken ke dalam database
    await User.updateOne({ email }, { $set: { resetToken } });
    console.log(`Saved reset token for user ${email}`);

    const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 587,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_AUTH,
      to: email,
      subject: 'Reset Password',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Password Reset</title>
      </head>
      <body>
        <p>Hai ${user.name},</p>
        <p>Ada permintaan untuk mengubah kata sandi Anda!<br>
        Jika Anda tidak membuat permintaan ini, harap abaikan email ini.<br>
        Silahkan klik tombol dibawah ini untuk mengubah kata sandi Anda</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Ganti Password</a>
        <p>Terima kasih,<br>Tim Cendekiawan Aswaja</p>
      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Sent password reset email to ${email}`);

    res.status(200).json({ msg: 'Email reset password telah dikirim' });
  } catch (err) {
    console.error(`Error during forgot-password process for email ${email}:`, err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Endpoint untuk reset password berdasarkan token
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ msg: 'New password is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Hash newPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cari dan perbarui user
    const user = await User.findOneAndUpdate(
      { email, resetToken: token },
      {
        $set: {
          password: hashedPassword,
          resetToken: null,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Error during password reset:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/check-reset-token/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ resetToken: token }).lean().exec();

    if (!user || !user.resetToken) {
      return res.status(200).json({ exists: false });
    }

    res.status(200).json({ exists: true });
  } catch (err) {
    console.error(`Error checking reset token ${token}:`, err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route to check if a user is verified
router.get('/check-is-verified', async (req, res) => {
  const { email } = req.query;

  try {
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ msg: 'Email is required and must be valid' });
    }

    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ isVerified: user.isVerified });
  } catch (err) {
    handleServerError(res, err);
  }
});

module.exports = router;
