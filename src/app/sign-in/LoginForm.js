import React, { useState } from 'react';
import { loginUser } from '../../utils/api'; // Sesuaikan path sesuai struktur proyek Anda
import { useRouter } from 'next/navigation'; // Import useRouter untuk navigasi

const LoginForm = () => {
  const router = useRouter(); // Pastikan ini digunakan dalam komponen yang dirender di sisi klien
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State untuk "Ingat Saya"

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { email, password, rememberMe }; // Sertakan rememberMe dalam data pengguna
      const data = await loginUser(userData); // Panggil loginUser dari API backend

      // Misalnya, jika respons dari API berisi token atau informasi penting lainnya
      console.log('Login Berhasil:', data);

      // Redirect ke dashboard atau halaman lain setelah login berhasil
      router.push('/dashboard');
    } catch (error) {
      if (error.response) {
        // Jika respons dari API memiliki status 401 (Unauthorized)
        if (error.response.status === 401) {
          setError('Email atau kata sandi salah. Silakan coba lagi.');
        } else {
          setError('Terjadi kesalahan saat login. Silakan coba lagi.');
        }
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Cendikiawan Aswaja</h1>
        <p className="text-lg text-center text-gray-700 mb-8">Menginspirasi Melalui Pengetahuan, Membangun Bersama Ajaran Aswaja</p>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Masuk</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)} // Update state saat checkbox berubah
                  className="rounded text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">Ingat Saya</label>
              </div>
              <a href="/forgot-password" className="text-sm text-blue-500">Lupa Kata Sandi?</a>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>} {/* Tampilkan pesan kesalahan jika ada */}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">Masuk</button>
          </form>
          <p className="text-gray-600 text-center mt-4">Belum punya akun? <a href="/sign-up" className="text-blue-500 hover:underline">Daftar di sini</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
