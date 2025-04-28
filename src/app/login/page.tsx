'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GithubLoginButton } from '@/components/auth';
import { useAuth } from '@/context/AuthContext';
import { Footer } from '@/components/layout';
import { FaGithub, FaCode, FaStar, FaExclamationCircle } from 'react-icons/fa';

export default function LoginPage() {
  const { user, loginWithGithub, error } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;
    
    if (isRedirecting) {
      redirectTimeout = setTimeout(() => {
        if (isRedirecting) {
          setIsRedirecting(false);
          setRedirectError('Error redirecting, please try again');
        }
      }, 5000);
    }
    
    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [isRedirecting]);

  const handleGithubLogin = async () => {
    setRedirectError(null);
    setIsGithubLoading(true);
    
    try {
      const success = await loginWithGithub();
      
      if (success) {
        setIsRedirecting(true);
        router.push('/');
      }
    } finally {
      setIsGithubLoading(false);
    }
  };

  if (isRedirecting) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6 sm:p-24">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Almost there!</h2>
          <p className="text-gray-600">Connecting to your GitHub account...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6 sm:p-24">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <FaGithub className="text-white text-3xl" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">GitHub Repository Explorer</h1>
        <p className="text-gray-500 text-center mb-8">Browse, search and manage your GitHub repositories</p>
        
        {redirectError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start border border-red-200">
            <FaExclamationCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">{redirectError}</span>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start border border-red-200">
            <FaExclamationCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        
        <div className="mb-8">
          <GithubLoginButton 
            onLogin={handleGithubLogin}
            isLoading={isGithubLoading}
          />
        </div>
        
        <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="mr-3 mt-1 text-blue-500">
              <FaCode />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Repository Access</h3>
              <p className="text-gray-500 text-sm">Access all your public and private repositories</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-3 mt-1 text-yellow-500">
              <FaStar />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Save Favorites</h3>
              <p className="text-gray-500 text-sm">Bookmark repositories for quick access</p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
      
      <p className="mt-8 text-center text-xs text-gray-500">
        Your GitHub token is stored securely and only used to access your repositories
      </p>
    </main>
  );
} 