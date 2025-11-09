export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  params?: Record<string, unknown>;
  cache?: RequestCache;
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormState<T = unknown> {
  data: T;
  errors: Record<string, string>;
  loading: boolean;
  dirty: boolean;
}

export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}