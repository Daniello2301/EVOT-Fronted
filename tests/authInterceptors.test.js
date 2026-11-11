import test from 'node:test';
import assert from 'node:assert/strict';
import { installAuthInterceptors } from '../src/helpers/authInterceptorsCore.js';

function fakeAxios() {
  const requests=new Map(),responses=new Map(),retry=[];
  let id=0;
  const client=async config => { retry.push(config); return {status:200,config}; };
  client.interceptors={
    request:{use:fn=>{const key=++id;requests.set(key,fn);return key;},eject:key=>requests.delete(key)},
    response:{use:(ok,err)=>{const key=++id;responses.set(key,{ok,err});return key;},eject:key=>responses.delete(key)}
  };
  return {client,requests,responses,retry};
}
const denied=(url,access='old')=>({response:{status:401},config:{url,headers:{Authorization:'Bearer '+access}}});

test('Attaches access JWT only to private URLs; eject cleans up',()=>{
  const f=fakeAxios();
  const eject=installAuthInterceptors(f.client,{getAccessToken:()=> 'access',refreshToken:async()=> 'new',logout:async()=>{}});
  const req=[...f.requests.values()][0];
  assert.equal(req({url:'diplomas/3/solicitar-documento',headers:{}}).headers.Authorization,'Bearer access');
  assert.equal(req({url:'auth/refresh',headers:{Authorization:'Bearer refresh'}}).headers.Authorization,'Bearer refresh');
  assert.equal(req({url:'auth/login',headers:{}}).headers.Authorization,undefined);
  eject();
  assert.equal(f.requests.size,0);
  assert.equal(f.responses.size,0);
});
test('Concurrent 401s use exactly one refresh and both retry',async()=>{
  const f=fakeAxios();let token='old',count=0;
  const eject=installAuthInterceptors(f.client,{
    getAccessToken:()=> token,
    refreshToken:async()=> {count++;await Promise.resolve();token='new';return token;},
    logout:async()=>{}
  });
  const err=[...f.responses.values()][0].err;
  const results=await Promise.all([err(denied('diplomas/1')),err(denied('institutions/me'))]);
  assert.equal(count,1);
  assert.equal(results.length,2);
  assert.deepEqual(f.retry.map(x=>x.headers.Authorization),['Bearer new','Bearer new']);
  eject();
});
test('Failed refresh rejects every concurrent caller',async()=>{
  const f=fakeAxios();let count=0,logouts=0;
  const eject=installAuthInterceptors(f.client,{
    getAccessToken:()=> 'old',
    refreshToken:async()=> {count++;throw new Error('refresh failed');},
    logout:async()=> {logouts++;}
  });
  const err=[...f.responses.values()][0].err;
  const results=await Promise.allSettled([err(denied('diplomas/1')),err(denied('diplomas/2'))]);
  assert.equal(count,1);
  assert.ok(results.every(x=>x.status==='rejected'&&x.reason.message==='refresh failed'));
  assert.equal(logouts,2);
  eject();
});
test('Public, forbidden and retried requests do not refresh',async()=>{
  const f=fakeAxios();let count=0;
  const eject=installAuthInterceptors(f.client,{
    getAccessToken:()=> 'old',refreshToken:async()=> {count++;return 'new';},logout:async()=>{}
  });
  const err=[...f.responses.values()][0].err;
  for(const e of [denied('auth/refresh'),denied('diplomas/verify/A'),
    {...denied('diplomas'),response:{status:403}},
    {...denied('diplomas'),config:{url:'diplomas',_retry:true}}]) {
    await assert.rejects(err(e));
  }
  assert.equal(count,0);
  eject();
});
test('Stale request retries current JWT without refreshing',async()=>{
  const f=fakeAxios();let count=0;
  const eject=installAuthInterceptors(f.client,{
    getAccessToken:()=> 'new',refreshToken:async()=> {count++;return 'never';},logout:async()=>{}
  });
  const err=[...f.responses.values()][0].err;
  const result=await err(denied('diplomas/1'));
  assert.equal(result.config.headers.Authorization,'Bearer new');
  assert.equal(count,0);
  eject();
});
