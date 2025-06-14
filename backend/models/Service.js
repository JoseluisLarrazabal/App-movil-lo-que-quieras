const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      maxlength: [100, "El título no puede tener más de 100 caracteres"],
    },
    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      maxlength: [500, "La descripción no puede tener más de 500 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0, "El precio no puede ser negativo"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es requerida"],
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El proveedor es requerido"],
    },
    images: [
      {
        type: String,
        default: [
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
        ],
      },
    ],

    // Detalles del servicio
    duration: {
      type: String,
      default: "2-3 horas",
    },
    includesMaterials: {
      type: Boolean,
      default: false,
    },

    // Ubicación donde se presta el servicio
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
      serviceArea: {
        type: Number, // Radio en km
        default: 10,
      },
    },

    // Métricas
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    bookingsCount: {
      type: Number,
      default: 0,
    },
    completedBookings: {
      type: Number,
      default: 0,
    },

    // Control
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    // Auditoría de acciones admin
    adminDeleted: {
      type: Boolean,
      default: false,
    },
    adminDeleteReason: {
      type: String,
      default: "",
    },
    adminDeletedAt: {
      type: Date,
    },
    adminRestoredAt: {
      type: Date,
    },

    // Tags para búsqueda
    tags: [String],

    // Configuración
    availability: {
      days: [String],
      hours: {
        start: String,
        end: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Índices
serviceSchema.index({ title: "text", description: "text", tags: "text" });
serviceSchema.index({ category: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Service", serviceSchema);
