import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_USUARIO, ROLES_CREABLES, canToggleUsuario, usuarioFilters, validateUsuario } from '../src/helpers/usuarioModel.js';

const valid = { nombreUsuario: ' colegio.central ', correo: ' Admin@Colegio.EDU.co ', rol: 'INSTITUCION', contraseña: 'Inicial#2026', confirmacion: 'Inicial#2026' };

test('valid user payload is trimmed, lower-cases the email and drops the confirmation', () => {
  assert.deepEqual(validateUsuario(valid), {
    errors: {},
    payload: { nombreUsuario: 'colegio.central', correo: 'admin@colegio.edu.co', rol: 'INSTITUCION', contraseña: 'Inicial#2026' }
  });
});

test('every field is validated with an actionable message', () => {
  const { errors, payload } = validateUsuario({ ...EMPTY_USUARIO, rol: '' });
  assert.equal(payload, null);
  assert.deepEqual(Object.keys(errors).sort(), ['contraseña', 'correo', 'nombreUsuario', 'rol']);
  assert.match(validateUsuario({ ...valid, nombreUsuario: 'con espacio' }).errors.nombreUsuario, /sin espacios/);
  assert.match(validateUsuario({ ...valid, correo: 'no-es-correo' }).errors.correo, /formato/);
  assert.match(validateUsuario({ ...valid, contraseña: 'corta', confirmacion: 'corta' }).errors.contraseña, /al menos 8/);
  assert.match(validateUsuario({ ...valid, confirmacion: 'otra' }).errors.confirmacion, /no coincide/);
});

test('students cannot be created from the admin form', () => {
  assert.deepEqual([...ROLES_CREABLES], ['INSTITUCION', 'ADMIN']);
  assert.match(validateUsuario({ ...valid, rol: 'ESTUDIANTE' }).errors.rol, /rol válido/);
});

test('user filters and self-deactivation guard', () => {
  assert.deepEqual(usuarioFilters({ nombreUsuario: ' ana ', correo: '', activo: 'true' }), { nombreUsuario: 'ana', correo: undefined, activo: 'true' });
  assert.equal(usuarioFilters({ activo: 'x' }).activo, undefined);
  assert.equal(canToggleUsuario({ _id: 'u1' }, 'u2'), true);
  assert.equal(canToggleUsuario({ _id: 'u1' }, 'u1'), false);
  assert.equal(canToggleUsuario({}, 'u1'), false);
});
