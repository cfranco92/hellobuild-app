'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { auth, githubProvider } from '@/lib/firebase';
import {
  onAuthStateChanged,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  GithubAuthProvider
} from 'firebase/auth';
import { config } from '@/config';
import { getTokenFromIndexedDB, saveTokenToIndexedDB, removeTokenFromIndexedDB } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  authReady: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  loginWithGithub: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isGithubUser = firebaseUser.providerData.some(
          provider => provider.providerId === 'github.com'
        );
        
        let githubToken = null;
        if (isGithubUser) {
          try {
            githubToken = await getTokenFromIndexedDB(config.auth.tokenStorageKey);
          } catch (error) {
            console.error('Error getting token from IndexedDB:', error);
            githubToken = localStorage.getItem(config.auth.tokenStorageKey);
          }
        }
        
        setUser(new User(
          firebaseUser.uid,
          firebaseUser.email,
          firebaseUser.displayName,
          firebaseUser.photoURL,
          githubToken
        ));
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
      setAuthReady(true);
    }, (authError) => {
      console.error('Authentication error:', authError);
      setError('Authentication error');
      setIsLoading(false);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      
      let errorMessage = 'Error during sign in. Please try again.';
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as { code: string };
        
        if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
          errorMessage = 'Invalid credentials';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed attempts. Please try again later.';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      
      let errorMessage = 'Error during sign up. Please try again.';
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as { code: string };
        
        if (firebaseError.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered';
        } else if (firebaseError.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      await firebaseSignOut(auth);
      
      try {
        await removeTokenFromIndexedDB(config.auth.tokenStorageKey);
      } catch (error) {
        console.error('Error removing token from IndexedDB:', error);
        localStorage.removeItem(config.auth.tokenStorageKey);
      }
      
      sessionStorage.clear();
      setUser(null);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Error signing out');
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGithub = async (): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      githubProvider.addScope('repo');
      githubProvider.setCustomParameters({
        'allow_signup': 'false'
      });
      
      const result = await signInWithPopup(auth, githubProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      
      if (credential) {
        const token = credential.accessToken || '';
        
        try {
          await saveTokenToIndexedDB(config.auth.tokenStorageKey, token);
        } catch (error) {
          console.error('Error saving token to IndexedDB:', error);
          localStorage.setItem(config.auth.tokenStorageKey, token);
        }
        
        if (result.user) {
          setUser(new User(
            result.user.uid,
            result.user.email,
            result.user.displayName,
            result.user.photoURL,
            token
          ));
        }
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error during GitHub login:', error);
      
      let errorMessage = 'Error signing in with GitHub. Please try again.';
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        
        if (firebaseError.code === 'auth/account-exists-with-different-credential') {
          errorMessage = 'An account already exists with this email using another sign-in method.';
        } else if (firebaseError.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Sign in canceled. The popup was closed.';
        } else if (firebaseError.message) {
          errorMessage = firebaseError.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      authReady,
      error,
      login, 
      signup, 
      logout,
      loginWithGithub
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 