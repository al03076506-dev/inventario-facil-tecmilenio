
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateToken = user => jwt.sign(
  {},
  process.env.JWT_SECRET,
  {
    subject: user._id.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    algorithm: 'HS256'
  }
);

const userResponse = user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role || 'user'
});

// Registro de usuarios
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    name.trim().length > 80 ||
    typeof email !== 'string' ||
    !emailPattern.test(email.trim()) ||
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 128
  ) {
    return res.status(400).json({
      message: 'Proporciona nombre, correo válido y contraseña de 8 a 128 caracteres.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (await User.exists({ email: normalizedEmail })) {
    return res.status(409).json({
      message: 'El correo ya está registrado.'
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'user'
  });

  res.status(201).json({
    message: 'Usuario registrado',
    user: userResponse(user),
    token: generateToken(user)
  });
});

// Inicio de sesión
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({
      message: 'Correo y contraseña son obligatorios.'
    });
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase()
  }).select('+passwordHash');

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({
      message: 'Credenciales incorrectas.'
    });
  }

  res.json({
    message: 'Inicio de sesión correcto',
    user: userResponse(user),
    token: generateToken(user)
  });
});
