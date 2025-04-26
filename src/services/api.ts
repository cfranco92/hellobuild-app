import { Todo, Repository } from '@/types';


type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export interface TodoData {
  text: string;
  completed?: boolean;
}


export const todoService = {
  
  async getTodos(userId: string): Promise<ApiResponse<Todo[]>> {
    try {
      const response = await fetch(`/api/todos?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error getting todos' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error getting todos:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  
  async createTodo(userId: string, todoData: TodoData): Promise<ApiResponse<Todo>> {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...todoData
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error creating todo' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating todo:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  
  async updateTodo(id: string, todoData: Partial<TodoData>): Promise<ApiResponse<Todo>> {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error updating todo' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating todo:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  
  async deleteTodo(id: string): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error deleting todo' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting todo:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  
  async clearCompleted(userId: string): Promise<ApiResponse<{ count: number }>> {
    try {
      const response = await fetch(`/api/todos/completed?userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error deleting completed todos' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting completed todos:', error);
      return { data: null, error: 'Connection error' };
    }
  }
};


export const authService = {
  
  async signup(email: string, password: string): Promise<ApiResponse<{ uid: string; email: string | null }>> {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          action: 'signup'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error during registration' };
      }
      
      const data = await response.json();
      return { data: data.user, error: null };
    } catch (error) {
      console.error('Error during registration:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  
  async login(email: string, password: string): Promise<ApiResponse<{ uid: string; email: string | null }>> {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          action: 'login'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error during login' };
      }
      
      const data = await response.json();
      return { data: data.user, error: null };
    } catch (error) {
      console.error('Error during login:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error during logout' };
      }
      
      return { data: null, error: null };
    } catch (error) {
      console.error('Error during logout:', error);
      return { data: null, error: 'Connection error' };
    }
  }
};


export const favoritesService = {
  
  async getFavorites(userId: string): Promise<ApiResponse<Repository[]>> {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error getting favorites' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error getting favorites:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  
  async addFavorite(userId: string, repository: Repository): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          repository
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error adding favorite' };
      }
      
      return { data: true, error: null };
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { data: null, error: 'Connection error' };
    }
  },
  
  
  async removeFavorite(userId: string, repositoryId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}&repositoryId=${repositoryId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error removing favorite' };
      }
      
      return { data: true, error: null };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { data: null, error: 'Connection error' };
    }
  }
}; 