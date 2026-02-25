export const fetchConAuth = async (
  url,
  options = {},
  authUser,
  refreshAccessToken,
  logout,
) => {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${authUser?.accessToken}`,
    },
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      logout();
      return response;
    }

    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return response;
};
