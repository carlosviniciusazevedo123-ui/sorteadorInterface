import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const proxy = {
    '/api': {
      target: env.API_PROXY_TARGET || 'http://localhost:3001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  };
  return {
    plugins: [react()],
    server: {
      proxy,
    },
    preview: { proxy },
    test: {
      environment: 'jsdom',
      setupFiles: ['./tests/setup.js'],
      clearMocks: true,
      restoreMocks: true,
    },
  };
});
