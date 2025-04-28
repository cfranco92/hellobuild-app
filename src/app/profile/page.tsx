'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Footer } from '@/components/layout';
import { GithubRepos } from '@/components/github';
import { FaUser, FaEnvelope, FaGithub, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !user) {
      router.push('/login');
    }
  }, [user, router, isClient]);

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-col items-center justify-center p-6 sm:p-12 pt-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Perfil de Usuario</h1>
          
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="mb-6 md:mb-0 md:mr-8">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Foto de perfil" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500" 
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center p-3 border rounded-lg">
                <FaUser className="text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Nombre</div>
                  <div className="font-medium">{user.displayName || 'Usuario de GitHub'}</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg">
                <FaEnvelope className="text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{user.email || 'No disponible'}</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg">
                <FaGithub className="text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Estado de GitHub</div>
                  <div className="font-medium">
                    {user.githubToken ? (
                      <span className="text-green-600">Conectado</span>
                    ) : (
                      <span className="text-red-600">No conectado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <GithubRepos />
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-700">
            <FaArrowLeft className="mr-1" /> Back to Repositories
          </Link>
        </div>
        
        <div className="mt-6">
          <Footer />
        </div>
      </div>
    </main>
  );
} 