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
        return { data: null, error: errorData.error || 'Error al obtener todos' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener todos:', error);
      return { data: null, error: 'Error de conexión' };
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
        return { data: null, error: errorData.error || 'Error al crear todo' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error al crear todo:', error);
      return { data: null, error: 'Error de conexión' };
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
        return { data: null, error: errorData.error || 'Error al actualizar todo' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error al actualizar todo:', error);
      return { data: null, error: 'Error de conexión' };
    }
  },
  
  
  async deleteTodo(id: string): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error al eliminar todo' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error al eliminar todo:', error);
      return { data: null, error: 'Error de conexión' };
    }
  },
  
  
  async clearCompleted(userId: string): Promise<ApiResponse<{ count: number }>> {
    try {
      const response = await fetch(`/api/todos/completed?userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error al eliminar todos completados' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error al eliminar todos completados:', error);
      return { data: null, error: 'Error de conexión' };
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
        return { data: null, error: errorData.error || 'Error durante el registro' };
      }
      
      const data = await response.json();
      return { data: data.user, error: null };
    } catch (error) {
      console.error('Error durante el registro:', error);
      return { data: null, error: 'Error de conexión' };
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
        return { data: null, error: errorData.error || 'Error durante el inicio de sesión' };
      }
      
      const data = await response.json();
      return { data: data.user, error: null };
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      return { data: null, error: 'Error de conexión' };
    }
  },
  
  
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error al cerrar sesión' };
      }
      
      return { data: null, error: null };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { data: null, error: 'Error de conexión' };
    }
  }
};


export const favoritesService = {
  
  async getFavorites(userId: string): Promise<ApiResponse<Repository[]>> {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error al obtener favoritos' };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      return { data: null, error: 'Error de conexión' };
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
        return { data: null, error: errorData.error || 'Error al añadir favorito' };
      }
      
      return { data: true, error: null };
    } catch (error) {
      console.error('Error al añadir favorito:', error);
      return { data: null, error: 'Error de conexión' };
    }
  },
  
  
  async removeFavorite(userId: string, repositoryId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}&repositoryId=${repositoryId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error al eliminar favorito' };
      }
      
      return { data: true, error: null };
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      return { data: null, error: 'Error de conexión' };
    }
  }
}; 