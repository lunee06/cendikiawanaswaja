import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router
import { Poppins } from 'next/font/google'; // Import Poppins font
import { resetPassword } from '../../../utils/api'; // Import resetPassword function from api.js

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

const ResetPasswordForm = () => {
  const router = useRouter(); // Menggunakan useRouter dari next/router
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle kasus jika router.query.resetToken tidak terdefinisi saat komponen pertama kali di-render
    if (!router.query?.resetToken) {
      // Contoh: Redirect ke halaman lain jika resetToken tidak ditemukan
      router.push('/not-found'); // Gantilah dengan halaman yang sesuai
    }
  }, [router.query?.resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lakukan validasi password
    if (password !== confirmPassword) {
      alert('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const resetToken = router.query?.resetToken; // Ambil resetToken dari URL menggunakan optional chaining

      // Panggil fungsi resetPassword dengan resetToken dan newPassword
      await resetPassword(resetToken, password);
      alert('Password Anda berhasil direset.');

      // Reset form setelah berhasil reset password
      setPassword('');
      setConfirmPassword('');
      setError(null);
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Terjadi kesalahan saat mereset password.');
    } finally {
      setLoading(false);
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
          <h2 className={`text-3xl font-bold text-gray-800 mb-6 ${poppinsRegular.className}`}>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Password Baru</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className={`block text-sm font-medium text-gray-700 mb-1 ${poppinsRegular.className}`}>Konfirmasi Password Baru</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${poppinsRegular.className}`}
              />
            </div>
            <button type="submit" className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ${poppinsBold.className}`} disabled={loading}>
              {loading ? 'Loading...' : 'Reset Password'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
          <p className={`text-gray-600 text-center mt-4 ${poppinsRegular.className}`}>Kembali ke <a href="/sign-in" className={`text-blue-500 hover:underline ${poppinsRegular.className}`}>Halaman Masuk</a></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
