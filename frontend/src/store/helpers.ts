import { atom } from 'jotai';
import type { AsyncState, FormState } from '@/types';

// Helper to create async state atoms
export function createAsyncAtom<T>(initialData: T | null = null) {
  return atom<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });
}

// Helper to create form state atoms
export function createFormAtom<T>(initialData: T) {
  return atom<FormState<T>>({
    data: initialData,
    errors: {},
    loading: false,
    dirty: false,
  });
}