export interface ApiResponse<T> {
  status: string;
  code: number;
  time: Date;
  message: string;
  data: T;
}