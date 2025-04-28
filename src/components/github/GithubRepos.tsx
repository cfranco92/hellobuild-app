'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaStar, FaRegStar, FaExclamationCircle, FaGithub, FaSearch, FaToggleOn, FaToggleOff, FaSync } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useGithubFavorites } from '@/hooks';
import { Repository } from '@/types';
import { githubService } from '@/services';

export default function GithubRepos() {
  const { user } = useAuth();
  const { 
    favorites, 
    isFavorite, 
    toggleFavorite,
    error: favoritesError
  } = useGithubFavorites(user?.uid);

  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [useFakeData, setUseFakeData] = useState(false);

  const fetchUserRepositories = useCallback(async () => {
    if (!user || !user.githubToken) {
      setError('No GitHub token found. Please sign in with GitHub.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await githubService.getUserRepositories(user.githubToken);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setRepos(response.data);
      }
    } catch (err) {
      setError('Error loading repositories. Please try again later.');
      console.error('Error loading repositories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.githubToken) {
      fetchUserRepositories();
    }
  }, [user, fetchUserRepositories]);

  useEffect(() => {
    if (favoritesError) {
      setError(favoritesError);
    }
  }, [favoritesError]);

  const loadFakeData = () => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      const fakeRepos: Repository[] = [
        {
          id: '1',
          name: 'react-project',
          description: 'Proyecto de React para desarrollo web',
          url: 'https://github.com/usuario/react-project',
          stars: 25,
          html_url: 'https://github.com/usuario/react-project',
          language: 'JavaScript',
          stargazers_count: 25,
          forks_count: 10,
          updated_at: '2023-05-15T10:30:45Z'
        },
        {
          id: '2',
          name: 'node-api',
          description: 'API REST construida con Node.js',
          url: 'https://github.com/usuario/node-api',
          stars: 18,
          html_url: 'https://github.com/usuario/node-api',
          language: 'TypeScript',
          stargazers_count: 18,
          forks_count: 5,
          updated_at: '2023-06-20T15:20:30Z'
        },
        {
          id: '3',
          name: 'python-ml',
          description: 'Scripts de machine learning en Python',
          url: 'https://github.com/usuario/python-ml',
          stars: 32,
          html_url: 'https://github.com/usuario/python-ml',
          language: 'Python',
          stargazers_count: 32,
          forks_count: 15,
          updated_at: '2023-07-05T08:45:12Z'
        },
        {
          id: '4',
          name: 'typescript-utils',
          description: 'Utilidades para proyectos de TypeScript',
          url: 'https://github.com/usuario/typescript-utils',
          stars: 9,
          html_url: 'https://github.com/usuario/typescript-utils',
          language: 'TypeScript',
          stargazers_count: 9,
          forks_count: 2,
          updated_at: '2023-08-12T11:15:22Z'
        },
        {
          id: '5',
          name: 'css-animations',
          description: 'Ejemplos de animaciones CSS',
          url: 'https://github.com/usuario/css-animations',
          stars: 14,
          html_url: 'https://github.com/usuario/css-animations',
          language: 'CSS',
          stargazers_count: 14,
          forks_count: 3,
          updated_at: '2023-09-03T16:25:18Z'
        }
      ];
      
      setRepos(fakeRepos);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (useFakeData && repos.length === 0) {
      loadFakeData();
    }
  }, [useFakeData, repos.length]);

  const handleSearch = async () => {
    if (useFakeData) {
      loadFakeData();
      return;
    }
    
    if (!user?.githubToken) {
      setError('Please sign in with GitHub first');
      return;
    }

    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await githubService.searchRepositories(searchTerm, user.githubToken);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setRepos(response.data);
      }
    } catch (err) {
      setError('Error searching repositories. Please try again later.');
      console.error('Error searching repositories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFakeMode = () => {
    const newMode = !useFakeData;
    setUseFakeData(newMode);
    
    if (newMode && repos.length === 0) {
      loadFakeData();
    }
  };

  const handleToggleFavorite = async (repository: Repository) => {
    if (!user) return;
    await toggleFavorite(repository);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <FaGithub className="text-2xl mr-2" />
        <h2 className="text-xl font-bold">GitHub Repositories</h2>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
          <FaExclamationCircle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* GitHub login prompt if needed */}
      {!user?.githubToken && !useFakeData && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700 mb-2">
            To view your GitHub repositories, sign in with GitHub from the login page.
          </p>
        </div>
      )}
      
      {/* Toggle for fake data mode */}
      <div className="flex items-center justify-end mb-4">
        <span className="text-sm text-gray-500 mr-2">Fake data mode:</span>
        <button 
          onClick={handleToggleFakeMode}
          className="text-blue-500 hover:text-blue-700"
          aria-label={useFakeData ? "Disable fake data mode" : "Enable fake data mode"}
        >
          {useFakeData ? <FaToggleOn className="text-2xl" /> : <FaToggleOff className="text-2xl text-gray-400" />}
        </button>
      </div>
      
      {/* Search form */}
      <div className="mb-6">
        <div className="flex">
          <div className="relative flex-grow">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchTerm(inputValue);
                  handleSearch();
                }
              }}
              placeholder="Search repositories..."
              className="w-full p-2 pr-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
          <button
            onClick={() => {
              setSearchTerm(inputValue);
              handleSearch();
            }}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('favorites')} 
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'favorites' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Favorites
          </button>
        </nav>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
        </div>
      )}
      
      {/* Repository list */}
      {!isLoading && (
        <div>
          {activeTab === 'all' && repos.length === 0 && !error && (
            <div className="text-center py-4 text-gray-500">
              {user?.githubToken || useFakeData ? (
                <div>
                  <p className="mb-2">No repositories found.</p>
                  <button
                    onClick={user?.githubToken ? fetchUserRepositories : loadFakeData}
                    className="inline-flex items-center text-blue-500 hover:text-blue-700"
                  >
                    <FaSync className="mr-1" /> Reload
                  </button>
                </div>
              ) : (
                <p>Sign in with GitHub to view your repositories</p>
              )}
            </div>
          )}
          
          {activeTab === 'favorites' && favorites.length === 0 && !error && (
            <div className="text-center py-4 text-gray-500">
              <p>You don&apos;t have any favorite repositories</p>
            </div>
          )}
          
          <ul className="space-y-3">
            {(activeTab === 'all' ? repos : favorites).map((repo) => (
              <li key={repo.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h3 className="font-medium text-blue-600">
                      <a 
                        href={repo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{repo.description || 'No description provided'}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" /> {repo.stars}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(repo)}
                    className="ml-2 text-gray-400 hover:text-yellow-400 focus:outline-none"
                    aria-label={isFavorite(repo.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite(repo.id) ? (
                      <FaStar className="text-xl text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-xl" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 