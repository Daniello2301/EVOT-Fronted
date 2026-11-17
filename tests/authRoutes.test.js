import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublicEndpoint, isAuthenticationEndpoint, normalizeApiPath } from '../src/helpers/authRoutes.js';

test('Public endpoints match exactly', () => {
  for(const route of ['auth/login','/auth/refresh','/api/users/student','institutions/actives',
    'diplomas/by/graduate/123','https://api.example.com/api/diplomas/verify/XYZ?q=1']) {
    assert.equal(isPublicEndpoint(route),true,route);
  }
});
test('Private endpoints remain private', () => {
  for(const route of ['diplomas/1/solicitar-documento','diplomas','auth/logout',
    'institutions/me','not-auth/login','diplomas/verify','diplomas/by/graduate','users/student/3']) {
    assert.equal(isPublicEndpoint(route),false,route);
  }
});
test('URL normalizer recognizes auth paths', () => {
  assert.equal(normalizeApiPath('https://example.com/api/auth/refresh?a=1'),'auth/refresh');
  assert.equal(normalizeApiPath(''),'');
  assert.equal(isAuthenticationEndpoint('auth/logout'),true);
});
