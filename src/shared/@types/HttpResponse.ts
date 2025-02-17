export type HttpResponse<T = any> = {
  hasError: boolean;
  data?: T;
  message?: string;
};
