const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../backend/app');
const http = require('node:http');

async function request(method, path, payload) {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}${path}`;
  try {
    const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: payload ? JSON.stringify(payload) : undefined });
    return { status: response.status, data: await response.json() };
  } finally { await new Promise(resolve => server.close(resolve)); }
}

test('GET /api/health devuelve estado ok', async () => {
  const result = await request('GET', '/api/health');
  assert.equal(result.status, 200);
  assert.equal(result.data.status, 'ok');
});
test('POST /api/products sin JWT devuelve 401', async () => {
  const result = await request('POST', '/api/products', { name: 'Prueba', price: 10, stock: 1 });
  assert.equal(result.status, 401);
});
test('PUT /api/products/:id sin JWT devuelve 401', async () => {
  const result = await request('PUT', '/api/products/507f1f77bcf86cd799439011', { name: 'Prueba', price: 10, stock: 1 });
  assert.equal(result.status, 401);
});
