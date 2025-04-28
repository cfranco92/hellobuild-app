import { GithubService } from './github/GithubService';
import { FirebaseFavoritesService } from './favorites/FirebaseFavoritesService';
export * from './types';
export { authService } from './auth';

export const githubService = new GithubService();
export const favoritesService = new FirebaseFavoritesService(); 