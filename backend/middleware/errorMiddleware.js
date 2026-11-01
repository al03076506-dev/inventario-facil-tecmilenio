const mongoose = require('mongoose');
function notFound(req, res) {
  res.status(404).json({ message: 'Ruta no encontrada' });
}
function errorHandler(err, req, res, next) {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: 'Datos inválidos', details: Object.values(err.errors).map(e => e.message) });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Identificador inválido' });
  }
  if (err.code === 11000) return res.status(409).json({ message: 'El correo ya está registrado.' });
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
}
module.exports = { notFound, errorHandler };
