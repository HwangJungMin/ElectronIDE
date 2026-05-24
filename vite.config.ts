import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname, 'src/renderer'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
      '@app': resolve(__dirname, 'src/renderer/app'),
      '@features': resolve(__dirname, 'src/renderer/features'),
      '@shared': resolve(__dirname, 'src/renderer/shared'),
      '@layouts': resolve(__dirname, 'src/renderer/layouts'),
    },
  },
});
