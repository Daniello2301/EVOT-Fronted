export function userFromClaims(claims, now = Date.now()) {
  if (!claims || typeof claims !== 'object' || Array.isArray(claims)) throw new Error('Token de acceso inválido');
  if (typeof claims.exp === 'number' && claims.exp * 1000 <= now) throw new Error('Token de acceso expirado');
  if (!claims._id || !claims.rol) throw new Error('El token no contiene los datos requeridos');
  return { _id: claims._id, nombreUsuario: claims.nombreUsuario, correo: claims.correo, rol: claims.rol, institucion: claims.institucion };
}
export function postLoginPath(pending, role) {
  const path = pending?.url;
  if (typeof path === 'string' && /^\/(?!\/)/.test(path) && !/[\r\n\\]/.test(path)) return path;
  return role === 'ADMIN' || role === 'INSTITUCION' ? '/admin-dashboard' : '/home';
}
