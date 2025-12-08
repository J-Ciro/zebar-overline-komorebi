// Configuración centralizada de animaciones suaves y amigables
export const smoothAnimations = {
  // Transiciones suaves para elementos que aparecen/desaparecen
  fadeInOut: {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 2 },
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },

  // Transiciones para elementos que se deslizan
  slideInOut: {
    initial: { opacity: 0, x: -5 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -5 },
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },

  // Transiciones para escalado suave
  scaleInOut: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },

  // Springs suaves para elementos interactivos
  softSpring: {
    type: "spring" as const,
    stiffness: 150,
    damping: 25,
    mass: 1.1
  },

  // Springs más suaves para elementos de layout
  gentleSpring: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 1.2
  },

  // Transiciones para hover suaves
  hoverScale: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },

  // Transiciones para tap suaves
  tapScale: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },

  // Transiciones para rotación suave
  smoothRotate: {
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 25,
      mass: 1.2,
      duration: 0.5
    }
  },

  // Easing curves suaves
  easeOut: [0.25, 0.46, 0.45, 0.94] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,

  // Duración estándar para transiciones
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.4,
    slower: 0.6
  }
};

// Variantes predefinidos para componentes comunes
export const buttonVariants = {
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
};

export const menuVariants = {
  initial: { opacity: 0, y: -3, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -3, scale: 0.98 },
  transition: {
    type: "spring",
    stiffness: 250,
    damping: 30,
    mass: 1.1,
  }
};

export const workspaceVariants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
}; 