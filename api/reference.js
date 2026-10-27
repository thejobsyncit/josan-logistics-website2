import { handleApiRequest } from '../src/server/apiMiddleware.js';

export default async function handler(req, res) {
  const urlPath = req.url ? req.url.split('?')[0] : '/api/reference';
  return handleApiRequest(req, res, urlPath);
}
