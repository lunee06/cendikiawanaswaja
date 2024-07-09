const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  resetToken: {  // Tambahkan bidang resetToken di sini
    type: String,
  },
});

// Membuat indeks untuk email
UserSchema.index({ email: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = User;
