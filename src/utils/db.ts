import { User, Repository } from '@/types';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  doc,
  serverTimestamp,
  setDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';
const FAVORITES_COLLECTION = 'favorites';

export const createUser = async (userData: Omit<User, 'uid'>): Promise<User> => {
  try {
    const userRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...userData,
      createdAt: serverTimestamp()
    });
    
    return {
      uid: userRef.id,
      ...userData
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return undefined;
    
    const doc = snapshot.docs[0];
    return {
      uid: doc.id,
      ...doc.data() as Omit<User, 'uid'>
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const getUserById = async (uid: string): Promise<User | undefined> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    
    if (!userDoc.exists()) return undefined;
    
    return {
      uid: userDoc.id,
      ...userDoc.data() as Omit<User, 'uid'>
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const getFavoriteRepos = async (userId: string): Promise<Repository[]> => {
  try {
    const favoritesRef = doc(db, FAVORITES_COLLECTION, userId);
    const favoriteDoc = await getDoc(favoritesRef);
    
    if (!favoriteDoc.exists()) return [];
    
    const data = favoriteDoc.data();
    return data.repositories || [];
  } catch (error) {
    console.error('Error getting favorite repositories:', error);
    return [];
  }
};

export const addFavoriteRepo = async (userId: string, repository: Repository): Promise<boolean> => {
  try {
    const favoritesRef = doc(db, FAVORITES_COLLECTION, userId);
    const favoriteDoc = await getDoc(favoritesRef);
    
    if (!favoriteDoc.exists()) {
      await setDoc(favoritesRef, {
        repositories: [repository]
      });
      return true;
    }
    
    await updateDoc(favoritesRef, {
      repositories: arrayUnion(repository)
    });
    
    return true;
  } catch (error) {
    console.error('Error adding favorite repository:', error);
    throw error;
  }
};

export const removeFavoriteRepo = async (userId: string, repositoryId: string): Promise<boolean> => {
  try {
    const favoritesRef = doc(db, FAVORITES_COLLECTION, userId);
    const favoriteDoc = await getDoc(favoritesRef);
    
    if (!favoriteDoc.exists()) return false;
    
    const data = favoriteDoc.data();
    const repositories = data.repositories || [];
    
    const repoToRemove = repositories.find((repo: Repository) => repo.id === repositoryId);
    if (!repoToRemove) return false;
    
    await updateDoc(favoritesRef, {
      repositories: arrayRemove(repoToRemove)
    });
    
    return true;
  } catch (error) {
    console.error('Error removing favorite repository:', error);
    throw error;
  }
};
