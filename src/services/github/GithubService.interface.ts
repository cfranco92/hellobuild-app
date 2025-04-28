import { Result, PaginatedRepositoriesResponse } from '@/types';

export interface GithubServiceInterface {
  getUserRepositories(token: string, cursor?: string, limit?: number): Promise<Result<PaginatedRepositoriesResponse>>;
  searchRepositories(query: string, token: string, cursor?: string, limit?: number): Promise<Result<PaginatedRepositoriesResponse>>;
} 