import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EMPTY_INSTITUCION, INSTITUCION_MODES, extractInstitucion, institucionFilters, institucionToForm, validateInstitucion
} from '../src/helpers/institucionModel.js';

const TODAY = new Date(2026, 10, 17, 12, 0);
const valid = {
  codigoInstitucion: ' 1234 ', nombreInstitucion: ' Colegio Central ', ciudad: 'Medellín',
  departamento: 'Antioquia', resolucion: 'RES-001', fechaResolucion: '2020-05-10'
};

test('create requires every field and converts the code to a number', () => {
  const { errors, payload } = validateInstitucion(valid, INSTITUCION_MODES.CREATE, TODAY);
  assert.deepEqual(errors, {});
  assert.deepEqual(payload, {
    codigoInstitucion: 1234, nombreInstitucion: 'Colegio Central', ciudad: 'Medellín',
    departamento: 'Antioquia', resolucion: 'RES-001', fechaResolucion: '2020-05-10'
  });
  const empty = validateInstitucion(EMPTY_INSTITUCION, INSTITUCION_MODES.CREATE, TODAY);
  assert.equal(empty.payload, null);
  assert.deepEqual(Object.keys(empty.errors).sort(), ['ciudad', 'codigoInstitucion', 'departamento', 'fechaResolucion', 'nombreInstitucion', 'resolucion']);
});

test('code must be a positive integer and the resolution date cannot be future or invalid', () => {
  assert.match(validateInstitucion({ ...valid, codigoInstitucion: '12a' }, 'create', TODAY).errors.codigoInstitucion, /entero positivo/);
  assert.match(validateInstitucion({ ...valid, codigoInstitucion: '0' }, 'create', TODAY).errors.codigoInstitucion, /entero positivo/);
  assert.match(validateInstitucion({ ...valid, fechaResolucion: '2026-11-18' }, 'create', TODAY).errors.fechaResolucion, /futura/);
  assert.equal(validateInstitucion({ ...valid, fechaResolucion: '2026-11-17' }, 'create', TODAY).errors.fechaResolucion, undefined);
  assert.match(validateInstitucion({ ...valid, fechaResolucion: '2026-02-30' }, 'create', TODAY).errors.fechaResolucion, /no es válida/);
});

test('"me" mode never sends the code, which the backend does not allow to change', () => {
  const { payload, errors } = validateInstitucion({ ...valid, codigoInstitucion: '' }, INSTITUCION_MODES.ME, TODAY);
  assert.deepEqual(errors, {});
  assert.equal('codigoInstitucion' in payload, false);
});

test('institution helpers map API data to form and filters to query', () => {
  const api = { _id: 'i1', codigoInstitucion: 77, nombreInstitucion: 'U', ciudad: 'C', departamento: 'D', resolucion: 'R', fechaResolucion: '2019-03-01T00:00:00.000Z' };
  assert.equal(extractInstitucion({ msg: 'ok', institucion: api }), api);
  assert.equal(extractInstitucion(api), api);
  assert.equal(extractInstitucion(null), null);
  assert.deepEqual(institucionToForm(api), { codigoInstitucion: '77', nombreInstitucion: 'U', ciudad: 'C', departamento: 'D', resolucion: 'R', fechaResolucion: '2019-03-01' });
  assert.deepEqual(institucionToForm(null), { ...EMPTY_INSTITUCION });
  assert.deepEqual(institucionFilters({ nombreInstitucion: ' uni ', ciudad: '', estado: 'false' }), { nombreInstitucion: 'uni', ciudad: undefined, estado: 'false' });
  assert.equal(institucionFilters({ estado: 'otro' }).estado, undefined);
});
