import { useCallback } from 'react';
import { motion, Variants, Transition } from 'framer-motion';

/**
 * Consolidated animation system - Single source of truth for all animations
 */

// Common spring configurations
export const springConfigs = {
  soft: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 25,
    mass: 0.8,
  },
  medium: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
    mass: 0.5,
  },
  stiff: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 0.4,
  },
  // Merged from animations.ts
  gentleSpring: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 1.2
  },
};

// Common variants for consistent animations - Merged from both files
export const commonVariants = {
  // From useAnimation.ts
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  slideDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  },
  slideRight: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  // Merged from animations.ts with improved consistency
  fadeInOut: {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 2 },
  },
  slideInOut: {
    initial: { opacity: 0, x: -5 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -5 },
  },
  scaleInOut: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
};

// Common transitions - Merged from both files
export const commonTransitions = {
  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
    mass: 0.5,
  },
  quick: {
    duration: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
  gentle: {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
  // Merged from animations.ts
  smoothRotate: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
    mass: 1.2,
    duration: 0.5
  },
  // Easing curves
  easeOut: [0.25, 0.46, 0.45, 0.94] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  // Duration presets
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.4,
    slower: 0.6
  }
};

// Interactive animations - Merged from animations.ts
export const interactiveAnimations = {
  hoverScale: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  tapScale: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
};

// Component-specific variants - Migrated from animations.ts
export const componentVariants = {
  button: {
    initial: { opacity: 0, x: -5 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -5 },
    hover: { 
      scale: 1.01, 
      backgroundColor: "rgba(var(--background-deeper), 0.3)" 
    },
    tap: { scale: 0.99 },
    transition: { 
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  menu: {
    initial: { opacity: 0, y: -3, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -3, scale: 0.98 },
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 30,
      mass: 1.1,
    }
  },
  workspace: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
};

// Legacy exports for backward compatibility
export const smoothAnimations = {
  fadeInOut: commonVariants.fadeInOut,
  slideInOut: commonVariants.slideInOut,
  scaleInOut: commonVariants.scaleInOut,
  softSpring: springConfigs.soft,
  gentleSpring: springConfigs.gentleSpring,
  hoverScale: interactiveAnimations.hoverScale,
  tapScale: interactiveAnimations.tapScale,
  smoothRotate: commonTransitions.smoothRotate,
  easeOut: commonTransitions.easeOut,
  easeInOut: commonTransitions.easeInOut,
  duration: commonTransitions.duration,
};

export const buttonVariants = componentVariants.button;
export const menuVariants = componentVariants.menu;
export const workspaceVariants = componentVariants.workspace;

/**
 * Hook for creating consistent motion components with preset animations
 */
export function useAnimation() {
  
  /**
   * Create a motion.div with predefined variant and transition
   */
  const createMotionElement = useCallback((
    variant: keyof typeof commonVariants,
    transition: keyof typeof commonTransitions = 'smooth'
  ) => {
    const MotionComponent = motion.div;
    return {
      component: MotionComponent,
      props: {
        variants: commonVariants[variant],
        transition: commonTransitions[transition],
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
      }
    };
  }, []);

  /**
   * Get animation props for a specific variant
   */
  const getAnimationProps = useCallback((
    variant: keyof typeof commonVariants,
    transition: keyof typeof commonTransitions = 'smooth'
  ) => ({
    variants: commonVariants[variant],
    transition: commonTransitions[transition],
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
  }), []);

  /**
   * Create custom animation with delay
   */
  const createDelayedAnimation = useCallback((
    variant: keyof typeof commonVariants,
    delay: number,
    transition: keyof typeof commonTransitions = 'smooth'
  ) => ({
    variants: commonVariants[variant],
    transition: { ...commonTransitions[transition], delay },
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
  }), []);

  /**
   * Create width-based animation (for sliders, progress bars)
   */
  const createWidthAnimation = useCallback((
    width: string | number,
    transition: typeof springConfigs.medium = springConfigs.medium
  ) => ({
    animate: { width: typeof width === 'string' ? width : `${width}%` },
    transition,
  }), []);

  return {
    springConfigs,
    commonVariants,
    commonTransitions,
    componentVariants,
    interactiveAnimations,
    createMotionElement,
    getAnimationProps,
    createDelayedAnimation,
    createWidthAnimation,
  };
}