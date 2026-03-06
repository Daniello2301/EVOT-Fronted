import { axiosConfig } from '../helpers/axios.config';

// Público
export const getActivePartners = async () => {
    const res = await axiosConfig.get('institutions/actives');
    return res.data;
};

// Admin
export const getAllInstituciones = async (params = {}) => {
    const res = await axiosConfig.get('institutions', { params });
    return res.data;
};

export const getInstitucionById = async (id) => {
    const res = await axiosConfig.get(`institutions/${id}`);
    return res.data;
};

export const createInstitucion = async (data) => {
    const res = await axiosConfig.post('institutions', data);
    return res.data;
};

export const updateInstitucion = async (id, data) => {
    const res = await axiosConfig.put(`institutions/${id}`, data);
    return res.data;
};

export const deactivateInstitucion = async (id) => {
    const res = await axiosConfig.patch(`institutions/${id}/deactivate`);
    return res.data;
};

export const activateInstitucion = async (id) => {
    const res = await axiosConfig.patch(`institutions/${id}/activate`);
    return res.data;
};

// Institución
export const getMyInstitucion = async () => {
    const res = await axiosConfig.get('institutions/me');
    return res.data;
};

export const updateMyInstitucion = async (data) => {
    const res = await axiosConfig.put('institutions/me', data);
    return res.data;
};