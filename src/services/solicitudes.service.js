import { axiosConfig } from '../helpers/axios.config';

// Solicitudes de edición
export const getSolicitudesEdicion = async (params = {}) => {
    const res = await axiosConfig.get('solicitudes-edicion', { params });
    return res.data;
};

export const aprobarSolicitudEdicion = async (id) => {
    const res = await axiosConfig.patch(`solicitudes-edicion/${id}/aprobar`);
    return res.data;
};

export const rechazarSolicitudEdicion = async (id) => {
    const res = await axiosConfig.patch(`solicitudes-edicion/${id}/rechazar`);
    return res.data;
};

// Solicitudes de documento
export const getSolicitudesDocumento = async (params = {}) => {
    const res = await axiosConfig.get('solicitudes-documento', { params });
    return res.data;
};

export const aprobarSolicitudDocumento = async (id, formData) => {
    const res = await axiosConfig.patch(`solicitudes-documento/${id}/aprobar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const rechazarSolicitudDocumento = async (id) => {
    const res = await axiosConfig.patch(`solicitudes-documento/${id}/rechazar`);
    return res.data;
};