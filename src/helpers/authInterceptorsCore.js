import { isAuthenticationEndpoint, isPublicEndpoint } from './authRoutes.js';

// Handles concurrent 401s with a shared refresh, and ejects on unmount.
export function installAuthInterceptors(client, { getAccessToken, refreshToken, logout }) {
  let refreshInFlight = null;
  const requestId = client.interceptors.request.use((config) => {
    if (!isPublicEndpoint(config.url)) {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = 'Bearer ' + accessToken;
      }
    }
    return config;
  });
  const responseId = client.interceptors.response.use((response) => response, async (error) => {
    const request = error?.config;
    if (!request || error?.response?.status !== 401 || request._retry ||
        isPublicEndpoint(request.url) || isAuthenticationEndpoint(request.url)) {
      return Promise.reject(error);
    }
    request._retry = true;
    try {
      const current = getAccessToken();
      const previouslySent = request.headers?.Authorization?.replace(/^Bearer\s+/i, '');
      let nextToken = current && previouslySent !== current ? current : null;
      if (!nextToken) {
        if (!refreshInFlight) {
          refreshInFlight = Promise.resolve().then(refreshToken).finally(() => {
            refreshInFlight = null;
          });
        }
        nextToken = await refreshInFlight;
      }
      if (!nextToken) throw new Error('No se pudo renovar la sesión');
      request.headers = request.headers ?? {};
      request.headers.Authorization = 'Bearer ' + nextToken;
      return client(request);
    } catch (refreshError) {
      try { await logout({ notifyServer: false }); } catch { /* preserve original error */ }
      return Promise.reject(refreshError);
    }
  });
  return () => {
    client.interceptors.request.eject(requestId);
    client.interceptors.response.eject(responseId);
  };
}
