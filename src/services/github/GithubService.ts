import { GithubServiceInterface } from './GithubService.interface';
import { GithubApiAdapter } from '../api/GithubApiAdapter';
import { Repository, Result, createSuccessResult, createErrorResult, PaginatedRepositoriesResponse } from '@/types';
import { AppError } from '@/types/common/AppError';

export class GithubService implements GithubServiceInterface {
  constructor(private api: GithubApiAdapter = new GithubApiAdapter()) {}
  
  async getUserRepositories(token: string, cursor?: string, limit: number = 10): Promise<Result<PaginatedRepositoriesResponse>> {
    try {
      const paginatedData = await this.api.fetchUserRepositories(token, cursor, limit);
      
      const repositories = paginatedData.repositories.map(repo => Repository.fromApiResponse(repo));
      
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
      const paginatedData = await this.api.searchRepositories(query, token, cursor, limit);
      
      const repositories = paginatedData.repositories.map(repo => Repository.fromApiResponse(repo));
      
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