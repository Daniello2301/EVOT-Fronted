import { axiosConfig } from '../helpers/axios.config';

export const getAllUsuarios = async (params = {}) => {
    const res = await axiosConfig.get('users', { params });
    return res.data;
};

export const getUsuarioById = async (id) => {
    const res = await axiosConfig.get(`users/${id}`);
    return res.data;
};

export const createUsuario = async (data) => {
    const res = await axiosConfig.post('users', data);
    
    return res.data;
};

export const registerStudent = async (data) => {
    const res = await axiosConfig.post('users/student', data);
    return res.data;
}

export const deactivateUsuario = async (id) => {
    const res = await axiosConfig.patch(`users/${id}/deactivate`);
    return res.data;
};

export const activateUsuario = async (id) => {
    const res = await axiosConfig.patch(`users/${id}/activate`);
    return res.data;
};