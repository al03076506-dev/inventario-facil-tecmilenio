
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const {
  notFound,
  errorHandler
} = require('./middleware/errorMiddleware');

const currencyRoutes = require('./routes/currencyRoutes');

const app = express();

app.disable('x-powered-by');

app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
    : false
}));

app.use(express.json({ limit: '20kb' }));

// Estado del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rutas de la API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/currency', currencyRoutes);

// Frontend React compilado
const reactDist = path.join(
  __dirname,
  '..',
  'frontend-react',
  'dist'
);

// Frontend original como respaldo local
const legacyFrontend = path.join(
  __dirname,
  '..',
  'frontend'
);

const frontendPath = fs.existsSync(
  path.join(reactDist, 'index.html')
)
  ? reactDist
  : legacyFrontend;

app.use(express.static(frontendPath));

// Rutas de React Router
app.get('*', (req, res, next) => {
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;

