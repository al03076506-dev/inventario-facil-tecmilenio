const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

function validateProduct(body) {
  const { name, description = '', price, stock, category = 'General' } = body || {};
  if (typeof name !== 'string' || !name.trim() || name.length > 100 ||
      typeof description !== 'string' || description.length > 500 ||
      typeof category !== 'string' || category.length > 60 ||
      typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
      !Number.isInteger(stock) || stock < 0) {
    return null;
  }
  return { name: name.trim(), description: description.trim(), price, stock, category: category.trim() || 'General' };
}
function validId(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'ID de producto inválido.' });
    return false;
  }
  return true;
}
exports.list = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json(products);
});
exports.get = asyncHandler(async (req, res) => {
  if (!validId(req, res)) return;
  const product = await Product.findById(req.params.id).lean();
  if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
  res.json(product);
});
exports.create = asyncHandler(async (req, res) => {
  const data = validateProduct(req.body);
  if (!data) return res.status(400).json({ message: 'Revisa nombre, descripción, precio, stock y categoría.' });
  const product = await Product.create({ ...data, owner: req.user.id });
  res.status(201).json(product);
});
exports.update = asyncHandler(async (req, res) => {
  if (!validId(req, res)) return;
  const data = validateProduct(req.body);
  if (!data) return res.status(400).json({ message: 'Datos del producto inválidos.' });
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id }, data, { new: true, runValidators: true }
  );
  if (!product) return res.status(404).json({ message: 'Producto no encontrado o sin permiso para editarlo.' });
  res.json(product);
});
exports.remove = asyncHandler(async (req, res) => {
  if (!validId(req, res)) return;
  const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!product) return res.status(404).json({ message: 'Producto no encontrado o sin permiso para eliminarlo.' });
  res.json({ message: 'Producto eliminado correctamente.' });
});
