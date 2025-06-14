const mongoose = require("mongoose");
const HealthFacility = require("../models/HealthFacility");

const facilities = [
  {
    name: "Hospital Viedma",
    type: "hospital",
    address: "Av. Aniceto Arce N° 100",
    city: "Cochabamba",
    location: { lat: -17.3895, lng: -66.1568 },
    contact: { phone: "4444444" },
    openingHours: "24h",
    services: ["Emergencias", "Cirugía", "Pediatría"],
  },
  {
    name: "Clínica Los Ángeles",
    type: "clinic",
    address: "C. Sucre N° 200",
    city: "Cochabamba",
    location: { lat: -17.3932, lng: -66.1571 },
    contact: { phone: "4455555" },
    openingHours: "24h",
    services: ["Consulta general", "Laboratorio"],
  },
  {
    name: "Farmacia Bolivia",
    type: "pharmacy",
    address: "Av. Ayacucho N° 300",
    city: "Cochabamba",
    location: { lat: -17.391, lng: -66.155 },
    contact: { phone: "4466666" },
    openingHours: "8:00-22:00",
    services: ["Medicamentos", "Vacunas"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await HealthFacility.deleteMany({});
  await HealthFacility.insertMany(facilities);
  console.log("Seed de establecimientos de salud completado");
  process.exit();
}

seed();
