
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}


export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}


export interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
}


export interface AsyncResult<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
} 