import { useState, useEffect } from 'react';
import { githubService } from '@/services';
import { Repository } from '@/types';

export default function useGithubFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<Repository[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const loadFavorites = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await githubService.getFavorites(userId);
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setFavorites(response.data);
          setFavoriteIds(response.data.map(repo => repo.id));
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError('Error loading favorite repositories');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [userId]);

  const addFavorite = async (repository: Repository) => {
    if (!userId) return false;
    
    try {
      setFavoriteIds(prev => [...prev, repository.id]);
      setFavorites(prev => [...prev, repository]);
      
      const response = await githubService.addFavorite(userId, repository);
      
      if (response.error) {
        setFavoriteIds(prev => prev.filter(id => id !== repository.id));
        setFavorites(prev => prev.filter(repo => repo.id !== repository.id));
        setError(response.error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error adding favorite:', err);
      setFavoriteIds(prev => prev.filter(id => id !== repository.id));
      setFavorites(prev => prev.filter(repo => repo.id !== repository.id));
      setError('Error adding to favorites');
      return false;
    }
  };

  const removeFavorite = async (repositoryId: string) => {
    if (!userId) return false;
    
    try {
      const repoToRemove = favorites.find(repo => repo.id === repositoryId);
      setFavoriteIds(prev => prev.filter(id => id !== repositoryId));
      setFavorites(prev => prev.filter(repo => repo.id !== repositoryId));
      
      const response = await githubService.removeFavorite(userId, repositoryId);
      
      if (response.error) {
        if (repoToRemove) {
          setFavoriteIds(prev => [...prev, repositoryId]);
          setFavorites(prev => [...prev, repoToRemove]);
        }
        setError(response.error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Error removing from favorites');
      return false;
    }
  };

  const isFavorite = (repositoryId: string) => {
    return favoriteIds.includes(repositoryId);
  };

  const toggleFavorite = async (repository: Repository) => {
    if (isFavorite(repository.id)) {
      return await removeFavorite(repository.id);
    } else {
      return await addFavorite(repository);
    }
  };

  return {
    favorites,
    favoriteIds,
    isLoading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
} 