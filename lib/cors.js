/* ===================================================================
   CORS Helper untuk API Routes Next.js
   Dynamic origin dari whitelist — tidak ada wildcard '*'
   =================================================================== */

const WHITELIST = [
  'https://pemdi-aceh-tengah.vercel.app',
  'http://localhost:3000',
];

/**
 * Set CORS headers pada response.
 * Origin diambil dari req.headers.origin; jika tidak ada atau tidak
 * ada di whitelist, fallback ke item pertama whitelist.
 * Handle OPTIONS preflight (return 200).
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @returns {boolean} true jika request adalah OPTIONS dan sudah di-handle
 */
function cors(req, res) {
  const origin = req.headers.origin || '';
  const allowed = WHITELIST.includes(origin) ? origin : WHITELIST[0];

  res.setHeader('Access-Control-Allow-Origin', allowed);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 jam

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

module.exports = { cors };
