export interface ApiResponse<T> {
  status: string;
  code: number;
  time: string;
  message: string;
  data: T;
}