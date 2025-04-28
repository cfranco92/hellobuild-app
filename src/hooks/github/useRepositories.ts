import { useState, useCallback, useEffect } from 'react';
import { Repository, User, PageInfo } from '@/types';
import { githubService } from '@/services';

export function useRepositories(user: User | null) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  
  const fetchUserRepositories = useCallback(async (token: string, cursor?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await githubService.getUserRepositories(token, cursor, itemsPerPage);
      
      if (result.success) {
        setRepositories(result.data?.repositories || []);
        setPageInfo(result.data?.pageInfo || null);
        setTotalCount(result.data?.totalCount || 0);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError('Error fetching repositories');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);
  
  useEffect(() => {
    if (!user) {
      setRepositories([]);
      setPageInfo(null);
      setError(null);
      setInitialized(false);
      return;
    }
    
    if (user.githubToken) {
      fetchUserRepositories(user.githubToken);
      setInitialized(true);
    }
  }, [user, fetchUserRepositories]);
  
  const searchRepositories = useCallback(async (query: string, token: string, cursor?: string) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await githubService.searchRepositories(query, token, cursor, itemsPerPage);
      
      if (result.success) {
        setRepositories(result.data?.repositories || []);
        setPageInfo(result.data?.pageInfo || null);
        setTotalCount(result.data?.totalCount || 0);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError('Error searching repositories');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);
  
  const nextPage = useCallback(() => {
    if (!user?.githubToken || !pageInfo?.hasNextPage || !pageInfo.endCursor) return;
    
    setCurrentPage(prev => prev + 1);
    fetchUserRepositories(user.githubToken, pageInfo.endCursor);
  }, [fetchUserRepositories, pageInfo, user]);
  
  const previousPage = useCallback(() => {
    if (!user?.githubToken || !pageInfo?.hasPreviousPage || !pageInfo.startCursor || currentPage <= 1) return;
    
    setCurrentPage(prev => prev - 1);
    fetchUserRepositories(user.githubToken, pageInfo.startCursor);
  }, [currentPage, fetchUserRepositories, pageInfo, user]);
  
  return {
    repositories,
    isLoading,
    error,
    initialized,
    fetchUserRepositories,
    searchRepositories,
    pageInfo,
    totalCount,
    currentPage,
    itemsPerPage,
    nextPage,
    previousPage
  };
} 