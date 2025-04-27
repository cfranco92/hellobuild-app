import { Todo } from '@/types';
import { ApiResponse, TodoData } from './types';

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