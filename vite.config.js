import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Relative asset URLs keep the build working under any GitHub Pages repository path.
  base: './',
  plugins: [react()],
  build: {
    target: 'es2019',
    sourcemap: false,
  },
  server: {
    port: 5173,
  },
});
