import { atom } from 'jotai';

// Global loading state
export const globalLoadingAtom = atom<boolean>(false);

// Global error state
export const globalErrorAtom = atom<string | null>(null);