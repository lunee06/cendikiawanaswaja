'use client';
import Cookies from 'js-cookie'; // Import js-cookie untuk manipulasi cookie
import { useRouter } from 'next/navigation'; // Import useRouter untuk navigasi
import ProtectedRoute from "./components/ProteectedRoute";


export default function Home() {
  const router = useRouter(); // Initialize useRouter untuk navigasi
  
const handleLogout = () => {
  Cookies.remove('authToken'); // Hapus cookie authToken saat logout
  router.push('/sign-in'); // Redirect ke halaman sign-in setelah logout
};



  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img className="mx-auto h-12 w-auto" src="/img/checkmark.png" alt="Logo" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Anda sudah login</h2>
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
