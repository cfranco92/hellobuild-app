import { Repository } from '@/types';
import { ApiResponse } from './types';

interface GitHubRepositoryNode {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
}

interface GitHubEdge {
  node: GitHubRepositoryNode;
}

export const githubService = {
  async searchRepositories(query: string, token: string): Promise<ApiResponse<Repository[]>> {
    try {
      // GitHub GraphQL API endpoint
      const endpoint = 'https://api.github.com/graphql';
      
      // GraphQL query to search repositories
      const graphqlQuery = {
        query: `
          query SearchRepositories($queryString: String!) {
            search(query: $queryString, type: REPOSITORY, first: 10) {
              repositoryCount
              edges {
                node {
                  ... on Repository {
                    id
                    name
                    description
                    url
                    stargazerCount
                  }
                }
              }
            }
          }
        `,
        variables: {
          queryString: query
        }
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(graphqlQuery)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { 
          data: null, 
          error: errorData.message || 'Error searching GitHub repositories' 
        };
      }
      
      const data = await response.json();
      
      if (data.errors) {
        return { 
          data: null, 
          error: data.errors[0].message || 'Error from GitHub API' 
        };
      }
      
      // Transform the GitHub data to our Repository format
      const repositories: Repository[] = data.data.search.edges.map((edge: GitHubEdge) => ({
        id: edge.node.id,
        name: edge.node.name,
        description: edge.node.description || '',
        url: edge.node.url,
        stars: edge.node.stargazerCount
      }));
      
      return { data: repositories, error: null };
    } catch (error) {
      console.error('Error searching GitHub repositories:', error);
      return { data: null, error: 'Connection error' };
    }
  },

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