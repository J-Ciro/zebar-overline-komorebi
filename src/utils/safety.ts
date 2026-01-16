/**
 * Utilities for consistent null/undefined handling across the codebase
 */

/**
 * Safe type guard for checking if a value is null or undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Safe type guard for checking if a value is not null or undefined
 */
export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safely get a nested property value with a default fallback
 */
export function safeGet<T>(
  obj: any,
  path: string[],
  defaultValue: T
): T {
  try {
    return path.reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Consistent null coalescing with type safety
 */
export function withDefault<T>(value: T | null | undefined, defaultValue: T): T {
  return isNotNullOrUndefined(value) ? value : defaultValue;
}

/**
 * Safe string conversion that handles null/undefined
 */
export function safeString(value: unknown): string {
  if (isNullOrUndefined(value)) return '';
  if (typeof value === 'string') return value;
  return String(value);
}

/**
 * Safe number conversion that handles null/undefined and invalid numbers
 */
export function safeNumber(value: unknown, defaultValue: number = 0): number {
  if (isNullOrUndefined(value)) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Common default values for zebar provider outputs
 */
export const DEFAULT_VALUES = {
  volume: 0,
  cpu: { usage: 0 },
  memory: { usage: 0 },
  position: 0,
  endTime: 0,
} as const;

/**
 * Safe provider output getter with defaults
 */
export function getSafeProviderOutput<T extends Record<string, any>>(
  provider: T | null | undefined,
  defaults: Partial<T>
): T {
  if (!provider) return defaults as T;
  
  return {
    ...defaults,
    ...provider,
  };
}

/**
 * Consistent null checking for Zebar outputs
 */
export function checkProviderOutput<T>(output: T | null | undefined): output is T {
  return isNotNullOrUndefined(output);
}

/**
 * Create a safe handler that won't throw if the handler is null/undefined
 */
export function safeHandler<T extends (...args: any[]) => any>(
  handler: T | null | undefined
): T {
  return ((...args: any[]) => {
    if (handler) {
      try {
        return handler(...args);
      } catch (error) {
        console.error('Handler error:', error);
      }
    }
  }) as T;
}