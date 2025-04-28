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
  githubToken?: string | null;
}


export interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  html_url: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}


export interface AsyncResult<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
} 