import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // 0.0.0.0 ni ruxsat beradi
    port: 5173, // Kerakli portni o‘rnating (default: 5173)
  },
  build: {
    outDir: 'dist', // Build natijalari 'dist' papkaga tushishi kerak
  }
});
