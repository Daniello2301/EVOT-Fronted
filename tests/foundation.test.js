import test from 'node:test';
import assert from 'node:assert/strict';
import { apiErrorMessage, cleanParams, extractPage, emptyPage, isNotFound } from '../src/helpers/apiResponse.js';
import { formatDate, toInputDate, localInputDate, isInputDate, fullName } from '../src/helpers/formatters.js';
import { describeEstado, describeActivo, ESTADOS_DOCUMENTO, ESTADOS_EDICION, rolLabel } from '../src/helpers/estados.js';
import { canAccessSection, sectionsForRole, sectionByKey, isActivePath, currentSection, dashboardPath, needsInstitucionOnboarding } from '../src/helpers/dashboardNav.js';
import { validatePasswordChange } from '../src/helpers/passwordChange.js';

test('extractPage normalizes paged, bare-array and malformed payloads', () => {
  assert.deepEqual(
    extractPage({ total: 23, page: 2, limit: 10, totalPages: 3, results: [{ a: 1 }] }),
    { results: [{ a: 1 }], total: 23, page: 2, limit: 10, totalPages: 3 }
  );
  assert.deepEqual(extractPage([{ a: 1 }, { a: 2 }]), { results: [{ a: 1 }, { a: 2 }], total: 2, page: 1, limit: 2, totalPages: 1 });
  assert.deepEqual(extractPage({ results: [{}], total: 25 }, { page: 3, limit: 10 }), { results: [{}], total: 25, page: 3, limit: 10, totalPages: 3 });
  assert.deepEqual(extractPage(null), emptyPage());
  assert.deepEqual(extractPage({ results: 'x', total: 'nope', totalPages: 0 }), emptyPage());
});

test('cleanParams drops empty filters and trims text', () => {
  assert.deepEqual(cleanParams({ page: 1, nombres: '  Ana ', apellidos: '', estado: undefined, activo: false, x: null }), { page: 1, nombres: 'Ana', activo: false });
});

test('apiErrorMessage reads every backend error shape', () => {
  const http = (status, data) => ({ response: { status, data } });
  assert.equal(apiErrorMessage(http(400, { errors: ['El correo es obligatorio', 'La contraseña es obligatoria'] })), 'El correo es obligatorio La contraseña es obligatoria');
  assert.equal(apiErrorMessage(http(400, { errors: [{ msg: 'Campo inválido' }] })), 'Campo inválido');
  assert.equal(apiErrorMessage(http(409, { msg: 'La institucion ya existe' })), 'La institucion ya existe');
  assert.equal(apiErrorMessage(http(429, 'Too many requests, please try again later.')), 'Too many requests, please try again later.');
  assert.equal(apiErrorMessage(http(429, '')), 'Demasiadas solicitudes. Espera unos minutos e inténtalo de nuevo.');
  assert.equal(apiErrorMessage(http(502, '<html>bad gateway</html>')), 'Error interno del servidor. Inténtalo más tarde.');
  assert.equal(apiErrorMessage(http(418, {}), 'Fallback'), 'Fallback');
  assert.match(apiErrorMessage({ request: {} }), /conexión/);
  assert.match(apiErrorMessage({ code: 'ECONNABORTED' }), /tardó/);
  assert.equal(apiErrorMessage(new Error('Validación local')), 'Validación local');
  assert.equal(isNotFound(http(404, {})), true);
  assert.equal(isNotFound(http(403, {})), false);
});

test('dates are formatted in UTC so calendar dates do not shift a day', () => {
  assert.equal(formatDate('2024-06-15T00:00:00.000Z'), '15/06/2024');
  assert.equal(formatDate(null), '—');
  assert.equal(formatDate('not a date'), '—');
  assert.equal(toInputDate('2024-01-05T00:00:00.000Z'), '2024-01-05');
  assert.equal(toInputDate(undefined), '');
  assert.equal(localInputDate(0, new Date(2026, 10, 30, 23, 0)), '2026-11-30');
  assert.equal(localInputDate(1, new Date(2026, 11, 31, 10, 0)), '2027-01-01');
  assert.equal(isInputDate('2024-02-29'), true);
  assert.equal(isInputDate('2026-02-30'), false);
  assert.equal(isInputDate('15/06/2024'), false);
  assert.equal(fullName({ nombres: 'Ana', apellidos: 'Gómez' }), 'Ana Gómez');
  assert.equal(fullName(null), '—');
});

