'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaGithub, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    setMobileMenuOpen(false);
  };

  const navigateToProfile = () => {
    router.push('/profile');
    setMobileMenuOpen(false);
  };

  const navigateToLogin = () => {
    router.push('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm py-4 px-4 sm:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-xl font-bold text-blue-600 dark:text-blue-400">
            <FaGithub className="mr-2" />
            <span>GitHub Explorer</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="flex items-center">
              <button 
                onClick={navigateToProfile}
                className="flex items-center text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded-md mr-2"
                aria-label="View profile"
              >
                <FaUser className="mr-1" />
                <span>{user.displayName || 'Profile'}</span>
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
                <span>Sign out</span>
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
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          {user ? (
            <div className="flex flex-col space-y-2">
              <button 
                onClick={navigateToProfile}
                className="flex items-center text-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-md"
                aria-label="View profile"
              >
                <FaUser className="mr-2" />
                <span>{user.displayName || 'Profile'}</span>
              </button>
              
              <Link 
                href="/" 
                className={`flex items-center px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ${pathname === '/' ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaGithub className="mr-2" />
                <span>Repositories</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400 px-3 py-2 rounded-md"
                aria-label="Sign out"
              >
                <FaSignOutAlt className="mr-2" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={navigateToLogin}
              className="w-full flex justify-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </nav>
  );
} 