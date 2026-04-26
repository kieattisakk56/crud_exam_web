export interface ApiResponse<T> {
  code: number;
  count: number;
  message: string;
  messageAlt: string;
  results: T;
}
