const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    unique: true,
    trim: true,
    maxlength: [30, 'El nombre no puede tener más de 30 caracteres']
  },
  icon: {
    type: String,
    required: [true, 'El icono es requerido']
  },
  color: {
    type: String,
    required: [true, 'El color es requerido'],
    match: [/^#[0-9A-F]{6}$/i, 'Color debe ser hexadecimal válido']
  },
  serviceCount: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    maxlength: [200, 'La descripción no puede tener más de 200 caracteres']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ featured: 1 });

module.exports = mongoose.model('Category', categorySchema);