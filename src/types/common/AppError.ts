export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
  
  static notFound(message: string = 'Resource not found'): AppError {
    return new AppError(message, 'NOT_FOUND');
  }
  
  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(message, 'UNAUTHORIZED');
  }
  
  static badRequest(message: string = 'Bad request'): AppError {
    return new AppError(message, 'BAD_REQUEST');
  }
} 