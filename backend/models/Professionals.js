// models/Professional.js
const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    
    // Información profesional
    profession: {
      type: String,
      required: [true, 'La profesión es requerida'],
      trim: true
    },
    specialties: [String], // ["Soldadura TIG", "Soldadura MIG"]
    experience: {
      years: {
        type: Number,
        required: true,
        min: 0
      },
      description: {
        type: String,
        maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres']
      }
    },
    
    // Certificaciones y estudios
    certifications: [{
      name: String,
      institution: String,
      date: Date,
      expires: Date,
      verified: {
        type: Boolean,
        default: false
      }
    }],
    
    education: [{
      title: String,
      institution: String,
      startDate: Date,
      endDate: Date,
      current: Boolean
    }],
    
    // Disponibilidad laboral
    availability: {
      type: {
        type: String,
        enum: ['full-time', 'part-time', 'freelance', 'contract'],
        required: true
      },
      schedule: {
        days: [String],
        hours: {
          start: String,
          end: String
        }
      },
      remote: {
        type: Boolean,
        default: false
      }
    },
    
    // Ubicación y movilidad
    workLocation: {
      address: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      radius: {
        type: Number, // km dispuesto a viajar
        default: 50
      }
    },
    
    // Información de contacto profesional
    contactInfo: {
      phone: {
        type: String,
        required: true
      },
      whatsapp: String,
      email: String,
      website: String,
      linkedin: String
    },
    
    // Portfolio y trabajos anteriores
    portfolio: [{
      title: String,
      description: String,
      images: [String],
      client: String,
      date: Date,
      skills: [String]
    }],
    
    // Tarifas
    rates: {
      hourly: Number,
      daily: Number,
      project: String, // "Según proyecto"
      currency: {
        type: String,
        default: 'ARS'
      }
    },
    
    // Skills y herramientas
    skills: [String],
    tools: [String], // Herramientas que maneja
    
    // Métricas
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    projectsCompleted: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: String,
      default: '< 24 horas'
    },
    
    // Control
    isActive: {
      type: Boolean,
      default: true
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
  });
  
  // Índices para búsqueda optimizada
  professionalSchema.index({ profession: 'text', specialties: 'text', skills: 'text' });
  professionalSchema.index({ 'workLocation.coordinates': '2dsphere' });
  professionalSchema.index({ rating: -1 });
  professionalSchema.index({ isActive: 1 });
  
  module.exports = mongoose.model('Professional', professionalSchema);