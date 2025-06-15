const LocalStore = require('../models/LocalStore');

const localStores = [
  {
    name: "Supermercado Central",
    type: "supermercado",
    address: "Av. Ayacucho 123",
    city: "Cochabamba",
    location: { lat: -17.3895, lng: -66.1568 },
    contact: { phone: "4441234", whatsapp: "+59171234567", website: "https://supercentral.com" },
    openingHours: "8:00-22:00",
    services: ["delivery", "tarjeta", "ofertas"],
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"],
    description: "Supermercado con gran variedad de productos y ofertas semanales."
  },
  {
    name: "Tienda Doña Rosa",
    type: "barrio",
    address: "C. Sucre 456",
    city: "Cochabamba",
    location: { lat: -17.3901, lng: -66.1572 },
    contact: { phone: "4456789", whatsapp: "+59178945612" },
    openingHours: "7:00-21:00",
    services: ["delivery"],
    images: ["https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400"],
    description: "Tienda de barrio con atención personalizada y productos frescos."
  },
  {
    name: "Mercado La Cancha",
    type: "mercado",
    address: "Av. Barrientos s/n",
    city: "Cochabamba",
    location: { lat: -17.3930, lng: -66.1550 },
    contact: { },
    openingHours: "6:00-18:00",
    services: ["ofertas"],
    images: ["https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400"],
    description: "Mercado tradicional con variedad de productos locales."
  },
  {
    name: "MiniMarket Express",
    type: "minimarket",
    address: "Av. América 789",
    city: "Cochabamba",
    location: { lat: -17.3880, lng: -66.1540 },
    contact: { whatsapp: "+59176543210" },
    openingHours: "9:00-23:00",
    services: ["tarjeta", "envíos"],
    images: ["https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400"],
    description: "Minimarket con productos de conveniencia y pago con tarjeta."
  }
];

const seedLocalStores = async () => {
  await LocalStore.deleteMany({});
  const created = await LocalStore.insertMany(localStores);
  console.log(`✅ ${created.length} comercios locales creados exitosamente`);
  return created;
};

module.exports = { seedLocalStores }; 