import test from 'node:test';
import assert from 'node:assert/strict';
import { extractDiplomaList, extractDiploma, diplomaId, diplomaToForm, diplomaPayload, filterDiplomas, diplomaError, assertDiplomaMutation } from '../src/helpers/diplomaModel.js';

test('Extracts flat and nested collection payloads', () => {
  const xs = [{_id:'a'}];
  for (const payload of [xs,{results:xs},{data:xs},{data:{results:xs}},{data:{diplomas:xs}}]) {
    assert.deepEqual(extractDiplomaList(payload),xs);
  }
  assert.deepEqual(extractDiplomaList({error:'unavailable'}),[]);
});

test('Extracts detail payload and stable identity', () => {
  const d={_id:'d1',codigoDiploma:'C-44'};
  assert.equal(extractDiploma({data:{diploma:d}}),d);
  assert.equal(diplomaId(d),'d1');
  assert.equal(diplomaId({id:'fallback'}),'fallback');
  assert.equal(extractDiploma(null),null);
});

test('Creates trimmed payload with exact document, no unsafe parseInt', () => {
  const form={codigoDiploma:' C-44 ',nombrePrograma:' Ingeniería ',nivelPrograma:'Pregrado',registroPrograma:'R44',libro:'L2',fechaGrados:'2024-05-09',numeroDocumento:'0012345'};
  const created=diplomaPayload(form);
  assert.equal(created.codigoDiploma,'C-44');
  assert.equal(created.numeroDocumento,'0012345');
  const edited=diplomaPayload(form,true);
  assert.equal('numeroDocumento' in edited,false);
  assert.equal(diplomaToForm({...form,fechaGrados:'2024-05-09T00:00:00.000Z'}).fechaGrados,'2024-05-09');
});

test('Rejects missing fields and invalid dates/documents', () => {
  const ok={codigoDiploma:'C',nombrePrograma:'N',nivelPrograma:'P',registroPrograma:'R',libro:'L',fechaGrados:'2024-05-09',numeroDocumento:'12345'};
  assert.throws(()=>diplomaPayload({...ok,libro:''}),/libro/);
  assert.throws(()=>diplomaPayload({...ok,fechaGrados:'2024-02-31'}),/fecha/);
  assert.throws(()=>diplomaPayload({...ok,numeroDocumento:'12e5'}),/documento/);
});

test('Filters by code, title, graduate and institution with accent-insensitive matching', () => {
  const list=[{codigoDiploma:'D-A',nombrePrograma:'Ingeniería de Sistemas',institucion:{nombreInstitucion:'Universidad Andina'},graduado:{nombres:'Camila',numeroDocumento:'0012'}},{codigoDiploma:'D-B',nombrePrograma:'Arte'}];
  assert.equal(filterDiplomas(list,'ingenieria').length,1);
  assert.equal(filterDiplomas(list,'0012').length,1);
  assert.equal(filterDiplomas(list,'D-B').length,1);
  assert.equal(filterDiplomas(list,'nada').length,0);
});

test('Returns safe fallback and backend error messages', () => {
  assert.equal(diplomaError({response:{data:{msg:'Sin permisos'}}}),'Sin permisos');
  assert.match(diplomaError({}),/No se pudo/);
});

test('Diploma mutations reject logical errors and accept successful responses', () => {
  const success = { success: true, msg: 'Guardado' };
  assert.equal(assertDiplomaMutation(success), success);
  assert.throws(() => assertDiplomaMutation({ok:false,msg:'No autorizado'}), /No autorizado/);
  assert.throws(() => assertDiplomaMutation({data:{success:false,message:'Registro duplicado'}}), /Registro duplicado/);
});
