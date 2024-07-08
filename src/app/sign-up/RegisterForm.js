import React from 'react';
import { Poppins } from 'next/font/google'; // Import Poppins font

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
  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <h1 className={`text-4xl font-bold text-gray-800 mb-4 ${poppinsBold.className}`}>Cendikiawan Aswaja</h1>
        <p className={`text-lg text-gray-700 mb-8 ${poppinsRegular.className}`}>Menginspirasi Melalui Pengetahuan, Membangun Bersama Ajaran Aswaja</p>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className={`text-3xl font-bold text-gray-800 mb-6 ${poppinsRegular.className}`}>Daftar</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Nama</label>
              <input id="name" name="name" type="text" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`} />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Email</label>
              <input id="email" name="email" type="email" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`} />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Password</label>
              <input id="password" name="password" type="password" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`} />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Konfirmasi Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`} />
            </div>
            <button type="submit" className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ${poppinsBold.className}`}>Daftar</button>
          </form>
          <p className={`text-gray-600 text-center mt-4 ${poppinsRegular.className}`}>Sudah punya akun? <a href="/sign-in" className={`text-blue-500 hover:underline ${poppinsRegular.className}`}>Masuk</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
