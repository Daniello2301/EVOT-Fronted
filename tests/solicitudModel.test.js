import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_PDF_BYTES, endOfLocalDayIso, formatBytes, isDescargable, maxExpiracion, maxExpiracionInputDate,
  nombreArchivoDescarga, validateAprobacion
} from '../src/helpers/solicitudModel.js';

const NOW = new Date(2026, 10, 17, 10, 30); // 17 nov 2026, 10:30 local
const pdf = { name: 'diploma.pdf', type: 'application/pdf', size: 200_000 };

test('approval accepts today (end of day) and sends an ISO timestamp', () => {
  const { errors, payload } = validateAprobacion({ archivo: pdf, fechaExpiracion: '2026-11-17' }, NOW);
  assert.deepEqual(errors, {});
  assert.equal(payload.fechaExpiracion, endOfLocalDayIso('2026-11-17'));
  assert.ok(new Date(payload.fechaExpiracion) > NOW);
});

test('approval rejects past dates, dates beyond the 3-month backend limit and bad files', () => {
  assert.match(validateAprobacion({ archivo: pdf, fechaExpiracion: '2026-11-16' }, NOW).errors.fechaExpiracion, /anterior/);
  assert.match(validateAprobacion({ archivo: pdf, fechaExpiracion: '2027-02-18' }, NOW).errors.fechaExpiracion, /3 meses/);
  assert.match(validateAprobacion({ archivo: { ...pdf, type: 'image/png', name: 'x.png' }, fechaExpiracion: '2026-12-01' }, NOW).errors.archivo, /PDF/);
  assert.match(validateAprobacion({ archivo: { ...pdf, size: MAX_PDF_BYTES + 1 }, fechaExpiracion: '2026-12-01' }, NOW).errors.archivo, /10 MB/);
  assert.match(validateAprobacion({ archivo: { ...pdf, size: 0 }, fechaExpiracion: '2026-12-01' }, NOW).errors.archivo, /vacío/);
  assert.deepEqual(Object.keys(validateAprobacion({}, NOW).errors).sort(), ['archivo', 'fechaExpiracion']);
  assert.equal(validateAprobacion({ archivo: { name: 'SIN-TIPO.PDF', size: 10 }, fechaExpiracion: '2026-12-01' }, NOW).errors.archivo, undefined);
});

test('the maximum selectable day ends before the backend limit', () => {
  const lastDay = maxExpiracionInputDate(NOW);
  assert.equal(lastDay, '2027-02-16');
  assert.ok(new Date(endOfLocalDayIso(lastDay)) <= maxExpiracion(NOW));
  assert.equal(validateAprobacion({ archivo: pdf, fechaExpiracion: lastDay }, NOW).errors.fechaExpiracion, undefined);
});

test('only approved and unexpired documents can be downloaded', () => {
  assert.equal(isDescargable({ estado: 'APROBADO', fechaExpiracion: '2026-11-18T00:00:00Z' }, NOW), true);
  assert.equal(isDescargable({ estado: 'APROBADO', fechaExpiracion: '2026-11-01T00:00:00Z' }, NOW), false);
  assert.equal(isDescargable({ estado: 'PENDIENTE', fechaExpiracion: '2026-12-01T00:00:00Z' }, NOW), false);
  assert.equal(isDescargable({ estado: 'APROBADO' }, NOW), false);
});

test('download file name is safe and readable', () => {
  assert.equal(nombreArchivoDescarga({ diploma: { codigoDiploma: 'DIP 2024/01' }, apellidos: 'Peña Gómez' }), 'documento_dip-2024-01_pena-gomez.pdf');
  assert.equal(nombreArchivoDescarga({}), 'documento.pdf');
  assert.equal(formatBytes(1536), '2 KB');
  assert.equal(formatBytes(3 * 1024 * 1024), '3.0 MB');
});
