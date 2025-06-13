// routes/professionals.js
const express = require('express');
const Professional = require('../models/Professionals');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Verificar que el modelo se importó correctamente
console.log('Professional model loaded:', Professional ? 'YES' : 'NO');

const router = express.Router();

// Buscar profesionales
router.get('/search', async (req, res) => {
  try {
    const {
      profession,
      skills,
      location,
      lat,
      lng,
      radius = 50,
      availability,
      minRating,
      maxRate,
      page = 1,
      limit = 10
    } = req.query;

    const filters = { isActive: true };
    
    // Filtro por profesión
    if (profession) {
      filters.profession = { $regex: profession, $options: 'i' };
    }
    
    // Filtro por skills
    if (skills) {
      filters.skills = { $in: skills.split(',') };
    }
    
    // Filtro por ubicación
    if (lat && lng) {
      filters['workLocation.coordinates'] = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) * 1000
        }
      };
    }
    
    // Otros filtros...
    if (availability) filters['availability.type'] = availability;
    if (minRating) filters.rating = { $gte: Number(minRating) };

    const professionals = await Professional.find(filters)
      .populate('user', 'name avatar')
      .sort({ rating: -1, projectsCompleted: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Professional.countDocuments(filters);

    res.json({
      professionals,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener perfil profesional
router.get('/:id', async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id)
      .populate('user', 'name avatar email location');

    if (!professional || !professional.isActive) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    res.json({ professional });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Crear/actualizar perfil profesional
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Creating professional profile for user:', req.user._id);
    console.log('Request body:', req.body);
    
    const existingProfile = await Professional.findOne({ user: req.user._id });
    
    if (existingProfile) {
      console.log('Updating existing profile');
      // Excluir el campo user del request body para evitar conflictos
      const { user, ...updateData } = req.body;
      Object.assign(existingProfile, updateData);
      await existingProfile.save();
      res.json({ professional: existingProfile });
    } else {
      console.log('Creating new profile');
      // Excluir el campo user del request body y usar req.user._id
      const { user, ...profileData } = req.body;
      const professional = new Professional({
        ...profileData,
        user: req.user._id
      });
      console.log('Professional object to save:', professional);
      await professional.save();
      res.status(201).json({ professional });
    }
  } catch (error) {
    console.error('Error creating professional profile:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Si es un error de validación, devolver detalles específicos
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Error de validación',
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;