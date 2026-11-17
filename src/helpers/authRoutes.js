export function normalizeApiPath(url) {
  if (typeof url !== 'string' || !url) return '';
  try {
    return new URL(url, 'http://evot.local').pathname.replace(/^\/+/, '').replace(/^api\//, '').replace(/\/+$/, '');
  } catch { return ''; }
}
export function isPublicEndpoint(url) {
  const path = normalizeApiPath(url);
  return ['auth/login', 'auth/refresh', 'users/student', 'institutions/actives'].includes(path)
    || /^diplomas\/(?:verify|by\/graduate)\/[^/]+$/.test(path);
}
export function isAuthenticationEndpoint(url) {
  return ['auth/login', 'auth/refresh', 'auth/logout'].includes(normalizeApiPath(url));
}
