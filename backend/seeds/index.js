const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seeds...');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    console.log('🧹 Datos existentes limpiados');

    // Crear usuarios de prueba
    const users = [
      {
        name: 'Usuario Test',
        email: 'user@test.com',
        password: '123456',
        role: 'user',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        userStats: {
          totalBookings: 5,
          totalSpent: 2500,
          averageRating: 4.5
        }
      },
      {
        name: 'María García',
        email: 'provider@test.com',
        password: '123456',
        role: 'provider',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        providerInfo: {
          description: 'Profesional en servicios de limpieza con más de 5 años de experiencia.',
          services: ['Limpieza general', 'Limpieza profunda'],
          rating: 4.9,
          reviewsCount: 127,
          completedJobs: 89,
          verified: true,
          gallery: [
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
          ]
        }
      },
      {
        name: 'Administrador',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    ];

    const createdUsers = await User.create(users);
    console.log('👥 Usuarios creados:', createdUsers.length);

    // Crear categorías
    const categories = [
      { name: 'Limpieza', icon: '🧹', color: '#E3F2FD', serviceCount: 12 },
      { name: 'Plomería', icon: '🔧', color: '#F3E5F5', serviceCount: 8 },
      { name: 'Electricidad', icon: '⚡', color: '#E8F5E8', serviceCount: 6 },
      { name: 'Jardinería', icon: '🌱', color: '#FFF3E0', serviceCount: 4 },
      { name: 'Pintura', icon: '🎨', color: '#FCE4EC', serviceCount: 7 },
      { name: 'Carpintería', icon: '🔨', color: '#F1F8E9', serviceCount: 5 }
    ];

    const createdCategories = await Category.create(categories);
    console.log('🏷️ Categorías creadas:', createdCategories.length);

    // Encontrar el proveedor para crear servicios
    const provider = createdUsers.find(user => user.role === 'provider');

    // Crear servicios
    const services = [
      {
        title: 'Limpieza profunda de hogar',
        description: 'Servicio completo de limpieza para tu hogar, incluye todas las habitaciones, baños y cocina.',
        price: 850,
        category: createdCategories[0]._id, // Limpieza
        provider: provider._id,
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'],
        rating: 4.8,
        reviewsCount: 23,
        bookingsCount: 45
      },
      {
        title: 'Reparación de tuberías',
        description: 'Solución rápida y eficiente para problemas de plomería en tu hogar.',
        price: 1200,
        category: createdCategories[1]._id, // Plomería
        provider: provider._id,
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'],
        rating: 4.6,
        reviewsCount: 18
      }
    ];

    const createdServices = await Service.create(services);
    console.log('🛠️ Servicios creados:', createdServices.length);

    console.log('🎉 Seeds completados exitosamente!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('Usuario: user@test.com / 123456');
    console.log('Proveedor: provider@test.com / 123456');
    console.log('Admin: admin@test.com / 123456');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error en seeds:', error);
    process.exit(1);
  }
};

seedData();     