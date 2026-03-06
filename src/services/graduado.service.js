import { axiosConfig } from '../helpers/axios.config';

export const getAllGraduados = async (params = {}) => {
    const res = await axiosConfig.get('graduados', { params });
    return res.data;
};

export const getGraduadoById = async (id) => {
    const res = await axiosConfig.get(`graduados/${id}`);
    return res.data;
};

export const createGraduado = async (data) => {
    const res = await axiosConfig.post('graduados', data);
    return res.data;
};

export const updateGraduado = async (id, data) => {
    const res = await axiosConfig.put(`graduados/${id}`, data);
    return res.data;
};

export const deactivateGraduado = async (id) => {
    const res = await axiosConfig.patch(`graduados/${id}/deactivate`);
    return res.data;
};