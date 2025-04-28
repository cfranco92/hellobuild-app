import { ApiResponse } from './types';

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
        return { data: null, error: errorData.error || 'Error during registration', success: false };
      }
      
      const data = await response.json();
      return { data: data.user, error: null, success: true };
    } catch (error) {
      console.error('Error during registration:', error);
      return { data: null, error: 'Connection error', success: false };
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
        return { data: null, error: errorData.error || 'Error during login', success: false };
      }
      
      const data = await response.json();
      return { data: data.user, error: null, success: true };
    } catch (error) {
      console.error('Error during login:', error);
      return { data: null, error: 'Connection error', success: false };
    }
  },
  
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Error during logout', success: false };
      }
      
      return { data: null, error: null, success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { data: null, error: 'Connection error', success: false };
    }
  }
}; 