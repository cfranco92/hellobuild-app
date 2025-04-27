'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignupForm } from '@/components/auth';
import { useAuth } from '@/context/AuthContext';
import { Header, Footer } from '@/components/layout';

export default function SignupPage() {
  const { user, signup, isLoading, error } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);

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

  const handleSignup = async (name: string, email: string, password: string) => {
    setRedirectError(null);
    const success = await signup(name, email, password);
    
    if (success) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  };

  if (isRedirecting) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent mx-auto"></div>
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
        <SignupForm 
          onSignup={handleSignup} 
          isLoading={isLoading} 
          error={error} 
        />
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-700">
              Login here
            </Link>
          </p>
        </div>
        <Footer />
      </div>
    </main>
  );
} 