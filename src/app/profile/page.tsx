'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Footer } from '@/components/layout';
import { FaUser, FaEnvelope, FaGithub, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 pt-24">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-blue-600 h-32 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
              {user.photoURL ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md" style={{ height: '128px', width: '128px' }}>
                  <Image 
                    src={user.photoURL} 
                    alt="Profile photo" 
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl border-4 border-white shadow-md">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-20 pb-8 px-6 sm:px-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">User Profile</h1>
            <p className="text-gray-500 text-center mb-8">Your personal account information</p>
            
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                  <FaUser className="text-blue-600 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-medium">Name</div>
                  <div className="font-semibold text-gray-800 text-lg">{user.displayName || 'GitHub User'}</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                  <FaEnvelope className="text-blue-600 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-medium">Email</div>
                  <div className="font-semibold text-gray-800 text-lg">{user.email || 'Not available'}</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                  <FaGithub className="text-blue-600 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-medium">GitHub Status</div>
                  {user.githubToken ? (
                    <div className="flex items-center">
                      <span className="font-semibold text-green-600 text-lg mr-2">Connected</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="font-semibold text-red-600 text-lg mr-2">Not connected</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                  <FaShieldAlt className="text-blue-600 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-medium">Account Type</div>
                  <div className="font-semibold text-gray-800 text-lg">
                    {user.githubToken ? 'GitHub OAuth User' : 'Email Account'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <FaArrowLeft className="mr-2" /> Go to Repositories
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </main>
  );
} 