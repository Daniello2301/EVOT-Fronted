import { axiosConfig } from '../helpers/axios.config';

// Público
export const getDiplomasByGraduate = async (numeroDocumento) => {
    const res = await axiosConfig.get(`diplomas/by/graduate/${numeroDocumento}`);
    return res.data;
};

export const verificarDiploma = async (codigoDiploma) => {
    const res = await axiosConfig.get(`diplomas/verify/${codigoDiploma}`);
    return res.data;
};

export const solicitarDocumento = async (codigoDiploma, data) => {
    const res = await axiosConfig.post(`diplomas/${codigoDiploma}/solicitar-documento`, data);
    return res.data;
};

// Admin
export const getAllDiplomas = async (params = {}) => {
    const res = await axiosConfig.get('diplomas', { params });
    return res.data;
};

export const getDiplomaById = async (id) => {
    try {
        const res = await axiosConfig.get(`diplomas/${id}`);
        return res.data;
        
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Institución
export const getDiplomasByInstitution = async (params = {}) => {
    const res = await axiosConfig.get('diplomas/by/institution', { params });
    return res.data;
};

export const createDiploma = async (data) => {
    const res = await axiosConfig.post('diplomas', data);
    return res.data;
};

export const updateDiploma = async (id, data) => {
    const res = await axiosConfig.put(`diplomas/${id}`, data);
    return res.data;
};

export const deactivateDiploma = async (id) => {
    const res = await axiosConfig.patch(`diplomas/${id}/deactivate`);
    return res.data;
};

export const solicitarEdicion = async (id, motivoSolicitud) => {
    const res = await axiosConfig.post(`diplomas/${id}/solicitar-edicion`, { motivoSolicitud });
    return res.data;
};