import type { ApiRequestOptions } from '@/types';
import { constructUrl } from '@/lib/utils/url';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// CUSTOM ERROR HANDLING FOR API ERRORS
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// GET JWT TOKEN FROM LOCALSTORAGE
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

// HANDLE NON JSON RESPONSE
function handleNonJsonResponse<T>(response: Response): T {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response as unknown as T;
}

// HANDLE JSON RESPONSE
async function handleJsonResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data.error || data.message || 'Request failed', response.status, data);
  }
  return data;
}

// API WRAPPER
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, params, cache = 'no-store' } = options;

  const url = constructUrl(endpoint, API_BASE_URL, params);

  const requestHeaders: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...headers,
  };

  // USED FOR AUTH WITH JWT AND FOR BE TO TRACK USERS ON BE API
  const token = getAuthToken();
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: requestHeaders,
      body: body || undefined,
      cache,
    });

    const isJSON = response.headers.get('Content-Type')?.includes('application/json') ?? false;

    // ALLOWS JSON.PARSE
    return isJSON ? await handleJsonResponse<T>(response) : handleNonJsonResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(error instanceof Error ? error.message : 'Unknown error occurred', 0, {
      originalError: error,
    });
  }
}

// USED FOR JWT TOKEN FOR PERSISTING LOGIN STATE
export function setAuthToken(token: string, persistent = true): void {
  if (typeof window === 'undefined') return;

  if (persistent) {
    localStorage.setItem('auth_token', token);
  } else {
    sessionStorage.setItem('auth_token', token);
  }
}

// REMOVE TOKENS WHEN LOGOUT
export function clearAuth(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
}

// GET HELPER
export function get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', params });
}

// POST HELPER
export function post<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT HELPER
export function put<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PATCH PATCH HELPER
export function patch<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE HELPER
export function del<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}
