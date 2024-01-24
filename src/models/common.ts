export interface ResponseProperties<T> {
  code?: string;
  message?: string;
  data?: T;
  isError: boolean;
}
