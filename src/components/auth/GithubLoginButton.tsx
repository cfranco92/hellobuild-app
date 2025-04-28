'use client';

import { FaGithub } from 'react-icons/fa';

interface Props {
  onLogin: () => void;
  isLoading: boolean;
}

export function GithubLoginButton({ onLogin, isLoading }: Props) {
  return (
    <button
      onClick={onLogin}
      disabled={isLoading}
      className="w-full bg-[#24292F] hover:bg-[#1F2328] text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center relative overflow-hidden group"
    >
      <div className="flex items-center justify-center w-full">
        <FaGithub className="mr-3 text-xl flex-shrink-0" />
        <span className="text-base">
          {isLoading ? 'Connecting...' : 'Sign in with GitHub'}
        </span>
      </div>
      
      {isLoading && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="absolute inset-0 w-full h-full scale-0 rounded-lg bg-white/10 group-hover:scale-100 transition-transform duration-200"></div>
    </button>
  );
} 