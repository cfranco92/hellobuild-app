export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function createSuccessResult<T>(data: T): Result<T> {
  return {
    success: true,
    data
  };
}

export function createErrorResult<T>(error: string): Result<T> {
  return {
    success: false,
    error
  };
} 