import { handleApiRequest } from '../src/server/apiMiddleware.js';

export default async function handler(req, res) {
  const url = req.url || '/api/documents';
  return handleApiRequest(req, res, url.split('?')[0]);
}
