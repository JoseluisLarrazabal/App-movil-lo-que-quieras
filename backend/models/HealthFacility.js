const mongoose = require("mongoose");

const HealthFacilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "hospital",
        "clinic",
        "pharmacy",
        "laboratory",
        "dentist",
        "other",
      ],
      required: true,
    },
    address: { type: String, required: true },
    city: { type: String, required: true, default: "Cochabamba" },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    openingHours: String,
    services: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HealthFacility", HealthFacilitySchema);
