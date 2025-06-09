const jwt = require('jsonwebtoken');

// Generar tokens JWT
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Token de acceso expira en 15 minutos
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Token de refresh expira en 7 días
  );

  return { accessToken, refreshToken };
};

// Verificar refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Refresh token inválido');
  }
};

module.exports = {
  generateTokens,
  verifyRefreshToken
};