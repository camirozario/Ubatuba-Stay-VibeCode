import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/VibeCode-Ubatuba-Stay/',
  plugins: [react()],
  build: {
    target: 'es2019',
    sourcemap: false,
  },
  server: {
    port: 5173,
  },
});
