export function extractDiplomaList(payload) {
  const value = payload?.data?.results ?? payload?.data?.diplomas ?? payload?.data ??
    payload?.results ?? payload?.diplomas ?? payload;
  return Array.isArray(value) ? value : [];
}

export function extractDiploma(payload) {
  const value = payload?.data?.diploma ?? payload?.data ?? payload?.diploma ?? payload;
  return value && !Array.isArray(value) && typeof value === 'object' ? value : null;
}

export function diplomaId(diploma) {
  return diploma?._id || diploma?.id || null;
}

export const EMPTY_DIPLOMA = {
  codigoDiploma: '', nombrePrograma: '', nivelPrograma: '', registroPrograma: '',
  libro: '', fechaGrados: '', numeroDocumento: '',
};

export function diplomaToForm(diploma) {
  return {
    codigoDiploma: String(diploma?.codigoDiploma ?? ''),
    nombrePrograma: String(diploma?.nombrePrograma ?? ''),
    nivelPrograma: String(diploma?.nivelPrograma ?? ''),
    registroPrograma: String(diploma?.registroPrograma ?? ''),
    libro: String(diploma?.libro ?? ''),
    fechaGrados: String(diploma?.fechaGrados ?? '').slice(0, 10),
    numeroDocumento: String(diploma?.numeroDocumento ?? diploma?.graduado?.numeroDocumento ?? ''),
  };
}

export function diplomaPayload(form, isEdit = false) {
  const fields = ['codigoDiploma', 'nombrePrograma', 'nivelPrograma', 'registroPrograma', 'libro', 'fechaGrados'];
  const result = {};
  for (const field of fields) {
    const value = String(form?.[field] ?? '').trim();
    if (!value) throw new Error('El campo ' + field + ' es obligatorio.');
    result[field] = value;
  }
  const date = result.fechaGrados + 'T00:00:00Z';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result.fechaGrados) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== result.fechaGrados) {
    throw new Error('La fecha de grado no es válida.');
  }
  if (!isEdit) {
    const document = String(form?.numeroDocumento ?? '').trim();
    if (!/^\d{4,20}$/.test(document)) throw new Error('El documento debe tener entre 4 y 20 dígitos.');
    result.numeroDocumento = document;
  }
  return result;
}

export function filterDiplomas(diplomas, search) {
  const needle = String(search ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (!needle) return diplomas;
  return diplomas.filter((diploma) => [
    diploma?.codigoDiploma, diploma?.nombrePrograma, diploma?.nivelPrograma,
    diploma?.graduado?.numeroDocumento, diploma?.graduado?.nombres,
    diploma?.graduado?.apellidos, diploma?.institucion?.nombreInstitucion,
  ].some((field) => String(field ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(needle)));
}

export function diplomaError(error, fallback = 'No se pudo completar la operación.') {
  return error?.response?.data?.msg || error?.response?.data?.message || error?.message || fallback;
}

/** Treat API-level failure responses as failures, even if HTTP status was 2xx. */
export function assertDiplomaMutation(payload) {
  const value = payload?.data ?? payload;
  if (value?.ok === false || value?.success === false || payload?.ok === false || payload?.success === false) {
    throw new Error(value?.msg || value?.message || payload?.msg || payload?.message || 'La operación fue rechazada.');
  }
  return payload;
}
