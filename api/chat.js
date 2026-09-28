import { handleApiRequest } from '../src/server/apiMiddleware.js';

export default async function handler(req, res) {
  return handleApiRequest(req, res, '/api/chat');
}
