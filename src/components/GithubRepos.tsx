'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaExclamationCircle, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Repository } from '@/types';
import { favoritesService } from '@/services/api';

export default function GithubRepos() {
  const { user } = useAuth();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [favorites, setFavorites] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [isClient, setIsClient] = useState(false);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !user) return;

    const loadFavorites = async () => {
      try {
        const response = await favoritesService.getFavorites(user.uid);
        if (response.error) {
          console.error('Error al cargar favoritos:', response.error);
          return;
        }

        if (response.data) {
          setFavorites(response.data);
          setUserFavorites(response.data.map(repo => repo.id));
        }
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      }
    };

    loadFavorites();
  }, [user, isClient]);

  useEffect(() => {
    if (!isClient || !user) return;

    setIsLoading(true);
    setError(null);
    
    const loadRepositories = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockRepos: Repository[] = [
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
        
        setRepos(mockRepos);
      } catch (err) {
        setError('Failed to load repositories. Please try again later.');
        console.error('Error loading repositories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRepositories();
  }, [user, isClient]);

  const toggleFavorite = async (repository: Repository) => {
    if (!user) return;
    
    const isFavorite = userFavorites.includes(repository.id);
    
    try {
      if (isFavorite) {
        setUserFavorites(prev => prev.filter(id => id !== repository.id));
        setFavorites(prev => prev.filter(repo => repo.id !== repository.id));
        
        const response = await favoritesService.removeFavorite(user.uid, repository.id);
        
        if (response.error) {
          console.error('Error al eliminar favorito:', response.error);
          setUserFavorites(prev => [...prev, repository.id]);
          setFavorites(prev => [...prev, repository]);
        }
      } else {
        setUserFavorites(prev => [...prev, repository.id]);
        setFavorites(prev => [...prev, repository]);
        
        const response = await favoritesService.addFavorite(user.uid, repository);
        
        if (response.error) {
          console.error('Error al añadir favorito:', response.error);
          setUserFavorites(prev => prev.filter(id => id !== repository.id));
          setFavorites(prev => prev.filter(repo => repo.id !== repository.id));
        }
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
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
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        repo.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : favorites.filter(repo => 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        repo.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex items-center mb-4">
          <FaGithub className="text-gray-700 text-xl mr-2" />
          <h2 className="text-xl font-bold text-gray-800">GitHub Repositories</h2>
        </div>
        
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Repositories
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
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400">
                ✕
              </button>
            )}
          </span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center p-6">
          <p className="text-gray-600">Loading repositories...</p>
        </div>
      ) : error ? (
        <div className="text-center p-6 text-red-500">
          <FaExclamationCircle className="mx-auto mb-2 text-2xl" />
          <p>{error}</p>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-gray-600">
            {activeTab === 'all' 
              ? 'No repositories found.' 
              : 'No favorite repositories yet.'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {filteredRepos.map(repo => (
            <li key={repo.id} className="py-4 px-1">
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