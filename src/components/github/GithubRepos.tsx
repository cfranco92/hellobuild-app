'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaStar, FaRegStar, FaExclamationCircle, FaGithub, FaSearch, FaSync } from 'react-icons/fa';
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
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

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

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    if (!user?.githubToken) {
      setError('Please sign in with GitHub first');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await githubService.searchRepositories(query, user.githubToken);
      
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
  }, [user]);

  const handleToggleFavorite = async (repository: Repository) => {
    if (!user) return;
    await toggleFavorite(repository);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex items-center mb-6">
        <FaGithub className="text-xl sm:text-2xl mr-2" />
        <h2 className="text-lg sm:text-xl font-bold">GitHub Repositories</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
          <FaExclamationCircle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {!user?.githubToken && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700 mb-2 text-sm sm:text-base">
            To view your GitHub repositories, sign in with GitHub from the login page.
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
          <div className="relative flex-grow">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(inputValue);
                }
              }}
              placeholder="Search repositories..."
              className="w-full p-2 pr-10 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
          <button
            onClick={() => {
              handleSearch(inputValue);
            }}
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-200 mb-4 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8">
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
      
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
        </div>
      )}
      
      {!isLoading && (
        <div>
          {activeTab === 'all' && repos.length === 0 && !error && (
            <div className="text-center py-4 text-gray-500">
              {user?.githubToken ? (
                <div>
                  <p className="mb-2">No repositories found.</p>
                  <button
                    onClick={fetchUserRepositories}
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
              <li key={repo.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-grow mb-2 sm:mb-0">
                    <h3 className="font-medium text-blue-600 text-base sm:text-lg break-words">
                      <a 
                        href={repo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 break-words">{repo.description || 'No description provided'}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span className="flex items-center mr-2">
                        <FaStar className="text-yellow-400 mr-1" /> {repo.stars}
                      </span>
                      {repo.language && (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 mr-2">
                          {repo.language}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(repo)}
                    className="self-end sm:self-start ml-auto sm:ml-0 text-gray-400 hover:text-yellow-400 focus:outline-none"
                    aria-label={isFavorite(repo.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite(repo.id) ? (
                      <FaStar className="text-2xl text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-2xl" />
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