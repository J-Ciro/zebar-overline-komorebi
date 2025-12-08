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
          'vendor': [
            'react',
            'react-dom',
            'framer-motion',
            'lucide-react',
          ],
          'zebar': ['zebar'],
          'utils': [
            './src/utils/cn.ts',
            './src/utils/usePlayPause.tsx',
          ],
          'components-common': [
            './src/components/common/Button.tsx',
            './src/components/common/Chip.tsx',
            './src/components/common/ConditionalPanel.tsx',
          ],
          'components-media': [
            './src/components/media/Media.tsx',
            './src/components/media/components/ProgressBar.tsx',
            './src/components/media/components/Status.tsx',
            './src/components/media/components/TitleDetails.tsx',
          ],
          'components-window': [
            './src/components/windowTitle/WindowTitle.tsx',
            './src/components/windowTitle/components/WindowControls.tsx',
          ]
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
  esbuild: {
    target: 'esnext',
    treeShaking: true,
    legalComments: 'none',
    minify: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
