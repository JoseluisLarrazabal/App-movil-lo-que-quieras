const express = require('express');
const User = require('../models/User');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, async (req, res) => {
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

// Actualizar perfil del usuario
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatar, phone, location } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos permitidos
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (phone) user.phone = phone;
    if (location) user.location = location;

    await user.save();

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: user.toPublic()
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener todos los usuarios (solo admin)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  console.log('--- /api/users endpoint hit ---');
  try {
    const users = await User.find({}).select('-password');
    
    res.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener usuario por ID (solo admin)
router.get('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar estado de usuario (solo admin)
router.patch('/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Estado de usuario actualizado',
      user
    });
  } catch (error) {
    console.error('Error actualizando estado de usuario:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 