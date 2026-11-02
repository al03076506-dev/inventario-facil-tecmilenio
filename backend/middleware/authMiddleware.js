
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Token requerido. Inicia sesión.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    const user = await User.findById(decoded.sub)
      .select('_id role');

    if (!user) {
      return res.status(401).json({
        message: 'El usuario ya no existe.'
      });
    }

    req.user = {
      id: user.id,
      role: user.role || 'user'
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError' ||
        error.name === 'NotBeforeError') {
      return res.status(401).json({
        message: 'Token inválido o expirado.'
      });
    }

    next(error);
  }
};
