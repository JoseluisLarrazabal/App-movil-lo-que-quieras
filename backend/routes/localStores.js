const express = require('express');
const LocalStore = require('../models/LocalStore');
const router = express.Router();

// Obtener todos los comercios (con filtros opcionales)
router.get('/', async (req, res) => {
  try {
    const { type, city, search } = req.query;
    let filters = { isActive: true };
    if (type) filters.type = type;
    if (city) filters.city = city;
    if (search) filters.name = { $regex: search, $options: 'i' };
    const stores = await LocalStore.find(filters).sort({ featured: -1, name: 1 });
    res.json({ stores, total: stores.length });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener detalle de un comercio
router.get('/:id', async (req, res) => {
  try {
    const store = await LocalStore.findById(req.params.id);
    if (!store || !store.isActive) {
      return res.status(404).json({ message: 'Comercio no encontrado' });
    }
    res.json({ store });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 