import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_GRADUADO, dayRangeIso, existingGraduado, graduadoFilters, graduadoToForm, validateGraduado } from '../src/helpers/graduadoModel.js';

const TODAY = new Date(2026, 10, 17, 9, 0);
const valid = { tipoDocumento: 'CC', numeroDocumento: ' 1036123456 ', nombres: '  María   José ', apellidos: "O'Neil Pérez", fechaNacimiento: '2000-02-29' };

test('create payload is normalized and includes the document type', () => {
  assert.deepEqual(validateGraduado(valid, 'create', TODAY), {
    errors: {},
    payload: { tipoDocumento: 'CC', numeroDocumento: '1036123456', nombres: 'María José', apellidos: "O'Neil Pérez", fechaNacimiento: '2000-02-29' }
  });
});

test('edit never sends the document type, which the backend cannot change', () => {
  const { payload } = validateGraduado({ ...valid, tipoDocumento: 'TI' }, 'edit', TODAY);
  assert.equal('tipoDocumento' in payload, false);
});

test('document number rules depend on the document type', () => {
  assert.match(validateGraduado({ ...valid, numeroDocumento: '10.361.234' }, 'create', TODAY).errors.numeroDocumento, /dígitos/);
  assert.equal(validateGraduado({ ...valid, tipoDocumento: 'PA', numeroDocumento: 'ab12345' }, 'create', TODAY).payload.numeroDocumento, 'AB12345');
  assert.match(validateGraduado({ ...valid, tipoDocumento: 'PA', numeroDocumento: 'AB-12' }, 'create', TODAY).errors.numeroDocumento, /letras o números/);
  assert.match(validateGraduado({ ...valid, tipoDocumento: 'XX' }, 'create', TODAY).errors.tipoDocumento, /tipo/);
});

test('names and birth date are validated', () => {
  const empty = validateGraduado(EMPTY_GRADUADO, 'create', TODAY);
  assert.deepEqual(Object.keys(empty.errors).sort(), ['apellidos', 'fechaNacimiento', 'nombres', 'numeroDocumento']);
  assert.match(validateGraduado({ ...valid, nombres: 'Ana2' }, 'create', TODAY).errors.nombres, /solo letras/);
  assert.match(validateGraduado({ ...valid, fechaNacimiento: '2026-11-17' }, 'create', TODAY).errors.fechaNacimiento, /anterior a hoy/);
  assert.match(validateGraduado({ ...valid, fechaNacimiento: '1899-12-31' }, 'create', TODAY).errors.fechaNacimiento, /no es válida/);
});

test('date range filter requires both ends, in order, and covers the whole last day', () => {
  assert.match(graduadoFilters({ desde: '2026-01-01' }).error, /desde.*hasta/);
  assert.match(graduadoFilters({ desde: '2026-02-01', hasta: '2026-01-01' }).error, /posterior/);
  const { params, error } = graduadoFilters({ numeroDocumento: ' pa123 ', estado: 'true', desde: '2026-01-01', hasta: '2026-01-31' });
  assert.equal(error, '');
  assert.equal(params.numeroDocumento, 'PA123');
  assert.equal(params.estado, 'true');
  const range = dayRangeIso('2026-01-01', '2026-01-31');
  assert.equal(params.fechaDesde, range.fechaDesde);
  assert.equal(new Date(range.fechaHasta).getDate(), 31);
  assert.equal(new Date(range.fechaHasta).getHours(), 23);
  assert.equal(graduadoFilters({}).params.estado, undefined);
});

test('existing graduate response is detected and API data maps to the form', () => {
  const g = { _id: 'g1', tipoDocumento: 'TI', numeroDocumento: '123', nombres: 'A', apellidos: 'B', fechaNacimiento: '2010-05-04T00:00:00.000Z' };
  assert.equal(existingGraduado({ response: { status: 400, data: { msg: 'El graduado ya existe', graduado: g } } }), g);
  assert.equal(existingGraduado({ response: { status: 400, data: { errors: ['x'] } } }), null);
  assert.deepEqual(graduadoToForm(g), { tipoDocumento: 'TI', numeroDocumento: '123', nombres: 'A', apellidos: 'B', fechaNacimiento: '2010-05-04' });
});
