'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { FaArrowLeft, FaInfoCircle, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <Header />
        
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <FaGithub className="text-5xl mx-auto mb-2 text-gray-800" />
            <h1 className="text-2xl font-bold text-gray-900">
              Sign in with GitHub
            </h1>
          </div>
          
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-md mb-4 text-center">
            <FaInfoCircle className="text-blue-500 text-xl mx-auto mb-2" />
            <p className="text-blue-700 mb-2">
              This application only allows sign in with GitHub.
            </p>
            <p className="text-blue-600 text-sm">
              You don&apos;t need to register with email and password.
            </p>
          </div>
          
          <div className="text-center text-gray-500 mb-4">
            You will be automatically redirected to the login page in a few seconds.
          </div>
          
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>
        </div>
        
        <Footer />
      </div>
    </div>
  );
} 