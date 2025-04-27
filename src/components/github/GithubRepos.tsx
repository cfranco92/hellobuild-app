'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaExclamationCircle, FaGithub, FaSearch, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { Repository } from '@/types';
import { githubService } from '@/services';

export default function GithubRepos() {
  const { user } = useAuth();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [favorites, setFavorites] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [isClient, setIsClient] = useState(false);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [useFakeData, setUseFakeData] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setGithubToken(savedToken);
    } else {
      setShowTokenInput(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !user) return;

    const loadFavorites = async () => {
      try {
        const response = await githubService.getFavorites(user.uid);
        if (response.error) {
          console.error('Error loading favorites:', response.error);
          return;
        }

        if (response.data) {
          setFavorites(response.data);
          setUserFavorites(response.data.map(repo => repo.id));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [user, isClient]);

  const loadFakeData = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay
    setTimeout(() => {
      const fakeRepos: Repository[] = [
        {
          id: '1',
          name: 'react-project',
          description: 'A React project for web development',
          url: 'https://github.com/user/react-project',
          stars: 25
        },
        {
          id: '2',
          name: 'node-api',
          description: 'REST API built with Node.js',
          url: 'https://github.com/user/node-api',
          stars: 18
        },
        {
          id: '3',
          name: 'python-ml',
          description: 'Machine learning scripts in Python',
          url: 'https://github.com/user/python-ml',
          stars: 32
        },
        {
          id: '4',
          name: 'typescript-utils',
          description: 'Utility functions for TypeScript projects',
          url: 'https://github.com/user/typescript-utils',
          stars: 9
        },
        {
          id: '5',
          name: 'css-animations',
          description: 'Examples of CSS animations',
          url: 'https://github.com/user/css-animations',
          stars: 14
        }
      ];
      
      setRepos(fakeRepos);
      setIsLoading(false);
    }, 1000);
  };

  // Auto-load fake data when fake mode is enabled
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
    
    if (!githubToken) {
      setError('Please provide a GitHub token first');
      setShowTokenInput(true);
      return;
    }

    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await githubService.searchRepositories(searchTerm, githubToken);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setRepos(response.data);
      }
    } catch (err) {
      setError('Failed to search repositories. Please try again later.');
      console.error('Error searching repositories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToken = () => {
    if (!githubToken.trim()) {
      setError('Please enter a valid GitHub token');
      return;
    }
    
    // Save token to localStorage for future use
    localStorage.setItem('github_token', githubToken);
    setShowTokenInput(false);
    setError(null);
  };

  const handleToggleFakeMode = () => {
    const newMode = !useFakeData;
    setUseFakeData(newMode);
    
    // Auto load fake data when switching to fake mode
    if (newMode && repos.length === 0) {
      loadFakeData();
    }
  };

  const toggleFavorite = async (repository: Repository) => {
    if (!user) return;
    
    const isFavorite = userFavorites.includes(repository.id);
    
    try {
      if (isFavorite) {
        setUserFavorites(prev => prev.filter(id => id !== repository.id));
        setFavorites(prev => prev.filter(repo => repo.id !== repository.id));
        
        const response = await githubService.removeFavorite(user.uid, repository.id);
        
        if (response.error) {
          console.error('Error removing favorite:', response.error);
          setUserFavorites(prev => [...prev, repository.id]);
          setFavorites(prev => [...prev, repository]);
        }
      } else {
        setUserFavorites(prev => [...prev, repository.id]);
        setFavorites(prev => [...prev, repository]);
        
        const response = await githubService.addFavorite(user.uid, repository);
        
        if (response.error) {
          console.error('Error adding favorite:', response.error);
          setUserFavorites(prev => prev.filter(id => id !== repository.id));
          setFavorites(prev => prev.filter(repo => repo.id !== repository.id));
        }
      }
    } catch (error) {
      console.error('Error managing favorite:', error);
      if (isFavorite) {
        setUserFavorites(prev => [...prev, repository.id]);
        setFavorites(prev => [...prev, repository]);
      } else {
        setUserFavorites(prev => prev.filter(id => id !== repository.id));
        setFavorites(prev => prev.filter(repo => repo.id !== repository.id));
      }
    }
  };

  const filteredRepos = activeTab === 'all' 
    ? repos.filter(repo => 
        repo.name.toLowerCase().includes(inputValue.toLowerCase()) || 
        repo.description.toLowerCase().includes(inputValue.toLowerCase())
      )
    : favorites.filter(repo => 
        repo.name.toLowerCase().includes(inputValue.toLowerCase()) || 
        repo.description.toLowerCase().includes(inputValue.toLowerCase())
      );

  if (!user) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">Please log in to view your repositories.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaGithub className="text-gray-700 text-xl mr-2" />
            <h2 className="text-xl font-bold text-gray-800">GitHub Repositories</h2>
          </div>
          <button
            onClick={handleToggleFakeMode}
            className="flex items-center text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
            title={useFakeData ? "Switch to real GitHub data" : "Switch to fake data"}
          >
            {useFakeData ? (
              <>
                <FaToggleOn className="text-green-500 mr-2 text-lg" />
                Using Fake Data
              </>
            ) : (
              <>
                <FaToggleOff className="text-gray-400 mr-2 text-lg" />
                Use Fake Data
              </>
            )}
          </button>
        </div>
        
        {!useFakeData && (showTokenInput ? (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium mb-2">GitHub Personal Access Token</h3>
            <p className="text-sm text-gray-600 mb-3">
              To search GitHub repositories, you need to provide a Personal Access Token with repo scope.
            </p>
            
            <input
              type="text"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="Enter your GitHub token"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            
            <div className="flex space-x-2">
              <button
                onClick={handleSaveToken}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                disabled={!githubToken.trim()}
              >
                Save Token
              </button>
              {githubToken && (
                <button
                  onClick={() => setShowTokenInput(false)}
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <button
              onClick={() => setShowTokenInput(true)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Change GitHub Token
            </button>
          </div>
        ))}
        
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Search Repositories
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === 'favorites' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Favorites ({favorites.length})
          </button>
        </div>
        
        {activeTab === 'all' && (
          <div className="mb-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Search GitHub repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md flex items-center"
              >
                <FaSearch className="mr-1" /> Search
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {useFakeData ? 
                "Using fake data - example repositories will load automatically" : 
                "Search for repositories on GitHub (e.g., &quot;react&quot;, &quot;user:microsoft&quot;, &quot;stars:{'>'}1000&quot;)"
              }
            </p>
          </div>
        )}
        
        {activeTab === 'favorites' && (
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Filter favorites..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              {inputValue && (
                <button onClick={() => setInputValue('')} className="text-gray-400">
                  ✕
                </button>
              )}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-center p-4 mb-4 text-red-500 bg-red-50 rounded-md">
          <FaExclamationCircle className="inline-block mr-2 text-lg" />
          <p className="inline-block">{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent mx-auto mb-2"></div>
          <p className="text-gray-600">Loading repositories...</p>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {activeTab === 'all' 
              ? 'No repositories found. Try searching for repositories.' 
              : 'No favorite repositories yet.'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
          {filteredRepos.map(repo => (
            <li key={repo.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <a 
                    href={repo.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline text-lg font-medium"
                  >
                    {repo.name}
                  </a>
                  <p className="text-gray-600 mt-1">{repo.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {repo.stars} stars
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(repo)}
                  className="text-xl text-gray-400 hover:text-yellow-400 transition-colors"
                  aria-label={userFavorites.includes(repo.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  {userFavorites.includes(repo.id) ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 