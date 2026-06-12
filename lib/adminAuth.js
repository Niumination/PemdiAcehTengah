// lib/adminAuth.js — Helper untuk admin authentication
// Sederhana: accept Bearer token yang match ADMIN_TOKEN env var
// fallback 'admin' untuk development

export function requireAdmin(req) {
  const auth = req.headers.authorization || '';
  const adminToken = process.env.ADMIN_TOKEN || 'admin';
  
  // Bearer token
  if (auth.startsWith('Bearer ')) {
    // Trim any trailing newlines or whitespace from env var
    return auth.slice(7).trim() === adminToken.trim();
  }

  return false;
}

export function adminUnauthorized(res) {
  return res.status(401).json({ error: 'Unauthorized', loginUrl: '/admin?login=1' });
}
