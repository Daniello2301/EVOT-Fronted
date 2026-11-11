import test from 'node:test';
import assert from 'node:assert/strict';
import { userFromClaims, postLoginPath } from '../src/helpers/authSession.js';

test('JWT claims produce the expected user', () => {
  assert.deepEqual(userFromClaims({_id:'u1',rol:'ESTUDIANTE',correo:'a@b.co',exp:150},100000), {
    _id:'u1', rol:'ESTUDIANTE', correo:'a@b.co', nombreUsuario:undefined, institucion:undefined
  });
});
test('Expired or incomplete claims are rejected', () => {
  assert.throws(()=>userFromClaims(null),/inválido/);
  assert.throws(()=>userFromClaims({_id:'u1',rol:'ADMIN',exp:50},51000),/expirado/);
  assert.throws(()=>userFromClaims({rol:'ADMIN'}),/requeridos/);
});
test('Only relative same-origin redirects are accepted', () => {
  assert.equal(postLoginPath({url:'/search/diploma'},'ESTUDIANTE'),'/search/diploma');
  assert.equal(postLoginPath({url:'//evil.example'},'ADMIN'),'/admin-dashboard');
  assert.equal(postLoginPath({url:'https://evil.example'},'ESTUDIANTE'),'/home');
  assert.equal(postLoginPath({url:'/bad\ninjected'},'ESTUDIANTE'),'/home');
  assert.equal(postLoginPath(null,'INSTITUCION'),'/admin-dashboard');
  assert.equal(postLoginPath(null,'ESTUDIANTE'),'/home');
});
