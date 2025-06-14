const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const { seedCategories } = require('./categories');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// NUEVO: Seed de usuarios providers
const providerUsers = [
  {
    name: 'María García',
    email: 'provider1@test.com',
    password: bcrypt.hashSync('test1234', 10),
    role: 'provider',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isActive: true
  },
  {
    name: 'Juan Pérez',
    email: 'provider2@test.com',
    password: bcrypt.hashSync('test1234', 10),
    role: 'provider',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isActive: true
  }
];

// NUEVO: Seed de servicios
const serviceSeeds = async (categories, providers) => {
  const services = [
    {
      title: 'Limpieza profunda de hogar',
      description: 'Servicio completo de limpieza para tu hogar, incluye todas las habitaciones, baños y cocina.',
      price: 850,
      category: categories.find(c => c.name === 'Limpieza')._id,
      provider: providers[0]._id,
      images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'],
      duration: '2-3 horas',
      includesMaterials: false,
      location: { address: 'Buenos Aires, Argentina', serviceArea: 10 },
      rating: 4.8,
      reviewsCount: 23,
      bookingsCount: 45,
      completedBookings: 0,
      isActive: true,
      featured: false,
      tags: [],
      availability: { days: [] }
    },
    {
      title: 'Reparación de tuberías',
      description: 'Solución rápida y eficiente para problemas de plomería en tu hogar.',
      price: 1200,
      category: categories.find(c => c.name === 'Plomería')._id,
      provider: providers[0]._id,
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'],
      duration: '2-3 horas',
      includesMaterials: false,
      location: { address: 'Buenos Aires, Argentina', serviceArea: 10 },
      rating: 4.6,
      reviewsCount: 18,
      bookingsCount: 0,
      completedBookings: 0,
      isActive: true,
      featured: false,
      tags: [],
      availability: { days: [] }
    },
    {
      title: 'Instalación eléctrica básica',
      description: 'Instalación y revisión de cableado eléctrico en el hogar.',
      price: 1500,
      category: categories.find(c => c.name === 'Electricidad')._id,
      provider: providers[1]._id,
      images: ['https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400'],
      duration: '1-2 horas',
      includesMaterials: true,
      location: { address: 'Buenos Aires, Argentina', serviceArea: 10 },
      rating: 4.9,
      reviewsCount: 12,
      bookingsCount: 5,
      completedBookings: 0,
      isActive: true,
      featured: false,
      tags: [],
      availability: { days: [] }
    }
  ];
  await Service.deleteMany({});
  const createdServices = await Service.insertMany(services);
  console.log(`✅ ${createdServices.length} servicios creados exitosamente`);
};

const seedData = async () => {
  try {
    console.log('🚀 Iniciando proceso de seeding...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');

    // Sembrar categorías
    const categories = await seedCategories();

    // Sembrar providers
    await User.deleteMany({ role: 'provider' });
    const createdProviders = await User.insertMany(providerUsers);
    console.log(`✅ ${createdProviders.length} proveedores creados exitosamente`);

    // Sembrar servicios
    await serviceSeeds(categories, createdProviders);

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