import test from 'node:test';
import assert from 'node:assert/strict';
import { assertStudentRegistration } from '../src/helpers/studentRegistration.js';

test('accepts axios data without fetch response helpers', () => {
  const result = { msg: 'Creado', usuario: { _id: '123' } };
  assert.equal(assertStudentRegistration(result), result);
  assert.equal(assertStudentRegistration(null), null);
});

test('rejects explicit logical errors in successful HTTP response', () => {
  assert.throws(() => assertStudentRegistration({ok:false,msg:'Duplicado'}), /Duplicado/);
  assert.throws(() => assertStudentRegistration({success:false}), /No fue posible/);
});
