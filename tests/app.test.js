
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const jwt = require('jsonwebtoken');

const app = require('../backend/app');
const User = require('../backend/models/User');

// Clave exclusiva para ejecutar pruebas locales.
const previousSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = 'clave-local-de-pruebas-no-utilizar-en-produccion';

async function request(method, path, payload, token) {
  const server = http.createServer(app);

  await new Promise(resolve => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const url =
    `http://127.0.0.1:${server.address().port}${path}`;

  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: payload === undefined
        ? undefined
        : JSON.stringify(payload)
    });

    const text = await response.text();

    return {
      status: response.status,
      data: text ? JSON.parse(text) : {}
    };

  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

function createToken(expiresIn = '1h') {
  return jwt.sign(
    {},
    process.env.JWT_SECRET,
    {
      subject: '507f1f77bcf86cd799439011',
      expiresIn,
      algorithm: 'HS256'
    }
  );
}

function mockUserRole(role) {
  const original = User.findById;

  User.findById = () => ({
    select: async () => ({
      id: '507f1f77bcf86cd799439011',
      role
    })
  });

  return () => {
    User.findById = original;
  };
}

// PRUEBA 1: Estado del servidor
test('GET /api/health devuelve 200 OK', async () => {
  const result = await request('GET', '/api/health');

  assert.equal(result.status, 200);
  assert.equal(result.data.status, 'ok');
});

// PRUEBA 2: Crear producto sin autenticación
test('POST /api/products sin JWT devuelve 401', async () => {
  const result = await request('POST', '/api/products', {
    name: 'Producto prueba',
    price: 100,
    stock: 5
  });

  assert.equal(result.status, 401);
});

// PRUEBA 3: Editar producto sin autenticación
test('PUT /api/products/:id sin JWT devuelve 401', async () => {
  const result = await request(
    'PUT',
    '/api/products/507f1f77bcf86cd799439011',
    {
      name: 'Producto prueba',
      price: 100,
      stock: 5
    }
  );

  assert.equal(result.status, 401);
});

// PRUEBA 4: Token inválido
test('JWT inválido devuelve 401', async () => {
  const result = await request(
    'POST',
    '/api/products',
    {
      name: 'Producto prueba',
      price: 100,
      stock: 5
    },
    'token-invalido'
  );

  assert.equal(result.status, 401);
});

// PRUEBA 5: Token expirado
test('JWT expirado devuelve 401', async () => {
  const token = createToken(-10);

  const result = await request(
    'POST',
    '/api/products',
    {
      name: 'Producto prueba',
      price: 100,
      stock: 5
    },
    token
  );

  assert.equal(result.status, 401);
});

// PRUEBA 6: Usuario regular sin permisos
test('Usuario regular no puede crear productos', async () => {
  const restore = mockUserRole('user');

  try {
    const token = createToken();

    const result = await request(
      'POST',
      '/api/products',
      {
        name: 'Producto prueba',
        price: 100,
        stock: 5
      },
      token
    );

    assert.equal(result.status, 403);

  } finally {
    restore();
  }
});

// PRUEBA 7: Validación de paginación
test('GET /api/products?page=0 devuelve 400', async () => {
  const result = await request(
    'GET',
    '/api/products?page=0&limit=5'
  );

  assert.equal(result.status, 400);
});

// PRUEBA 8: Cantidad negativa en conversión
test('API de monedas rechaza cantidades negativas', async () => {
  const result = await request(
    'GET',
    '/api/currency/convert?amount=-100'
  );

  assert.equal(result.status, 400);
});

// PRUEBA 9: Conversión simulada de monedas
test('API convierte MXN a USD correctamente', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    if (
      String(url) ===
      'https://api.frankfurter.dev/v2/rate/MXN/USD'
    ) {
      return new Response(
        JSON.stringify({
          date: '2026-11-02',
          base: 'MXN',
          quote: 'USD',
          rate: 0.05
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return originalFetch(url, options);
  };

  try {
    const result = await request(
      'GET',
      '/api/currency/convert?amount=1000'
    );

    assert.equal(result.status, 200);
    assert.equal(result.data.amountMXN, 1000);
    assert.equal(result.data.rate, 0.05);
    assert.equal(result.data.amountUSD, 50);
    assert.equal(result.data.source, 'Frankfurter');

  } finally {
    globalThis.fetch = originalFetch;
  }
});

test.after(() => {
  if (previousSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = previousSecret;
  }
});
