import { Repository } from '@/types';
import { ApiResponse } from './types';

export const githubService = {
  async getFavorites(userId: string): Promise<ApiResponse<Repository[]>> {
    try {
      const response = await fetch(`/api/github/favorites?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error getting favorite repositories' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error getting favorite repositories:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  async addFavorite(userId: string, repository: Repository): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`/api/github/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          repository
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error adding favorite repository' };
      }
      
      return { data: true, error: null };
    } catch (error) {
      console.error('Error adding favorite repository:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  async removeFavorite(userId: string, repositoryId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`/api/github/favorites`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          repositoryId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error removing favorite repository' };
      }
      
      return { data: true, error: null };
    } catch (error) {
      console.error('Error removing favorite repository:', error);
      return { data: null, error: 'Connection error' };
    }
  }
}; 