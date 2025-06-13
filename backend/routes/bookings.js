const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Obtener reservas del usuario autenticado
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service', 'title price images')
      .populate('provider', 'name avatar phone')
      .sort({ createdAt: -1 });

    res.json({
      bookings,
      total: bookings.length
    });
  } catch (error) {
    console.error('Error obteniendo reservas del usuario:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener reservas del proveedor autenticado
router.get('/provider-bookings', authenticateToken, authorizeRoles(['provider']), async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate('service', 'title price images')
      .populate('user', 'name avatar phone')
      .sort({ createdAt: -1 });

    res.json({
      bookings,
      total: bookings.length
    });
  } catch (error) {
    console.error('Error obteniendo reservas del proveedor:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Obtener reserva por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'title price images description')
      .populate('provider', 'name avatar phone')
      .populate('user', 'name avatar phone');

    if (!booking) {
      return res.status(404).json({
        message: 'Reserva no encontrada'
      });
    }

    // Verificar que el usuario tenga acceso a esta reserva
    if (booking.user._id.toString() !== req.user._id.toString() && 
        booking.provider._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'No tienes permisos para ver esta reserva'
      });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error obteniendo reserva:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Crear nueva reserva
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      serviceId,
      scheduledDate,
      scheduledTime,
      notes,
      address
    } = req.body;

    console.log('📥 Recibiendo datos para nueva reserva:', req.body);

    // Convertir scheduledDate a Date object para asegurar compatibilidad con el esquema
    const parsedScheduledDate = new Date(scheduledDate);
    if (isNaN(parsedScheduledDate.getTime())) {
      return res.status(400).json({
        message: 'Formato de fecha inválido'
      });
    }

    // Verificar que el servicio existe y está activo
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({
        message: 'Servicio no encontrado o no disponible'
      });
    }

    // Verificar que el usuario no está reservando su propio servicio
    if (service.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: 'No puedes reservar tu propio servicio'
      });
    }

    // Verificar disponibilidad (aquí podrías agregar lógica más compleja)
    const existingBooking = await Booking.findOne({
      service: serviceId,
      scheduledDate: parsedScheduledDate, // Usar la fecha parseada
      scheduledTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(409).json({
        message: 'El horario seleccionado no está disponible'
      });
    }

    const booking = new Booking({
      service: serviceId,
      provider: service.provider,
      user: req.user._id,
      scheduledDate: parsedScheduledDate, // Usar la fecha parseada
      scheduledTime,
      price: service.price,
      notes,
      address // address podría ser undefined si el frontend no lo envía, lo cual está bien si no es required en el schema
    });

    await booking.save();

    // Populate para la respuesta
    const populatedBooking = await Booking.findById(booking._id)
      .populate('service', 'title price images')
      .populate('provider', 'name avatar phone')
      .populate('user', 'name avatar phone');

    res.status(201).json({
      message: 'Reserva creada exitosamente',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Error de validación',
        errors: errors
      });
    }
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar estado de reserva (solo proveedor o admin)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        message: 'Reserva no encontrada'
      });
    }

    // Verificar permisos
    const isProvider = booking.provider.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isProvider && !isAdmin) {
      return res.status(403).json({
        message: 'No tienes permisos para modificar esta reserva'
      });
    }

    // Validar cambio de estado
    const validTransitions = {
      pending: ['confirmed', 'rejected', 'cancelled'],
      confirmed: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
      rejected: []
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        message: `No se puede cambiar el estado de '${booking.status}' a '${status}'`
      });
    }

    booking.status = status;
    if (reason) {
      booking.statusHistory.push({
        status,
        reason,
        timestamp: new Date()
      });
    }

    // Actualizar fechas específicas según el estado
    if (status === 'confirmed') {
      booking.confirmedAt = new Date();
    } else if (status === 'in_progress') {
      booking.startedAt = new Date();
    } else if (status === 'completed') {
      booking.completedAt = new Date();
    } else if (status === 'cancelled') {
      booking.cancelledAt = new Date();
    }

    await booking.save();

    // Populate para la respuesta
    const populatedBooking = await Booking.findById(booking._id)
      .populate('service', 'title price images')
      .populate('provider', 'name avatar phone')
      .populate('user', 'name avatar phone');

    res.json({
      message: 'Estado de reserva actualizado',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Error actualizando estado de reserva:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Agregar review a una reserva completada
router.post('/:id/review', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        message: 'Reserva no encontrada'
      });
    }

    // Verificar que el usuario sea el cliente de la reserva
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Solo el cliente puede agregar una reseña'
      });
    }

    // Verificar que la reserva esté completada
    if (booking.status !== 'completed') {
      return res.status(400).json({
        message: 'Solo se pueden agregar reseñas a reservas completadas'
      });
    }

    // Verificar que no haya una reseña previa
    if (booking.review && booking.review.rating) {
      return res.status(409).json({
        message: 'Ya existe una reseña para esta reserva'
      });
    }

    booking.review = {
      rating,
      comment,
      createdAt: new Date()
    };

    await booking.save();

    res.json({
      message: 'Reseña agregada exitosamente',
      booking
    });
  } catch (error) {
    console.error('Error agregando reseña:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 