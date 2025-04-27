'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar, Footer } from '@/components/layout';
import { GithubRepos } from '@/components/github';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaGithub } from 'react-icons/fa';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

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

  const userProfile = {
    name: user.displayName || 'Usuario',
    email: user.email,
    joinDate: new Date().toLocaleDateString(),
    bio: "I'm a ToDo app user who loves staying organized!",
  };
  
  const handleConnectGithub = () => {
    if (githubToken.trim()) {
      console.log('Conectando a GitHub con token:', githubToken);
      setShowTokenInput(false);
      setGithubToken('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-6 sm:p-12 pt-8">
        <div className="max-w-2xl w-full">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">User Profile</h1>
            
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center p-3 border rounded-lg">
                  <FaUser className="text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium">{userProfile.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <FaEnvelope className="text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{userProfile.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <FaCalendarAlt className="text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Joined</div>
                    <div className="font-medium">{userProfile.joinDate}</div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaEdit className="text-blue-500 mr-3" />
                    <div className="text-sm text-gray-500">Bio</div>
                  </div>
                  <p className="text-gray-700">{userProfile.bio}</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FaGithub className="text-blue-500 mr-3" />
                      <div className="text-sm text-gray-500">GitHub Status</div>
                    </div>
                    
                    {!showTokenInput && (
                      <button 
                        onClick={() => setShowTokenInput(true)}
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      >
                        Connect GitHub
                      </button>
                    )}
                  </div>
                  
                  {showTokenInput ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="Enter your GitHub token"
                        className="w-full p-2 border border-gray-300 rounded-md mb-2"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleConnectGithub}
                          className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                          disabled={!githubToken.trim()}
                        >
                          Connect
                        </button>
                        <button
                          onClick={() => setShowTokenInput(false)}
                          className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      Not connected to GitHub
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6">
            <GithubRepos />
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Back to Tasks
            </button>
          </div>
          
          <div className="mt-6">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
} 