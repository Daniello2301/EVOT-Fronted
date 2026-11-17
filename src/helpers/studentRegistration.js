/** Axios already rejects non-2xx. Handle APIs that return logical errors on 2xx. */
export function assertStudentRegistration(result) {
  if (result?.ok === false || result?.success === false) {
    throw new Error(result?.msg || result?.message || 'No fue posible registrar al estudiante');
  }
  return result;
}
