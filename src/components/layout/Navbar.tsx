'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaGithub, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutCompleted, setLogoutCompleted] = useState(false);
  
  useEffect(() => {
    if (logoutCompleted && pathname === '/login') {
      router.refresh();
      setLogoutCompleted(false);
    }
  }, [logoutCompleted, pathname, router]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    const success = await logout();
    
    if (success) {
      setLogoutCompleted(true);
      router.push('/login');
    }
    
    setMobileMenuOpen(false);
    setIsLoggingOut(false);
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
    <nav className="bg-gray-900 shadow-md py-4 px-4 sm:px-6 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
            <FaGithub className="mr-2" />
            <span>GitHub Explorer</span>
          </Link>
        </div>
        
        <button 
          className="md:hidden text-gray-300 hover:text-white focus:outline-none cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="flex items-center">
              <button 
                onClick={navigateToProfile}
                className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md mr-3 transition-colors cursor-pointer"
                aria-label="View profile"
              >
                <FaUser className="mr-2" />
                <span>{user.displayName || 'Profile'}</span>
              </button>
              
              <Link 
                href="/" 
                className={`px-4 py-2 hover:bg-gray-700 rounded-md transition-colors cursor-pointer ${
                  pathname === '/' 
                    ? 'font-semibold text-blue-400 bg-gray-800' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Repositories
              </Link>
              
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ml-3 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                aria-label="Sign out"
              >
                <FaSignOutAlt className="mr-2" />
                <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={navigateToLogin}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-2 border-t border-gray-700">
          {user ? (
            <div className="flex flex-col space-y-2">
              <button 
                onClick={navigateToProfile}
                className="flex items-center text-sm hover:bg-gray-700 text-white px-3 py-2 rounded-md transition-colors cursor-pointer"
                aria-label="View profile"
              >
                <FaUser className="mr-2" />
                <span>{user.displayName || 'Profile'}</span>
              </button>
              
              <Link 
                href="/" 
                className={`flex items-center px-3 py-2 hover:bg-gray-700 rounded-md transition-colors cursor-pointer ${
                  pathname === '/' 
                    ? 'font-semibold text-blue-400 bg-gray-800' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaGithub className="mr-2" />
                <span>Repositories</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                aria-label="Sign out"
              >
                <FaSignOutAlt className="mr-2" />
                <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={navigateToLogin}
              className="w-full flex justify-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </nav>
  );
} 