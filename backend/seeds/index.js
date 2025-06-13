const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const { seedCategories } = require('./categories');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🚀 Iniciando proceso de seeding...');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');

    // Sembrar categorías
    await seedCategories();
    
    console.log('🎉 Proceso de seeding completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en el proceso de seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedData();
}

module.exports = { seedData };     