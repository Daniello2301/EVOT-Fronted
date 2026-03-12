import { axiosConfig } from '../helpers/axios.config';

// Público
export const getActivePartners = async () => {
    const res = await axiosConfig.get('institutions/actives');
    return res;
};

// Admin
export const getAllInstituciones = async (params = {}) => {
    const res = await axiosConfig.get('institutions', { params });
    return res;
};

export const getInstitucionById = async (id) => {
    const res = await axiosConfig.get(`institutions/${id}`);
    return res;
};

export const createInstitucion = async (data) => {
    const res = await axiosConfig.post('institutions', data);
    return res;
};

export const updateInstitucion = async (id, data) => {
    const res = await axiosConfig.put(`institutions/${id}`, data);
    return res;
};

export const deactivateInstitucion = async (id) => {
    const res = await axiosConfig.patch(`institutions/${id}/deactivate`);
    return res;
};

export const activateInstitucion = async (id) => {
    const res = await axiosConfig.patch(`institutions/${id}/activate`);
    return res;
};

// Institución
export const getMyInstitucion = async () => {
    const res = await axiosConfig.get('institutions/me');
    return res;
};

export const updateMyInstitucion = async (data) => {
    const res = await axiosConfig.put('institutions/me', data);
    return res;
};