import React, { useState } from 'react';
import { Poppins } from 'next/font/google'; // Import Poppins font
import { registerUser } from '../../utils/api'; // Import fungsi registerUser dari file api.js

// Konfigurasi font Poppins dengan subset Latin dan display swap
const poppinsRegular = Poppins({
  weight: '400', // Bobot regular
  subsets: ['latin'],
  display: 'swap',
});

const poppinsBold = Poppins({
  weight: '700', // Bobot bold
  subsets: ['latin'],
  display: 'swap',
});

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi nama
    const nameRegex = /^[a-zA-Z.,\s]{5,}$/;
    if (!nameRegex.test(name)) {
      setError('Nama harus minimal 5 huruf dan hanya boleh menggunakan huruf, spasi, titik, atau koma.');
      return;
    }

    // Validasi password
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    // Validasi password complexity
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password harus minimal 8 karakter dan mengandung setidaknya 1 angka dan 1 huruf.');
      return;
    }

    // Buat objek data pengguna untuk dikirim ke backend
    const userData = {
      name,
      email,
      password,
    };

    try {
      // Panggil fungsi registerUser dari utils/api.js
      const response = await registerUser(userData);
      console.log('Register Berhasil:', response);

      // Tampilkan alert sukses
      setSuccessMessage('Cek email Anda untuk verifikasi.');

      // Bersihkan formulir setelah sukses
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
    } catch (error) {
      // Tangani error dari backend
      setError(error); // Atau sesuaikan dengan cara menampilkan pesan error yang sesuai
      console.error('Register Gagal:', error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <h1 className={`text-4xl font-bold text-gray-800 mb-4 ${poppinsBold.className}`}>Cendikiawan Aswaja</h1>
        <p className={`text-lg text-gray-700 mb-8 ${poppinsRegular.className}`}>Menginspirasi Melalui Pengetahuan, Membangun Bersama Ajaran Aswaja</p>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className={`text-3xl font-bold text-gray-800 mb-6 ${poppinsRegular.className}`}>Daftar</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Nama</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Konfirmasi Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`}
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>} {/* Tampilkan pesan error jika ada */}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>} {/* Tampilkan pesan sukses jika ada */}
            <button type="submit" className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ${poppinsBold.className}`}>Daftar</button>
          </form>
          <p className={`text-gray-600 text-center mt-4 ${poppinsRegular.className}`}>Sudah punya akun? <a href="/sign-in" className={`text-blue-500 hover:underline ${poppinsRegular.className}`}>Masuk</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
