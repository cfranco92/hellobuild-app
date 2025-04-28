import { httpClient } from './httpClient';
import { RepositoryApiResponse } from '@/types';
import { config } from '@/config';

export class GithubApiAdapter {
  private baseUrl = config.api.github.baseUrl;
  
  async fetchUserRepositories(token: string): Promise<RepositoryApiResponse[]> {
    return httpClient.get<RepositoryApiResponse[]>(
      `${this.baseUrl}/user/repos?sort=updated`,
      {
        Authorization: `token ${token}`,
        Accept: `application/vnd.github.${config.api.github.version}+json`
      }
    );
  }
  
  async searchRepositories(query: string, token: string): Promise<RepositoryApiResponse[]> {
    const encodedQuery = encodeURIComponent(query);
    const response = await httpClient.get<{ items: RepositoryApiResponse[] }>(
      `${this.baseUrl}/search/repositories?q=${encodedQuery}&sort=stars&order=desc`,
      {
        Authorization: `token ${token}`,
        Accept: `application/vnd.github.${config.api.github.version}+json`
      }
    );
    
    return response.items;
  }
} 