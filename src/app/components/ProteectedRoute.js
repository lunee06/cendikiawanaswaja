'use client';
// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Cek apakah ada cookie authToken yang tersimpan saat komponen mount
    const authToken = Cookies.get('authToken');
    if (!authToken) {
      // Jika tidak ada authToken, redirect ke halaman login
      router.replace('/sign-in');
    }
  }, []);

  return children; // Render children (halaman yang dilindungi) jika authToken ada
};

export default ProtectedRoute;
