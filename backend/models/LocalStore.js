const mongoose = require('mongoose');

const localStoreSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['barrio', 'supermercado', 'minimarket', 'mercado', 'otro'], required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  contact: {
    phone: String,
    whatsapp: String,
    website: String
  },
  openingHours: String,
  services: [String],
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  images: [String],
  description: String
}, { timestamps: true });

module.exports = mongoose.model('LocalStore', localStoreSchema); 