import test from 'node:test';
import assert from 'node:assert/strict';
import { greeting, pendingQueueForRole, statValue, statsForRole } from '../src/helpers/dashboardStats.js';

test('each role gets its own indicators, all pointing to sections it can open', () => {
  const admin = statsForRole('ADMIN');
  const inst = statsForRole('INSTITUCION');
  assert.deepEqual(admin.map((s) => s.source), ['instituciones', 'usuarios', 'graduados', 'solicitudesEdicion']);
  assert.deepEqual(inst.map((s) => s.source), ['diplomasInstitucion', 'graduados', 'solicitudesDocumento', 'solicitudesDocumento']);
  assert.ok([...admin, ...inst].every((s) => s.params.limit === 1 && s.href.startsWith('/admin-dashboard')));
  assert.deepEqual(statsForRole('ESTUDIANTE'), []);
  assert.equal(pendingQueueForRole('ADMIN').source, 'solicitudesEdicion');
  assert.equal(pendingQueueForRole('INSTITUCION').params.estado, 'PENDIENTE');
  assert.equal(pendingQueueForRole('ESTUDIANTE'), null);
});

test('statValue reads totals, arrays, empty-404 and unknown failures', () => {
  assert.equal(statValue({ status: 'fulfilled', value: { total: 42, results: [{}] } }), 42);
  assert.equal(statValue({ status: 'fulfilled', value: { total: 0, results: [] } }), 0);
  assert.equal(statValue({ status: 'fulfilled', value: [{}, {}, {}] }), 3);
  assert.equal(statValue({ status: 'fulfilled', value: { results: [{}, {}] } }), 2);
  assert.equal(statValue({ status: 'fulfilled', value: { msg: 'raro' } }), null);
  assert.equal(statValue({ status: 'rejected', reason: { response: { status: 404 } } }), 0);
  assert.equal(statValue({ status: 'rejected', reason: { response: { status: 500 } } }), null);
  assert.equal(statValue({ status: 'rejected', reason: new Error('red') }), null);
  assert.equal(statValue(undefined), null);
});

test('greeting follows the local hour', () => {
  assert.equal(greeting(new Date(2026, 0, 1, 8)), 'Buenos días');
  assert.equal(greeting(new Date(2026, 0, 1, 15)), 'Buenas tardes');
  assert.equal(greeting(new Date(2026, 0, 1, 21)), 'Buenas noches');
});
