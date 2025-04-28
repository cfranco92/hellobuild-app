import { Repository, Result } from '@/types';

export interface GithubServiceInterface {
  getUserRepositories(token: string): Promise<Result<Repository[]>>;
  searchRepositories(query: string, token: string): Promise<Result<Repository[]>>;
} 