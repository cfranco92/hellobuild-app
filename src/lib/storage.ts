import { config } from '@/config';

const DB_NAME = 'githubExplorerDB';
const DB_VERSION = 1;
const STORE_NAME = 'authTokens';

interface TokenRecord {
  key: string;
  value: string;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('Browser does not support IndexedDB'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

export async function saveTokenToIndexedDB(key: string, value: string): Promise<void> {
  if (typeof window === 'undefined') {
    localStorage.setItem(config.auth.tokenStorageKey, value);
    return;
  }
  
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.put({ key, value } as TokenRecord);
      
      request.onerror = () => {
        reject(request.error);
      };
      
      request.onsuccess = () => {
        resolve();
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error using IndexedDB, falling back to localStorage:', error);
    localStorage.setItem(key, value);
  }
}

export async function getTokenFromIndexedDB(key: string): Promise<string | null> {
  if (typeof window === 'undefined') {
    return localStorage.getItem(config.auth.tokenStorageKey);
  }
  
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.get(key);
      
      request.onerror = () => {
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const result = request.result as TokenRecord | undefined;
        resolve(result ? result.value : null);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error using IndexedDB, falling back to localStorage:', error);
    return localStorage.getItem(key);
  }
}

export async function removeTokenFromIndexedDB(key: string): Promise<void> {
  if (typeof window === 'undefined') {
    localStorage.removeItem(config.auth.tokenStorageKey);
    return;
  }
  
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.delete(key);
      
      request.onerror = () => {
        reject(request.error);
      };
      
      request.onsuccess = () => {
        resolve();
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error using IndexedDB, falling back to localStorage:', error);
    localStorage.removeItem(key);
  }
} 