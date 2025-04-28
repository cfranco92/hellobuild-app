import { useState, useCallback } from 'react';
import { Repository } from '@/types';
import { githubService } from '@/services';

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUserRepositories = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    const result = await githubService.getUserRepositories(token);
    
    if (result.success && result.data) {
      setRepositories(result.data);
    } else {
      setError(result.error || 'Unknown error');
    }
    
    setIsLoading(false);
  }, []);
  
  const searchRepositories = useCallback(async (query: string, token: string) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const result = await githubService.searchRepositories(query, token);
    
    if (result.success && result.data) {
      setRepositories(result.data);
    } else {
      setError(result.error || 'Unknown error');
    }
    
    setIsLoading(false);
  }, []);
  
  return {
    repositories,
    isLoading,
    error,
    fetchUserRepositories,
    searchRepositories
  };
} 