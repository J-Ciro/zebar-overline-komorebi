import React from 'react';

/**
 * Lazy-loaded animation utilities to reduce initial bundle size
 */

/**
 * Lazy load animation utilities only when needed
 */
export async function loadAnimationUtils() {
  return import('./useAnimation');
}

/**
 * Preload critical animations for better perceived performance
 */
export function preloadCriticalAnimations() {
  // Only preload critical animations that are used immediately
  return import('./useAnimation').then(module => ({
    commonVariants: module.commonVariants,
    springConfigs: module.springConfigs,
    commonTransitions: module.commonTransitions,
  }));
}

/**
 * Create a lazy animation hook
 */
export function useLazyAnimation() {
  const [animationUtils, setAnimationUtils] = React.useState<any>(null);
  
  React.useEffect(() => {
    // Load animation utilities on first interaction
    loadAnimationUtils().then(setAnimationUtils);
  }, []);
  
  return animationUtils;
}