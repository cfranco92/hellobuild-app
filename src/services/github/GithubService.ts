import { GithubServiceInterface } from './GithubService.interface';
import { Repository, Result, createSuccessResult, createErrorResult, PaginatedRepositoriesResponse, RepositoryApiResponse } from '@/types';
import { AppError } from '@/types/common/AppError';

export class GithubService implements GithubServiceInterface {
  async getUserRepositories(token: string, cursor?: string, limit: number = 10): Promise<Result<PaginatedRepositoriesResponse>> {
    try {
      const queryParams = new URLSearchParams({
        token,
        limit: limit.toString()
      });
      
      if (cursor) {
        queryParams.append('cursor', cursor);
      }
      
      const response = await fetch(`/api/github/repositories?${queryParams.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new AppError(error.error || 'Error loading repositories');
      }
      
      const paginatedData = await response.json();
      
      const repositories = paginatedData.repositories.map((repo: RepositoryApiResponse) => Repository.fromApiResponse(repo));
      
      return createSuccessResult({
        repositories,
        pageInfo: paginatedData.pageInfo,
        totalCount: paginatedData.totalCount
      });
    } catch (error) {
      console.error('Error getting user repositories:', error);
      const errorMessage = error instanceof AppError
        ? error.message
        : 'Error loading repositories';
      return createErrorResult(errorMessage);
    }
  }
  
  async searchRepositories(query: string, token: string, cursor?: string, limit: number = 10): Promise<Result<PaginatedRepositoriesResponse>> {
    if (!query.trim()) {
      return createErrorResult('Please enter a search term');
    }
    
    try {
      const queryParams = new URLSearchParams({
        token,
        query,
        limit: limit.toString()
      });
      
      if (cursor) {
        queryParams.append('cursor', cursor);
      }
      
      const response = await fetch(`/api/github/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new AppError(error.error || 'Error searching repositories');
      }
      
      const paginatedData = await response.json();
      
      const repositories = paginatedData.repositories.map((repo: RepositoryApiResponse) => Repository.fromApiResponse(repo));
      
      return createSuccessResult({
        repositories,
        pageInfo: paginatedData.pageInfo,
        totalCount: paginatedData.totalCount
      });
    } catch (error) {
      console.error('Error searching repositories:', error);
      const errorMessage = error instanceof AppError
        ? error.message
        : 'Error searching repositories';
      return createErrorResult(errorMessage);
    }
  }
} 