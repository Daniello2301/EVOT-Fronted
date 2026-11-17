import { axiosConfig } from './axios.config';

// Compatibility adapter. Authentication is handled exclusively by Axios interceptors.
export async function fetchConAuth(url, options = {}) {
  const { body, ...config } = options;
  const response = await axiosConfig({
    ...config,
    url,
    ...(body !== undefined && config.data === undefined ? { data: body } : {}),
  });
  return response.data;
}
