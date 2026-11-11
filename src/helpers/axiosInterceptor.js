import { axiosConfig } from './axios.config';
import { installAuthInterceptors } from './authInterceptorsCore.js';

export const setupInterceptors = (options) => installAuthInterceptors(axiosConfig, options);
