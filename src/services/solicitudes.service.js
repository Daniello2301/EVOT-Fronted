import { axiosConfig } from '../helpers/axios.config';

// Solicitudes de edición (ADMIN revisa; INSTITUCION crea desde el diploma)
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

// Solicitudes de documento (INSTITUCION)
export const getSolicitudesDocumento = async (params = {}) => {
    const res = await axiosConfig.get('solicitudes-documento', { params });
    return res.data;
};

/** multipart/form-data: campo `documento` (PDF ≤ 10 MB) y `fechaExpiracion`. */
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

/**
 * Descarga el PDF aprobado. El API responde 302 hacia una URL firmada de
 * Cloudinary (5 min) y el navegador sigue la redirección. Con responseType
 * 'blob' los errores también llegan como Blob: se convierten a JSON para que
 * apiErrorMessage pueda leer `msg` (404 no disponible, 403, 410 expirado).
 */
export const descargarDocumentoSolicitud = async (id) => {
    try {
        const res = await axiosConfig.get(`solicitudes-documento/${id}/descargar`, { responseType: 'blob', timeout: 60000 });
        return res.data;
    } catch (error) {
        const data = error?.response?.data;
        if (data && typeof data.text === 'function') {
            try { error.response.data = JSON.parse(await data.text()); } catch { /* cuerpo no JSON */ }
        }
        throw error;
    }
};
