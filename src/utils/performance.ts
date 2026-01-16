/**
 * Utility functions for performance optimization
 */

import { PartialProviderOutput } from './types/provider';

/**
 * Shallow comparison of two objects to check if they are equal
 */
export function shallowEqual<T extends Record<string, unknown>>(obj1: T, obj2: T): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if provider outputs have changed meaningfully
 */
export function hasProviderOutputChanged(
  prev: PartialProviderOutput | undefined,
  next: PartialProviderOutput | undefined
): boolean {
  if (prev === next) return false;
  if (!prev || !next) return true;
  
  // Check key provider outputs that change frequently
  const keyChecks = [
    prev.media?.currentSession?.sessionId !== next.media?.currentSession?.sessionId,
    prev.media?.currentSession?.isPlaying !== next.media?.currentSession?.isPlaying,
    prev.cpu?.usage !== next.cpu?.usage,
    prev.memory?.usage !== next.memory?.usage,
    prev.audio?.defaultPlaybackDevice?.volume !== next.audio?.defaultPlaybackDevice?.volume,
    prev.date?.formatted !== next.date?.formatted,
    prev.komorebi?.focusedWorkspace?.name !== next.komorebi?.focusedWorkspace?.name,
  ];
  
  return keyChecks.some(Boolean);
}

/**
 * Debounce utility function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}