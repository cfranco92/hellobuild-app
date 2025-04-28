import { FavoritesServiceInterface } from './FavoritesService.interface';
import { Repository, Result, createSuccessResult, createErrorResult } from '@/types';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';

export class FirebaseFavoritesService implements FavoritesServiceInterface {
  async getFavorites(userId: string): Promise<Result<Repository[]>> {
    try {
      const favoritesCollection = collection(db, 'users', userId, 'favorites');
      const snapshot = await getDocs(favoritesCollection);
      
      const repositories: Repository[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        repositories.push(new Repository(
          data.id,
          data.name,
          data.description || null,
          data.url,
          data.language || null,
          data.stars,
          data.forks_count,
          data.updated_at
        ));
      });
      
      return createSuccessResult(repositories);
    } catch (error) {
      console.error('Error getting favorites:', error);
      return createErrorResult('Error loading favorite repositories');
    }
  }
  
  async addFavorite(userId: string, repository: Repository): Promise<Result<boolean>> {
    try {
      const favoritesCollection = collection(db, 'users', userId, 'favorites');
      await addDoc(favoritesCollection, {
        id: repository.id,
        name: repository.name,
        description: repository.description,
        url: repository.url,
        language: repository.language,
        stars: repository.stars,
        forks_count: repository.forks_count,
        updated_at: repository.updated_at,
        added_at: new Date().toISOString()
      });
      
      return createSuccessResult(true);
    } catch (error) {
      console.error('Error adding favorite:', error);
      return createErrorResult('Error adding to favorites');
    }
  }
  
  async removeFavorite(userId: string, repositoryId: string): Promise<Result<boolean>> {
    try {
      const favoritesCollection = collection(db, 'users', userId, 'favorites');
      const q = query(favoritesCollection, where('id', '==', repositoryId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return createErrorResult('Favorite not found');
      }
      
      snapshot.forEach(async (document) => {
        await deleteDoc(doc(db, 'users', userId, 'favorites', document.id));
      });
      
      return createSuccessResult(true);
    } catch (error) {
      console.error('Error removing favorite:', error);
      return createErrorResult('Error removing from favorites');
    }
  }
} 