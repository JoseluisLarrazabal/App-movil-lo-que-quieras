const express = require('express');
const LocalStore = require('../models/LocalStore');
const router = express.Router();
const HealthFacility = require("../models/HealthFacility");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const mongoose = require('mongoose');

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

// --- CRUD para comerciantes (merchant) ---
// Listar comercios propios
router.get("/my-local-stores", authenticateToken, async (req, res) => {
  if (req.user.role !== 'merchant') {
    return res.status(403).json({ message: 'Solo comerciantes pueden ver sus comercios' });
  }
  try {
    console.log('Merchant ID:', req.user._id, typeof req.user._id);
    let ownerId = req.user._id;
    if (typeof ownerId === 'string') {
      ownerId = mongoose.Types.ObjectId(ownerId);
    }
    const stores = await LocalStore.find({ owner: ownerId });
    console.log('Stores found:', stores.length);
    res.json({ stores });
  } catch (err) {
    console.error('Error al obtener comercios:', err);
    res.status(500).json({ message: 'Error al obtener comercios', error: err.message });
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

// Crear comercio (merchant)
router.post("/", authenticateToken, async (req, res) => {
  if (req.user.role !== 'merchant') {
    return res.status(403).json({ message: 'Solo comerciantes pueden crear comercios' });
  }
  try {
    const data = { ...req.body, owner: req.user._id };
    const store = new LocalStore(data);
    await store.save();
    res.status(201).json({ store });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear comercio', error: err.message });
  }
});

// Editar comercio (solo owner)
router.put("/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== 'merchant') {
    return res.status(403).json({ message: 'Solo comerciantes pueden editar comercios' });
  }
  try {
    const store = await LocalStore.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'No encontrado' });
    if (String(store.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'No tienes permisos para editar este comercio' });
    }
    Object.assign(store, req.body);
    await store.save();
    res.json({ store });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar comercio', error: err.message });
  }
});

// Eliminar comercio (solo owner)
router.delete("/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== 'merchant') {
    return res.status(403).json({ message: 'Solo comerciantes pueden eliminar comercios' });
  }
  try {
    const store = await LocalStore.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'No encontrado' });
    if (String(store.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este comercio' });
    }
    await store.deleteOne();
    res.json({ message: 'Comercio eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar comercio', error: err.message });
  }
});

module.exports = router; 