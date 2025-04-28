export { Repository } from './domain/Repository';
export type { RepositoryApiResponse, PageInfo, PaginatedRepositoriesResponse, PaginatedApiResponse } from './domain/Repository';
export { User } from './domain/User';
export type { FirebaseUserData } from './domain/User';
export { createSuccessResult, createErrorResult } from './common/Result';
export type { Result } from './common/Result';
export { AppError } from './common/AppError';

export interface AsyncResult<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
} 