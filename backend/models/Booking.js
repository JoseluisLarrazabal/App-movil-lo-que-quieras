const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'El servicio es requerido']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El proveedor es requerido']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido']
  },
  
  // Programación
  scheduledDate: {
    type: Date,
    required: [true, 'La fecha es requerida']
  },
  scheduledTime: {
    type: String,
    required: [true, 'La hora es requerida']
  },
  
  // Estado del servicio
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  
  // Información financiera
  price: {
    type: Number,
    required: [true, 'El precio es requerido']
  },
  commission: {
    type: Number,
    default: 0 // Comisión de la plataforma
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer'],
    default: 'cash'
  },
  
  // Detalles adicionales
  notes: {
    type: String,
    maxlength: [500, 'Las notas no pueden tener más de 500 caracteres']
  },
  address: {
    street: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Fechas importantes
  confirmedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  
  // Calificación y review
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [300, 'El comentario no puede tener más de 300 caracteres']
    },
    createdAt: Date
  },
  
  // Historial de cambios de estado
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    reason: String
  }]
}, {
  timestamps: true
});

// Índices
bookingSchema.index({ service: 1 });
bookingSchema.index({ provider: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ createdAt: -1 });

// Middleware para actualizar historial de estado
bookingSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);