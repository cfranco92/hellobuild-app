import { Repository } from '@/types';
import { ApiResponse } from './types';

interface GitHubRepositoryNode {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  htmlUrl?: string;
  primaryLanguage?: { name: string } | null;
  forkCount: number;
  updatedAt: string;
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
          error: errorData.message || 'Error searching repositories' 
        };
      }
      
      const data = await response.json();
      
      if (data.errors) {
        return { 
          data: null, 
          error: data.errors[0].message || 'Error en la API de GitHub' 
        };
      }
      
      // Transform the GitHub data to our Repository format
      const repositories: Repository[] = data.data.search.edges.map((edge: GitHubEdge) => ({
        id: edge.node.id,
        name: edge.node.name,
        description: edge.node.description || '',
        url: edge.node.url,
        stars: edge.node.stargazerCount,
        html_url: edge.node.url,
        language: edge.node.primaryLanguage?.name,
        stargazers_count: edge.node.stargazerCount,
        forks_count: edge.node.forkCount,
        updated_at: edge.node.updatedAt
      }));
      
      return { data: repositories, error: null };
    } catch (error) {
      console.error('Error searching GitHub repositories:', error);
      return { data: null, error: 'Error de conexión' };
    }
  },

  async getUserRepositories(token: string): Promise<ApiResponse<Repository[]>> {
    try {
      // GitHub GraphQL API endpoint
      const endpoint = 'https://api.github.com/graphql';
      
      // GraphQL query to get user repositories
      const graphqlQuery = {
        query: `
          query {
            viewer {
              repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
                nodes {
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
        `
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
          error: errorData.message || 'Error getting GitHub repositories' 
        };
      }
      
      const data = await response.json();
      
      if (data.errors) {
        return { 
          data: null, 
          error: data.errors[0].message || 'Error en la API de GitHub' 
        };
      }
      
      // Transform the GitHub data to our Repository format
      const repositories: Repository[] = data.data.viewer.repositories.nodes.map((node: GitHubRepositoryNode) => ({
        id: node.id,
        name: node.name,
        description: node.description || '',
        url: node.url,
        stars: node.stargazerCount,
        html_url: node.url,
        language: node.primaryLanguage?.name,
        stargazers_count: node.stargazerCount,
        forks_count: node.forkCount,
        updated_at: node.updatedAt
      }));
      
      return { data: repositories, error: null };
    } catch (error) {
      console.error('Error getting user repositories:', error);
      return { data: null, error: 'Error de conexión' };
    }
  },

  async getFavorites(userId: string): Promise<ApiResponse<Repository[]>> {
    try {
      const response = await fetch(`/api/github/favorites?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error retrieving favorite repositories' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error getting favorite repositories:', error);
      return { data: null, error: 'Error de conexión' };
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
        return { data: null, error: errorData.error || 'Error al añadir repositorio favorito' };
      }
      
      return { data: true, error: null };
    } catch (error) {
      console.error('Error adding favorite repository:', error);
      return { data: null, error: 'Error de conexión' };
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
        return { data: null, error: errorData.error || 'Error al eliminar repositorio favorito' };
      }
      
      return { data: true, error: null };
    } catch (error) {
      console.error('Error removing favorite repository:', error);
      return { data: null, error: 'Error de conexión' };
    }
  }
}; 