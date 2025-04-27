export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export interface TodoData {
  text: string;
  completed?: boolean;
} 