import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
    {
      name: "postbuild",
      closeBundle() {
        if (process.env.CI) {
          console.log("Skipping zebar.exe task because this is a CI build");
          return;
        }

        const exePath = process.env.ZEBAR_EXE_PATH || "zebar.exe";

        try {
          // Kill the existing zebar.exe process
          execSync(`taskkill /IM ${exePath} /F`, { stdio: "inherit" });
        } catch (err) {
          console.log(err.message);
        }

        // Start the new zebar.exe process
        execSync(`start ${exePath}`, { stdio: "inherit" });
      },
    },
  ],
  base: "./",
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core dependencies - rarely change, high priority caching
          'vendor-core': [
            'react',
            'react-dom',
          ],
          // Animation and UI libraries - moderate cache priority
          'vendor-ui': [
            'framer-motion',
            'lucide-react',
          ],
          // Platform-specific API - cache separate from UI
          'vendor-platform': ['zebar'],
          // Core utilities - high reuse across components
          'utils-core': [
            './src/utils/cn.ts',
            './src/utils/safety.ts',
          ],
          // Performance and animation utilities - separate for lazy loading
          'utils-performance': [
            './src/utils/performance.ts',
            './src/utils/useAnimation.ts',
          ],
          // Component utilities - lighter load for interaction handling
          'utils-interactive': [
            './src/utils/usePlayPause.tsx',
            './src/utils/useAutoTiling.tsx',
          ],
          // Common UI components - used across the application
          'components-common': [
            './src/components/common/Button.tsx',
            './src/components/common/Chip.tsx',
            './src/components/common/ConditionalPanel.tsx',
            './src/components/common/ErrorBoundary.tsx',
            './src/components/common/Divider.tsx',
          ],
          // Media components - loaded when media is playing
          'components-media': [
            './src/components/media/components/ProgressBar.tsx',
            './src/components/media/components/Status.tsx',
            './src/components/media/components/TitleDetails.tsx',
          ],
          // Window management components - loaded when komorebi is active
          'components-window': [
            './src/components/windowTitle/components/WindowControls.tsx',
            './src/components/windowTitle/components/IconButton.tsx',
            './src/components/windowTitle/components/commands/CycleFocus.tsx',
          ],
          // System monitoring components - loaded with system data
          'components-system': [
            './src/components/stat/components/StatRing.tsx',
            './src/components/stat/components/StatInline.tsx',
            './src/components/stat/components/Ring.tsx',
            './src/components/date/DateDisplay.tsx',
          ],
          // Interaction components - loaded on user interaction
          'components-interactive': [
            './src/components/volume/components/Slider.tsx',
            './src/components/systray/components/ExpandingCarousel.tsx',
            './src/components/systray/components/SystrayItem.tsx',
          ],
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      'zebar'
    ],
    exclude: ['@vitejs/plugin-react'],
    esbuildOptions: {
      target: 'esnext',
      treeShaking: true,
      legalComments: 'none',
      minify: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
