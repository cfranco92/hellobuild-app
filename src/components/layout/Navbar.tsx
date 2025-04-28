'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaGithub } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-xl font-bold text-blue-600 dark:text-blue-400">
            <FaGithub className="mr-2" />
            <span>GitHub Explorer</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center">
              <button 
                onClick={navigateToProfile}
                className="flex items-center text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded-md mr-2"
                aria-label="View profile"
              >
                <FaUser className="mr-1" />
                {user.displayName || 'Profile'}
              </button>
              
              <Link 
                href="/" 
                className={`px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ${pathname === '/' ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
              >
                Repositories
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md ml-2"
                aria-label="Sign out"
              >
                <FaSignOutAlt className="mr-1" />
                Sign out
              </button>
            </div>
          ) : (
            <button 
              onClick={navigateToLogin}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
} 