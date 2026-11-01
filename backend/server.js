require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/database');
async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith('REEMPLAZAR')) {
    throw new Error('Configura JWT_SECRET con una clave segura de al menos 32 caracteres en .env');
  }
  await connectDatabase();
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Aplicación disponible en http://localhost:${port}`));
}
start().catch(err => { console.error('No se pudo iniciar:', err.message); process.exit(1); });
