import { RepositoryApiResponse, PaginatedApiResponse } from '@/types';
import { config } from '@/config';

interface GitHubRepositoryNode {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  primaryLanguage?: { name: string } | null;
}

interface GitHubEdge {
  node: GitHubRepositoryNode;
  cursor: string;
}

export class GithubApiAdapter {
  private baseUrl = config.api.github.baseUrl;
  private graphqlUrl = 'https://api.github.com/graphql';
  
  async fetchUserRepositories(token: string, cursor?: string, limit: number = 10): Promise<PaginatedApiResponse> {
    const query = `
      query ($first: Int!, $after: String) {
        viewer {
          repositories(first: $first, after: $after, orderBy: {field: UPDATED_AT, direction: DESC}) {
            totalCount
            pageInfo {
              hasNextPage
              hasPreviousPage
              endCursor
              startCursor
            }
            edges {
              cursor
              node {
                id
                name
                description
                url
                stargazerCount
                forkCount
                updatedAt
                primaryLanguage {
                  name
                }
              }
            }
          }
        }
      }
    `;
    
    const variables = {
      first: limit,
      after: cursor || null
    };
    
    const response = await fetch(this.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query, variables })
    });
    
    if (!response.ok) {
      throw new Error('Error fetching repositories');
    }
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message || 'Error in GitHub API');
    }
    
    const repositoriesData = data.data.viewer.repositories;
    const repositories: RepositoryApiResponse[] = repositoriesData.edges.map((edge: GitHubEdge) => ({
      id: edge.node.id,
      name: edge.node.name,
      description: edge.node.description || null,
      html_url: edge.node.url,
      language: edge.node.primaryLanguage?.name || null,
      stargazers_count: edge.node.stargazerCount,
      forks_count: edge.node.forkCount,
      updated_at: edge.node.updatedAt
    }));
    
    return {
      repositories,
      pageInfo: repositoriesData.pageInfo,
      totalCount: repositoriesData.totalCount
    };
  }
  
  async searchRepositories(query: string, token: string, cursor?: string, limit: number = 10): Promise<PaginatedApiResponse> {
    const graphqlQuery = `
      query SearchRepositories($queryString: String!, $first: Int!, $after: String) {
        search(query: $queryString, type: REPOSITORY, first: $first, after: $after) {
          repositoryCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
          edges {
            cursor
            node {
              ... on Repository {
                id
                name
                description
                url
                stargazerCount
                forkCount
                updatedAt
                primaryLanguage {
                  name
                }
              }
            }
          }
        }
      }
    `;
    
    const variables = {
      queryString: query,
      first: limit,
      after: cursor || null
    };
    
    const response = await fetch(this.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query: graphqlQuery, variables })
    });
    
    if (!response.ok) {
      throw new Error('Error searching repositories');
    }
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message || 'Error in GitHub API');
    }
    
    const searchData = data.data.search;
    const repositories: RepositoryApiResponse[] = searchData.edges.map((edge: GitHubEdge) => ({
      id: edge.node.id,
      name: edge.node.name,
      description: edge.node.description || null,
      html_url: edge.node.url,
      language: edge.node.primaryLanguage?.name || null,
      stargazers_count: edge.node.stargazerCount,
      forks_count: edge.node.forkCount,
      updated_at: edge.node.updatedAt
    }));
    
    return {
      repositories,
      pageInfo: searchData.pageInfo,
      totalCount: searchData.repositoryCount
    };
  }
} 