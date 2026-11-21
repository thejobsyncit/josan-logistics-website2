import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env so server middleware has access to environment variables
  Object.assign(process.env, env);
  if (!process.env.SUPABASE_URL && process.env.VITE_SUPABASE_URL) {
    process.env.SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  }
  if (!process.env.SUPABASE_ANON_KEY && process.env.VITE_SUPABASE_ANON_KEY) {
    process.env.SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
  }

  return {
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
  };
});

