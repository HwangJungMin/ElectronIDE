import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: { main: resolve(__dirname, 'src/main/main.ts') },
      },
    },
    resolve: {
      alias: {
        '@main': resolve(__dirname, 'src/main'),
        '@preload': resolve(__dirname, 'src/preload'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'src/preload/index.ts') },
      },
    },
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer'),
        '@app': resolve(__dirname, 'src/renderer/app'),
        '@features': resolve(__dirname, 'src/renderer/features'),
        '@shared': resolve(__dirname, 'src/renderer/shared'),
        '@layouts': resolve(__dirname, 'src/renderer/layouts'),
        '@styles': resolve(__dirname, 'src/renderer/styles'),
        '@assets': resolve(__dirname, 'src/renderer/assets'),
      },
    },
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'src/renderer/index.html') },
      },
    },
  },
});
