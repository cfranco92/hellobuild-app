'use client';

import { useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaTasks, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const goToLogin = () => {
    router.push('/login');
  };

  const goToProfile = () => {
    router.push('/profile');
  };

  const goToTasks = () => {
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm py-3 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <span 
          onClick={goToTasks} 
          className="text-blue-500 font-bold text-lg cursor-pointer hover:text-blue-600"
        >
          TodoApp
        </span>
      </div>
      
      <div>
        {user ? (
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <FaUser className="text-gray-600 mr-2" />
              <span className="text-gray-700">{user.displayName || 'Usuario'}</span>
            </div>
            
            <button 
              onClick={goToProfile}
              className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
            >
              <FaUserCircle className="mr-1" />
              Profile
            </button>
            
            <button 
              onClick={goToTasks}
              className="flex items-center text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md mr-2"
            >
              <FaTasks className="mr-1" />
              Tasks
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
            >
              <FaSignOutAlt className="mr-1" />
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={goToLogin}
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
} 