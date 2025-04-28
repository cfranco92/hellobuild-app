'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GithubLoginButton } from '@/components/auth';
import { useAuth } from '@/context/AuthContext';
import { Header, Footer } from '@/components/layout';
import { FaGithub } from 'react-icons/fa';

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
      }, 10000);
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
        
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } finally {
      setIsGithubLoading(false);
    }
  };

  if (isRedirecting) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-xl">Redirecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <Header />
        
        {redirectError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {redirectError}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Sign in to GitHub Explorer</h2>
          <p className="text-gray-600">Sign in with your GitHub account to start exploring your repositories</p>
        </div>
        
        <div className="mb-6">
          <GithubLoginButton 
            onLogin={handleGithubLogin}
            isLoading={isGithubLoading}
          />
        </div>
        
        <div className="text-center mt-4 flex flex-col items-center">
          <div className="flex items-center mb-4">
            <FaGithub className="text-gray-800 text-4xl" />
          </div>
          <p className="text-gray-600 text-sm">
            Access your repositories and easily save your favorites
          </p>
        </div>
        
        <Footer />
      </div>
    </main>
  );
} 