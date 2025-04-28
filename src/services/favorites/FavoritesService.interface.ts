import { Repository, Result } from '@/types';

export interface FavoritesServiceInterface {
  getFavorites(userId: string): Promise<Result<Repository[]>>;
  addFavorite(userId: string, repository: Repository): Promise<Result<boolean>>;
  removeFavorite(userId: string, repositoryId: string): Promise<Result<boolean>>;
} 