test('states map to label and tone, tolerating unknown values', () => {
  assert.deepEqual(describeEstado(ESTADOS_DOCUMENTO, 'APROBADO'), { label: 'Aprobado', tone: 'success' });
  assert.deepEqual(describeEstado(ESTADOS_EDICION, 'RECHAZADA'), { label: 'Rechazada', tone: 'danger' });
  assert.deepEqual(describeEstado(ESTADOS_EDICION, 'APROBADO'), { label: 'APROBADO', tone: 'neutral' });
  assert.deepEqual(describeEstado(ESTADOS_DOCUMENTO, undefined), { label: 'Sin estado', tone: 'neutral' });
  assert.equal(describeActivo(false).label, 'Inactivo');
  assert.equal(describeActivo(undefined).label, 'Activo');
  assert.equal(rolLabel('INSTITUCION'), 'Institución');
});

test('dashboard sections are filtered by role and guard URL access', () => {
  const admin = sectionsForRole('ADMIN').map((s) => s.key);
  const inst = sectionsForRole('INSTITUCION').map((s) => s.key);
  assert.ok(admin.includes('instituciones') && admin.includes('usuarios') && admin.includes('solicitudes-edicion'));
  assert.ok(!admin.includes('solicitudes-documento') && !admin.includes('mi-institucion'));
  assert.ok(inst.includes('mi-institucion') && inst.includes('solicitudes-documento'));
  assert.ok(!inst.includes('usuarios') && !inst.includes('instituciones'));
  assert.deepEqual(sectionsForRole('ESTUDIANTE'), []);
  assert.equal(canAccessSection(sectionByKey('usuarios'), 'INSTITUCION'), false);
  assert.equal(canAccessSection(null, 'ADMIN'), false);
  assert.equal(dashboardPath('users'), '/admin-dashboard/users');
});

test('institution users without an institution must finish onboarding first', () => {
  assert.equal(needsInstitucionOnboarding({ rol: 'INSTITUCION', institucion: null }), true);
  assert.equal(needsInstitucionOnboarding({ rol: 'INSTITUCION', institucion: 'i1' }), false);
  assert.equal(needsInstitucionOnboarding({ rol: 'ADMIN', institucion: null }), false);
  assert.equal(needsInstitucionOnboarding(null), false);
});

test('active path matching keeps Inicio exact and sections prefix-based', () => {
  assert.equal(isActivePath('/admin-dashboard', ''), true);
  assert.equal(isActivePath('/admin-dashboard/', ''), true);
  assert.equal(isActivePath('/admin-dashboard/diplomas', ''), false);
  assert.equal(isActivePath('/admin-dashboard/diplomas/abc', 'diplomas'), true);
  assert.equal(isActivePath('/admin-dashboard/diplomas-x', 'diplomas'), false);
  assert.equal(currentSection('/admin-dashboard/users').key, 'usuarios');
  assert.equal(currentSection('/admin-dashboard').key, 'inicio');
  assert.equal(currentSection('/home'), null);
});

test('password change validation', () => {
  assert.deepEqual(validatePasswordChange({}).errors, { actual: 'Escribe tu contraseña actual.', nueva: 'Escribe la nueva contraseña.' });
  assert.match(validatePasswordChange({ actual: 'a', nueva: 'short', confirmacion: 'short' }).errors.nueva, /al menos 8/);
  assert.match(validatePasswordChange({ actual: 'MismaClave1', nueva: 'MismaClave1', confirmacion: 'MismaClave1' }).errors.nueva, /distinta/);
  assert.match(validatePasswordChange({ actual: 'Vieja#2026', nueva: 'Nueva#2026', confirmacion: 'Otra#2026' }).errors.confirmacion, /no coincide/);
  assert.deepEqual(validatePasswordChange({ actual: 'Vieja#2026', nueva: 'Nueva#2026', confirmacion: 'Nueva#2026' }), {
    errors: {}, payload: { viejaContraseña: 'Vieja#2026', nuevaContraseña: 'Nueva#2026' }
  });
});
