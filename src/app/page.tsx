'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GithubRepos } from '@/components/github';
import { FaGithub } from 'react-icons/fa';

export default function Home() {
  const { user, isLoading, authReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authReady && !user && !isLoading) {
      router.push('/login');
    }
  }, [user, isLoading, authReady, router]);

  if (isLoading || !authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="mb-5 h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-xl font-medium text-gray-700">Loading your GitHub data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we connect to GitHub</p>
        </div>
      </div>
    );
  }

  if (authReady && !user && !isLoading) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
            <FaGithub className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome, <span className="text-blue-600">{user?.displayName || 'GitHub User'}</span>!
            </h1>
            <p className="text-gray-600 mt-1">Explore your repositories and save your favorites</p>
          </div>
        </div>
        
        <GithubRepos />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Connected to GitHub with access to public and private repositories</p>
        </div>
      </div>
    </main>
  );
}
