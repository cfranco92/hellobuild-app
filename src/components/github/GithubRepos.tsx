'use client';

import { useState } from 'react';
import { FaStar, FaRegStar, FaExclamationCircle, FaGithub, FaSearch, FaSync, FaCode, FaCodeBranch } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useGithubFavorites, useRepositories } from '@/hooks';
import { Repository } from '@/types';

export default function GithubRepos() {
  const { user } = useAuth();
  const { 
    favorites, 
    isFavorite, 
    toggleFavorite,
    error: favoritesError
  } = useGithubFavorites(user?.uid);
  
  const {
    repositories: repos,
    isLoading,
    error: reposError,
    fetchUserRepositories,
    searchRepositories
  } = useRepositories(user);

  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  
  const error = favoritesError || reposError;

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      return;
    }
    
    if (!user?.githubToken) {
      return;
    }

    await searchRepositories(query, user.githubToken);
  };

  const handleToggleFavorite = async (repository: Repository) => {
    if (!user) return;
    await toggleFavorite(repository);
  };

  const handleReload = () => {
    if (user?.githubToken) {
      fetchUserRepositories(user.githubToken);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
          <FaGithub className="text-blue-600 text-xl" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">GitHub Repositories</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start border border-red-200">
          <FaExclamationCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      
      {!user?.githubToken && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-blue-700 mb-2 text-sm sm:text-base font-medium">
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
              className="w-full p-3 pl-12 border border-gray-300 bg-gray-50 text-gray-900 font-medium rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
          </div>
          <button
            onClick={() => {
              handleSearch(inputValue);
            }}
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg sm:rounded-l-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
              activeTab === 'all' 
                ? 'border-blue-500 text-blue-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaGithub className="mr-2" />
            All Repositories
          </button>
          <button 
            onClick={() => setActiveTab('favorites')} 
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
              activeTab === 'favorites' 
                ? 'border-blue-500 text-blue-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaStar className="mr-2" />
            Favorites
          </button>
        </nav>
      </div>
      
      {isLoading && (
        <div className="flex justify-center my-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
        </div>
      )}
      
      {!isLoading && (
        <div>
          {activeTab === 'all' && repos.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              {user?.githubToken ? (
                <div>
                  <FaGithub className="mx-auto text-gray-300 text-5xl mb-3" />
                  <p className="mb-3 font-medium">No repositories found.</p>
                  <button
                    onClick={handleReload}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                  >
                    <FaSync className="mr-2" /> Reload Repositories
                  </button>
                </div>
              ) : (
                <p className="font-medium">Sign in with GitHub to view your repositories</p>
              )}
            </div>
          )}
          
          {activeTab === 'favorites' && favorites.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              <FaStar className="mx-auto text-gray-300 text-5xl mb-3" />
              <p className="font-medium">You don&apos;t have any favorite repositories</p>
              <p className="text-sm mt-2">Click the star icon on repositories to add them to your favorites</p>
            </div>
          )}
          
          <ul className="space-y-4">
            {(activeTab === 'all' ? repos : favorites).map((repo) => (
              <li key={repo.id} className="border border-gray-200 hover:border-blue-200 rounded-xl p-4 sm:p-5 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-grow mb-3 sm:mb-0 sm:pr-4">
                    <h3 className="font-semibold text-blue-700 text-lg sm:text-xl break-words leading-tight mb-2">
                      <a 
                        href={repo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 mb-3 break-words">{repo.description || 'No description provided'}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {repo.language && (
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium flex items-center">
                          <FaCode className="mr-1" /> {repo.language}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium flex items-center">
                        <FaStar className="mr-1" /> {repo.stars}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-medium flex items-center">
                        <FaCodeBranch className="mr-1" /> {repo.forks_count}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                        Updated {repo.formattedDate}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(repo)}
                    className="self-end sm:self-start flex-shrink-0 focus:outline-none transform hover:scale-110 transition-transform duration-200"
                    aria-label={isFavorite(repo.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite(repo.id) ? (
                      <FaStar className="text-3xl text-yellow-500 drop-shadow-sm" />
                    ) : (
                      <FaRegStar className="text-3xl text-gray-400 hover:text-yellow-500" />
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