import { GithubServiceInterface } from './GithubService.interface';
import { GithubApiAdapter } from '../api/GithubApiAdapter';
import { Repository, Result, createSuccessResult, createErrorResult } from '@/types';
import { AppError } from '@/types/common/AppError';

export class GithubService implements GithubServiceInterface {
  constructor(private api: GithubApiAdapter = new GithubApiAdapter()) {}
  
  async getUserRepositories(token: string): Promise<Result<Repository[]>> {
    try {
      const data = await this.api.fetchUserRepositories(token);
      return createSuccessResult(
        data.map(repo => Repository.fromApiResponse(repo))
      );
    } catch (error) {
      console.error('Error getting user repositories:', error);
      const errorMessage = error instanceof AppError
        ? error.message
        : 'Error loading repositories';
      return createErrorResult(errorMessage);
    }
  }
  
  async searchRepositories(query: string, token: string): Promise<Result<Repository[]>> {
    if (!query.trim()) {
      return createErrorResult('Please enter a search term');
    }
    
    try {
      const data = await this.api.searchRepositories(query, token);
      return createSuccessResult(
        data.map(repo => Repository.fromApiResponse(repo))
      );
    } catch (error) {
      console.error('Error searching repositories:', error);
      const errorMessage = error instanceof AppError
        ? error.message
        : 'Error searching repositories';
      return createErrorResult(errorMessage);
    }
  }
} 