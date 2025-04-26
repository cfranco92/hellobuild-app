import { Todo, User, Repository } from '@/types';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  DocumentSnapshot,
  setDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';


const USERS_COLLECTION = 'users';
const TODOS_COLLECTION = 'todos';
const FAVORITES_COLLECTION = 'favorites';


const convertTodoDoc = (doc: QueryDocumentSnapshot<DocumentData>): Todo => {
  const data = doc.data();
  return {
    id: doc.id,
    text: data.text || '',
    completed: data.completed || false,
    userId: data.userId || '',
    createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString()
  };
};


const convertSingleTodoDoc = (doc: DocumentSnapshot<DocumentData>): Todo | null => {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  if (!data) return null;
  
  return {
    id: doc.id,
    text: data.text || '',
    completed: data.completed || false,
    userId: data.userId || '',
    createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString()
  };
};


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


export const getTodos = async (userId: string): Promise<Todo[]> => {
  try {
    const todosRef = collection(db, TODOS_COLLECTION);
    const q = query(todosRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(convertTodoDoc);
  } catch (error) {
    console.error('Error getting todos:', error);
    return [];
  }
};

export const addTodo = async (userId: string, text: string): Promise<Todo> => {
  try {
    const todoData = {
      userId,
      text,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const todoRef = await addDoc(collection(db, TODOS_COLLECTION), todoData);
    const todoDoc = await getDoc(todoRef);
    
    const todo = convertSingleTodoDoc(todoDoc);
    if (!todo) {
      throw new Error('Error creating todo: document not found');
    }
    return todo;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodo = async (id: string, updates: Partial<Pick<Todo, 'text' | 'completed'>>): Promise<Todo | null> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, id);
    const todoDoc = await getDoc(todoRef);
    
    if (!todoDoc.exists()) return null;
    
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    const updatedDoc = await getDoc(todoRef);
    return convertSingleTodoDoc(updatedDoc);
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id: string): Promise<{ id: string } | null> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, id);
    const todoDoc = await getDoc(todoRef);
    
    if (!todoDoc.exists()) return null;
    
    await deleteDoc(todoRef);
    return { id };
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const deleteCompletedTodos = async (userId: string): Promise<{ count: number }> => {
  try {
    const todosRef = collection(db, TODOS_COLLECTION);
    const q = query(todosRef, where('userId', '==', userId), where('completed', '==', true));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return { count: 0 };
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return { count: snapshot.size };
  } catch (error) {
    console.error('Error deleting completed todos:', error);
    throw error;
  }
};


export const initializeDemoData = async (userId: string): Promise<void> => {
  try {
    const todos = await getTodos(userId);
    
    if (todos.length === 0) {
      const demoTodos = [
        { text: 'Learn React', completed: true },
        { text: 'Build app with Next.js', completed: false },
        { text: 'Implement Firebase authentication', completed: false },
        { text: 'Design with Tailwind CSS', completed: true }
      ];
      
      const createPromises = demoTodos.map(async todoData => {
        const todo = await addTodo(userId, todoData.text);
        if (todoData.completed) {
          await updateTodo(todo.id, { completed: true });
        }
      });
      
      await Promise.all(createPromises);
    }
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
};


export const getFavoriteRepos = async (userId: string): Promise<Repository[]> => {
  try {
    const favoritesRef = doc(db, FAVORITES_COLLECTION, userId);
    const favoriteDoc = await getDoc(favoritesRef);
    
    if (!favoriteDoc.exists()) {
      return [];
    }
    
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