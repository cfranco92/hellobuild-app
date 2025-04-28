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
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-70"
    >
      <FaGithub size={20} />
      {isLoading ? 'Signing in...' : 'Sign in with GitHub'}
    </button>
  );
} 