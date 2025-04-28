'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GithubRepos } from '@/components/github';

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
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (authReady && !user && !isLoading) {
    return null;
  }

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome, {user?.displayName || 'User'}!
      </h1>
      <div className="w-full">
        <GithubRepos />
      </div>
    </main>
  );
}
