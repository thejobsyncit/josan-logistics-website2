import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './src/server/apiMiddleware.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'josan-rag-api-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api/')) {
            handleApiRequest(req, res, req.url.split('?')[0]);
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  }
});

