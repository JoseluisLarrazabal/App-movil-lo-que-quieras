const Category = require('../models/Category');

const categories = [
  {
    name: 'Limpieza',
    description: 'Servicios de limpieza para hogar y oficina',
    icon: 'broom',
    color: '#10B981',
    isActive: true
  },
  {
    name: 'Plomería',
    description: 'Servicios de plomería y fontanería',
    icon: 'wrench',
    color: '#3B82F6',
    isActive: true
  },
  {
    name: 'Electricidad',
    description: 'Servicios eléctricos e instalaciones',
    icon: 'lightning-bolt',
    color: '#F59E0B',
    isActive: true
  },
  {
    name: 'Albañilería',
    description: 'Construcción y reparaciones',
    icon: 'hammer',
    color: '#8B5CF6',
    isActive: true
  },
  {
    name: 'Jardinería',
    description: 'Mantenimiento de jardines y áreas verdes',
    icon: 'tree',
    color: '#059669',
    isActive: true
  },
  {
    name: 'Pintura',
    description: 'Servicios de pintura y decoración',
    icon: 'brush',
    color: '#EF4444',
    isActive: true
  },
  {
    name: 'Mecánica',
    description: 'Servicios de mecánica automotriz',
    icon: 'car',
    color: '#6B7280',
    isActive: true
  },
  {
    name: 'Tecnología',
    description: 'Servicios de informática y tecnología',
    icon: 'laptop',
    color: '#6366F1',
    isActive: true
  },
  {
    name: 'Salud',
    description: 'Servicios de salud y bienestar',
    icon: 'heart',
    color: '#EC4899',
    isActive: true
  },
  {
    name: 'Educación',
    description: 'Servicios educativos y tutorías',
    icon: 'school',
    color: '#8B5A2B',
    isActive: true
  }
];

const seedCategories = async () => {
  try {
    console.log('🌱 Sembrando categorías...');
    
    // Limpiar categorías existentes
    await Category.deleteMany({});
    
    // Insertar nuevas categorías
    const createdCategories = await Category.insertMany(categories);
    
    console.log(`✅ ${createdCategories.length} categorías creadas exitosamente`);
    return createdCategories;
  } catch (error) {
    console.error('❌ Error sembrando categorías:', error);
    throw error;
  }
};

module.exports = { seedCategories }; 