import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'josan-rag-api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/')) {
            const { handleApiRequest } = await import('./src/server/apiMiddleware.js');
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

