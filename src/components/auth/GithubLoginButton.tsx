'use client';

import { FaGithub } from 'react-icons/fa';

interface GithubLoginButtonProps {
  onLogin: () => void;
  isLoading: boolean;
}

export default function GithubLoginButton({ onLogin, isLoading }: GithubLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onLogin}
      disabled={isLoading}
      className={`w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline flex items-center justify-center ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
      ) : (
        <FaGithub className="mr-2" />
      )}
      {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión con GitHub'}
    </button>
  );
} 