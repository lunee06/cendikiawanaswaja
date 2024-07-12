'use client';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from "./components/ProteectedRoute";
import { fetchUserData } from '../utils/api'; // Adjust the import path according to your project structure

export default function Home() {
  const [name, setname] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const userData = await fetchUserData(token);
          setname(userData.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('authToken');
    router.push('/sign-in');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img className="mx-auto h-12 w-auto" src="/img/checkmark.png" alt="Logo" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome, {name || 'User'}!
            </h2>
          </div>
          <div className="mt-8">
            <div className="text-center">
              <p className="text-base text-gray-500">
                Klik link di bawah ini untuk logout{' '}
                <a className="font-medium text-indigo-600 hover:text-indigo-500" onClick={handleLogout}>
                  logout
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
