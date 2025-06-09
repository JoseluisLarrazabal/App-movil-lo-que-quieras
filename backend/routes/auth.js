const express = require('express');
const User = require('../models/User');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const { registerSchema, loginSchema } = require('../utils/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { name, email, password, role } = value;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Respuesta exitosa
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: user.toPublic(),
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { email, password } = value;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        message: 'Cuenta desactivada. Contacta al soporte'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email o contraseña incorrectos'
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Respuesta exitosa
    res.json({
      message: 'Login exitoso',
      user: user.toPublic(),
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token requerido'
      });
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Verificar que el usuario aún existe
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        message: 'Usuario no encontrado o inactivo'
      });
    }

    // Generar nuevos tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    res.json({
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error('Error en refresh:', error);
    res.status(401).json({
      message: 'Refresh token inválido'
    });
  }
});

// Obtener perfil del usuario autenticado
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user.toPublic()
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Logout (invalidar token - aquí podrías implementar una blacklist)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // En una implementación real, aquí agregarías el token a una blacklist
    // Por ahora, simplemente confirmamos el logout
    
    res.json({
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;