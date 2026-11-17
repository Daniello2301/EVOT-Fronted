import { axiosConfig } from '../helpers/axios.config';
import { assertDiplomaMutation } from '../helpers/diplomaModel.js';

// Público
export const getDiplomasByGraduate = async (numeroDocumento) => {
  const res = await axiosConfig.get('diplomas/by/graduate/' + encodeURIComponent(numeroDocumento));
  return res.data;
};
export const verificarDiploma = async (codigoDiploma) => {
  const res = await axiosConfig.get('diplomas/verify/' + encodeURIComponent(codigoDiploma));
  return res.data;
};
export const solicitarDocumento = async (codigoDiploma, data) => {
  const res = await axiosConfig.post('diplomas/' + encodeURIComponent(codigoDiploma) + '/solicitar-documento', data);
  return res.data;
};

// Administración
export const getAllDiplomas = async (params = {}) => {
  const res = await axiosConfig.get('diplomas', {params});
  return res.data;
};
export const getDiplomaById = async (id) => {
  const res = await axiosConfig.get('diplomas/' + encodeURIComponent(id));
  return res.data;
};
export const getDiplomasByInstitution = async (params = {}) => {
  const res = await axiosConfig.get('diplomas/by/institution', {params});
  return res.data;
};
export const createDiploma = async (data) => {
  const res = await axiosConfig.post('diplomas', data);
  return assertDiplomaMutation(res.data);
};
export const updateDiploma = async (id, data) => {
  const res = await axiosConfig.put('diplomas/' + encodeURIComponent(id), data);
  return assertDiplomaMutation(res.data);
};
export const deactivateDiploma = async (id) => {
  const res = await axiosConfig.patch('diplomas/' + encodeURIComponent(id) + '/deactivate');
  return assertDiplomaMutation(res.data);
};
export const solicitarEdicion = async (id, motivoSolicitud) => {
  const res = await axiosConfig.post('diplomas/' + encodeURIComponent(id) + '/solicitar-edicion', {motivoSolicitud});
  return res.data;
};
