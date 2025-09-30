import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'tone': ['tone']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});