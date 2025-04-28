import { AppError } from '@/types/common/AppError';

export const httpClient = {
  async get<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new AppError(
          `Error: ${response.status} ${response.statusText}`,
          `HTTP_${response.status}`
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('HTTP request failed');
    }
  },
  
  async post<T, D = Record<string, unknown>>(url: string, data: D, headers: Record<string, string> = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new AppError(
          `Error: ${response.status} ${response.statusText}`,
          `HTTP_${response.status}`
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('HTTP request failed');
    }
  }
}; 