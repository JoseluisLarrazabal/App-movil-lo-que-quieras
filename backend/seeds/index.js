const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const { seedCategories } = require('./categories');
const bcrypt = require('bcryptjs');
const HealthFacility = require('../models/HealthFacility');
const Professional = require('../models/Professionals');
const { seedLocalStores } = require('./localStores');
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

const healthFacilities = [
  // Cochabamba
  {
    name: 'Hospital Viedma',
    type: 'hospital',
    address: 'Av. Aniceto Arce N° 100',
    city: 'Cochabamba',
    location: { lat: -17.3895, lng: -66.1568 },
    contact: { phone: '4444444' },
    openingHours: '24h',
    services: ['Emergencias', 'Cirugía', 'Pediatría']
  },
  {
    name: 'Clínica Los Ángeles',
    type: 'clinic',
    address: 'C. Sucre N° 200',
    city: 'Cochabamba',
    location: { lat: -17.3932, lng: -66.1571 },
    contact: { phone: '4455555' },
    openingHours: '24h',
    services: ['Consulta general', 'Laboratorio']
  },
  {
    name: 'Farmacia Bolivia',
    type: 'pharmacy',
    address: 'Av. Ayacucho N° 300',
    city: 'Cochabamba',
    location: { lat: -17.3910, lng: -66.1550 },
    contact: { phone: '4466666' },
    openingHours: '8:00-22:00',
    services: ['Medicamentos', 'Vacunas']
  },
  // La Paz
  {
    name: 'Hospital Obrero N°1',
    type: 'hospital',
    address: 'Av. 6 de Agosto N° 2577',
    city: 'La Paz',
    location: { lat: -16.5091, lng: -68.1193 },
    contact: { phone: '2222333' },
    openingHours: '24h',
    services: ['Emergencias', 'Traumatología', 'Cardiología']
  },
  {
    name: 'Farmacia Chávez',
    type: 'pharmacy',
    address: 'Av. 16 de Julio N° 1234',
    city: 'La Paz',
    location: { lat: -16.5005, lng: -68.1301 },
    contact: { phone: '2244555' },
    openingHours: '7:00-23:00',
    services: ['Medicamentos', 'Dermocosmética']
  },
  // Santa Cruz
  {
    name: 'Clínica Foianini',
    type: 'clinic',
    address: 'Av. Irala N° 468',
    city: 'Santa Cruz',
    location: { lat: -17.7863, lng: -63.1812 },
    contact: { phone: '3333222' },
    openingHours: '24h',
    services: ['Consulta general', 'Emergencias', 'Laboratorio']
  },
  // Buenos Aires
  {
    name: 'Hospital Italiano',
    type: 'hospital',
    address: 'Perón 4190',
    city: 'Buenos Aires',
    location: { lat: -34.6103, lng: -58.4108 },
    contact: { phone: '+54 11 4959-0200' },
    openingHours: '24h',
    services: ['Emergencias', 'Cirugía', 'Pediatría', 'Oncología']
  },
  {
    name: 'Farmacity Palermo',
    type: 'pharmacy',
    address: 'Av. Santa Fe 3253',
    city: 'Buenos Aires',
    location: { lat: -34.5875, lng: -58.4206 },
    contact: { phone: '+54 11 4821-1111' },
    openingHours: '8:00-22:00',
    services: ['Medicamentos', 'Perfumería']
  },
  // Ejemplo laboratorio/dentista
  {
    name: 'Laboratorio Lister',
    type: 'laboratory',
    address: 'Av. América N° 123',
    city: 'Cochabamba',
    location: { lat: -17.3840, lng: -66.1530 },
    contact: { phone: '4477888' },
    openingHours: '7:00-19:00',
    services: ['Análisis clínicos', 'Pruebas COVID']
  },
  {
    name: 'Dentista Sonrisa Feliz',
    type: 'dentist',
    address: 'C. Aroma N° 456',
    city: 'Santa Cruz',
    location: { lat: -17.7820, lng: -63.1800 },
    contact: { phone: '3344556' },
    openingHours: '9:00-18:00',
    services: ['Odontología general', 'Ortodoncia']
  }
];

// NUEVO: Seed de profesionales
const professionalSeeds = async (providers) => {
  // Borra todos los profesionales existentes
  await Professional.deleteMany({});

  // Crea un perfil profesional para cada provider de ejemplo
  const professionals = [
    {
      user: providers[0]._id,
      profession: 'Electricista',
      specialties: ['Instalaciones eléctricas', 'Reparaciones'],
      experience: { years: 5, description: 'Experiencia en instalaciones residenciales y comerciales.' },
      certifications: [],
      education: [],
      availability: { type: 'full-time', remote: false },
      workLocation: { city: 'Buenos Aires', address: 'CABA', radius: 30 },
      contactInfo: { phone: '+54 11 1234-5678', whatsapp: '+54 11 1234-5678', email: providers[0].email },
      portfolio: [],
      rates: { hourly: 1500, daily: 10000, currency: 'ARS' },
      skills: ['Electricidad', 'Mantenimiento'],
      tools: ['Tester', 'Pinza'],
      rating: 4.7,
      reviewsCount: 12,
      projectsCompleted: 30,
      responseTime: '< 2 horas',
      isActive: true,
      isPremium: false,
      verified: true
    },
    {
      user: providers[1]._id,
      profession: 'Plomero',
      specialties: ['Reparación de cañerías', 'Instalación de sanitarios'],
      experience: { years: 8, description: 'Plomería general y de emergencia.' },
      certifications: [],
      education: [],
      availability: { type: 'freelance', remote: false },
      workLocation: { city: 'Buenos Aires', address: 'CABA', radius: 20 },
      contactInfo: { phone: '+54 11 9876-5432', whatsapp: '+54 11 9876-5432', email: providers[1].email },
      portfolio: [],
      rates: { hourly: 1800, daily: 12000, currency: 'ARS' },
      skills: ['Plomería', 'Emergencias'],
      tools: ['Llave inglesa', 'Soplete'],
      rating: 4.9,
      reviewsCount: 20,
      projectsCompleted: 50,
      responseTime: '< 1 hora',
      isActive: true,
      isPremium: false,
      verified: true
    }
  ];
  const createdProfessionals = await Professional.insertMany(professionals);
  console.log(`✅ ${createdProfessionals.length} perfiles profesionales creados exitosamente`);
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

    // Sembrar perfiles profesionales
    await professionalSeeds(createdProviders);

    // Sembrar servicios
    await serviceSeeds(categories, createdProviders);

    // Sembrar establecimientos de salud
    await HealthFacility.deleteMany({});
    await HealthFacility.insertMany(healthFacilities);
    console.log(`✅ ${healthFacilities.length} establecimientos de salud creados exitosamente`);

    // Sembrar comercios locales y supermercados
    await seedLocalStores();
    console.log('✅ Comercios locales y supermercados sembrados exitosamente');

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