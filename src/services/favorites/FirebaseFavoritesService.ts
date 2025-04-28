import { FavoritesServiceInterface } from './FavoritesService.interface';
import { Repository, Result, createSuccessResult, createErrorResult } from '@/types';

export class FirebaseFavoritesService implements FavoritesServiceInterface {
  async getFavorites(userId: string): Promise<Result<Repository[]>> {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error loading favorites');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        return createErrorResult(data.error || 'Error loading favorite repositories');
      }
      
      interface RepoData {
        id: string;
        name: string;
        description: string | null;
        url: string;
        language: string | null;
        stars: number;
        forks_count: number;
        updated_at: string;
      }
      
      const repositories: Repository[] = data.data.map((repo: RepoData) => new Repository(
        repo.id,
        repo.name,
        repo.description || null,
        repo.url,
        repo.language || null,
        repo.stars,
        repo.forks_count,
        repo.updated_at
      ));
      
      return createSuccessResult(repositories);
    } catch (error) {
      console.error('Error getting favorites:', error);
      return createErrorResult('Error loading favorite repositories');
    }
  }
  
  async addFavorite(userId: string, repository: Repository): Promise<Result<boolean>> {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, repository })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error adding to favorites');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        return createErrorResult(data.error || 'Error adding to favorites');
      }
      
      return createSuccessResult(true);
    } catch (error) {
      console.error('Error adding favorite:', error);
      return createErrorResult('Error adding to favorites');
    }
  }
  
  async removeFavorite(userId: string, repositoryId: string): Promise<Result<boolean>> {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}&repositoryId=${repositoryId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error removing from favorites');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        return createErrorResult(data.error || 'Error removing from favorites');
      }
      
      return createSuccessResult(true);
    } catch (error) {
      console.error('Error removing favorite:', error);
      return createErrorResult('Error removing from favorites');
    }
  }
} 