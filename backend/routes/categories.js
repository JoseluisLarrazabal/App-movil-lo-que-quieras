const express = require('express');
const Category = require('../models/Category');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    res.json({
      categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category || !category.isActive) {
      return res.status(404).json({
        message: 'Categoría no encontrada'
      });
    }

    res.json({ category });
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Crear nueva categoría (solo admin)
router.post('/', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;

    // Verificar si la categoría ya existe
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(409).json({
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    const category = new Category({
      name,
      description,
      icon,
      color
    });

    await category.save();

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      category
    });
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar categoría (solo admin)
router.put('/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const { name, description, icon, color, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: 'Categoría no encontrada'
      });
    }

    // Verificar si el nuevo nombre ya existe (excluyendo la categoría actual)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(409).json({
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    // Actualizar campos
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;
    if (color) category.color = color;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      message: 'Categoría actualizada exitosamente',
      category
    });
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar categoría (solo admin) - Soft delete
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Categoría no encontrada'
      });
    }

    // Soft delete - marcar como inactiva
    category.isActive = false;
    await category.save();

    res.json({
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 