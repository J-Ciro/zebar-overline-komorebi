# AGENTS.md

This file contains development guidelines for agentic coding agents working on the overline-zebar project.

## Project Overview

overline-zebar is a React + TypeScript desktop widget built for the [Zebar](https://github.com/glzr-io/zebar) platform. It provides system monitoring, media controls, workspace management, and other desktop functionality in a customizable bar widget.

## Build & Development Commands

### Primary Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (creates dist/ folder)
- `npm run build:watch` - Build with hot reload specifically for Zebar development
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Development Workflow
1. Use `npm run build:watch` for active Zebar development - this automatically restarts Zebar when code changes
2. Run `npm run lint` before committing changes
3. No test framework is currently configured

## Code Style Guidelines

### Import Organization
```typescript
// React imports first
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// External libraries
import { clsx, ClassValue } from "clsx";
import * as zebar from "zebar";

// Internal imports - use relative paths
import { cn } from "../../utils/cn";
import { Button } from "../common/Button";
import type { MediaOutput } from "zebar";
```

### TypeScript Conventions
- Use interfaces for object shapes and type definitions
- Prefer `type` for simple type aliases and unions
- Use proper generic typing: `React.FC<ComponentProps>`
- Always type React component props with interfaces
- Use optional properties (`?`) for non-required props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export function Button({ children, className, ...props }: ButtonProps) {
  // Implementation
}
```

### React Patterns
- Use functional components with hooks
- Implement `React.memo()` for performance optimization on expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for event handlers to prevent unnecessary re-renders
- Implement lazy loading for heavy components:

```typescript
const Media = lazy(() => import("./components/media/Media"));

// Usage with Suspense
<Suspense fallback={<div className="w-[300px] h-full bg-background animate-pulse rounded" />}>
  <Media media={media} />
</Suspense>
```

### Component Structure
- Export components using named exports: `export function ComponentName()`
- Create memoized versions: `const ComponentMemo = React.memo(Component)`
- Keep components focused on single responsibility
- Use composition over inheritance

```typescript
export const TitleDetailsMemo = React.memo(TitleDetails);

interface ComponentProps {
  // Prop definitions
}

export default function Component({ prop }: ComponentProps) {
  // Implementation
}
```

### Styling Conventions
- Use Tailwind CSS classes extensively
- Leverage the `cn()` utility for class merging
- Define reusable style constants:

```typescript
export const buttonStyles = `bg-background-subtle/10 border-text/5 border px-1.5 rounded-md 
  hover:bg-background-subtle/15 hover:border-text/10
  active:border-text/10 active:bg-background-deeper
  transition-colors ease-in-out duration-200`;

// Usage
<button className={cn(buttonStyles, className)} {...props}>
```

- Use semantic color tokens from `tailwind.config.js`: `text-text`, `bg-background`, `border-app-border`

### Error Handling
- Use try-catch blocks for async operations
- Log errors with `console.error()`
- Implement graceful fallbacks for optional features:

```typescript
useEffect(() => {
  const loadConfig = async () => {
    try {
      const config = await loadAsyncConfig();
      setConfig(config);
    } catch (error) {
      console.error("Failed to load configuration:", error);
      setConfig((prev) => ({ ...prev, isLoading: false }));
    }
  };
  loadConfig();
}, []);
```

### Naming Conventions
- **Files**: PascalCase for components (`Button.tsx`), camelCase for utilities (`cn.ts`)
- **Components**: PascalCase (`Button`, `VolumeControl`)
- **Variables/Functions**: camelCase (`handleClick`, `formattedDate`)
- **Constants**: UPPER_SNAKE_CASE for style constants (`buttonStyles`)
- **Interfaces**: PascalCase with descriptive suffix (`ButtonProps`, `ConfigContextType`)
- **Enums**: PascalCase (`LabelType.DEFAULT`)

### File Organization
```
src/
├── components/
│   ├── common/          # Shared UI components
│   ├── featureName/     # Feature-specific components
│   │   ├── components/  # Sub-components
│   │   ├── types/       # Type definitions
│   │   └── index.tsx    # Main component export
├── context/             # React context providers
├── utils/               # Utility functions and hooks
├── styles/              # CSS and styling
└── types/               # Global type definitions
```

### State Management
- Use React Context for global state (`ConfigContext`)
- Use React Query for server state management
- Keep local state in component with `useState`
- Use custom hooks for complex state logic (`usePlayPause`, `useAutoTiling`)

### Animation Patterns
- Use Framer Motion for animations
- Define animation variants in `utils/animations.ts`
- Implement smooth transitions with predefined constants:

```typescript
<motion.div
  variants={smoothAnimations.scaleInOut}
  initial="initial"
  animate="animate"
  exit="exit"
  whileHover={smoothAnimations.hoverScale}
>
```

### Props Destructuring
- Always destructure props in function signature
- Use rest operator for forwarding HTML element props:

```typescript
export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonStyles, className)} {...props}>
      {children}
    </button>
  );
}
```

### Hook Patterns
- Create custom hooks for reusable stateful logic
- Name hooks with `use` prefix
- Return stable references from hooks

```typescript
export function usePlayPause(isPlaying: boolean) {
  const [state, setState] = useState(initialState);
  // Logic implementation
  return state;
}
```

## Key Dependencies

- **React 18.3.1**: UI framework with concurrent features
- **TypeScript**: Static typing
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Zebar SDK**: Desktop widget platform APIs
- **React Query**: Server state management
- **Lucide React**: Icon library

## Project-Specific Considerations

- This is a desktop widget, not a web application
- Zebar automatically restarts the widget on file changes during development
- Components should be lightweight and performant
- Use environment variables for configuration (see `utils/getFromEnv.ts`)
- Widget runs continuously, so memory leaks are critical to avoid
- Clean up event listeners and subscriptions in useEffect cleanup functions

## Performance Guidelines

- Use `React.memo()` for components that re-render frequently with same props
- Implement `useMemo()` for expensive computations
- Use `useCallback()` for event handlers passed to child components
- Lazy load heavy components like Media
- Avoid unnecessary re-renders by structuring state properly
- Use the chunk splitting configuration in `vite.config.ts` for optimal bundle size

## Common Gotchas

- Zebar provider outputs can be null - always check for existence
- Widget dimensions should be responsive to different screen sizes
- Use absolute positioning for layout flexibility within the widget bar
- Test with different Zebar configurations and window managers
- Remember this runs in a desktop environment, not a browser context