// routes/professionals.js
const express = require('express');
const Professional = require('../models/Professionals');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const User = require('../models/User');

// Verificar que el modelo se importó correctamente
console.log('Professional model loaded:', Professional ? 'YES' : 'NO');

const router = express.Router();

// Middleware para verificar que el usuario es provider
const ensureProviderRole = async (req, res, next) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ 
        message: 'Solo los proveedores pueden crear perfiles profesionales' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

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
      .populate('user', 'name avatar _id')
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
      .populate('user', 'name avatar email location _id');

    if (!professional || !professional.isActive) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    res.json({ professional });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Crear/actualizar perfil profesional
router.post('/profile', authenticateToken, ensureProviderRole, async (req, res) => {
  try {
    console.log('Creating professional profile for user:', req.user._id);
    console.log('Request body:', req.body);
    
    const existingProfile = await Professional.findOne({ user: req.user._id });
    
    if (existingProfile) {
      console.log('Updating existing profile');
      // Excluir el campo user del request body para evitar conflictos
      const { user, userInfo, ...updateData } = req.body;
      Object.assign(existingProfile, updateData);
      await existingProfile.save();
      
      // Actualizar información del usuario si se proporciona
      if (userInfo && (userInfo.name || userInfo.avatar)) {
        const userUpdate = {};
        if (userInfo.name) userUpdate.name = userInfo.name;
        if (userInfo.avatar) userUpdate.avatar = userInfo.avatar;
        
        await User.findByIdAndUpdate(req.user._id, userUpdate);
      }
      
      // Populate user information before sending response
      const populatedProfile = await Professional.findById(existingProfile._id)
        .populate('user', 'name avatar email _id');
      
      res.json({ professional: populatedProfile });
    } else {
      console.log('Creating new profile');
      // Excluir el campo user del request body y usar req.user._id
      const { user, userInfo, ...profileData } = req.body;
      
      try {
        const professional = new Professional({
          ...profileData,
          user: req.user._id
        });
        console.log('Professional object to save:', professional);
        await professional.save();
        
        // Actualizar información del usuario si se proporciona
        if (userInfo && (userInfo.name || userInfo.avatar)) {
          const userUpdate = {};
          if (userInfo.name) userUpdate.name = userInfo.name;
          if (userInfo.avatar) userUpdate.avatar = userInfo.avatar;
          
          await User.findByIdAndUpdate(req.user._id, userUpdate);
        }
        
        // Populate user information before sending response
        const populatedProfessional = await Professional.findById(professional._id)
          .populate('user', 'name avatar email _id');
        
        res.status(201).json({ professional: populatedProfessional });
      } catch (e) {
        if (e.code === 11000) {
          return res.status(409).json({ 
            message: 'Ya tienes un perfil profesional creado',
            error: 'DUPLICATE_PROFILE'
          });
        }
        throw e;
      }
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