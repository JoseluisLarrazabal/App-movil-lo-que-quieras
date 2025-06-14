const express = require("express");
const router = express.Router();
const HealthFacility = require("../models/HealthFacility");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// Listar establecimientos con filtros
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { type, city, search } = req.query;
    let filters = { isActive: true };
    if (type) filters.type = type;
    if (city) filters.city = city;
    if (search) filters.name = { $regex: search, $options: "i" };
    const facilities = await HealthFacility.find(filters);
    res.json({ facilities });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error al obtener establecimientos",
        error: err.message,
      });
  }
});

// Detalle de establecimiento
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const facility = await HealthFacility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: "No encontrado" });
    res.json({ facility });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener detalle", error: err.message });
  }
});

// Crear establecimiento (solo admin)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const facility = new HealthFacility(req.body);
      await facility.save();
      res.status(201).json({ facility });
    } catch (err) {
      res.status(400).json({ message: "Error al crear", error: err.message });
    }
  },
);

// Editar establecimiento (solo admin)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const facility = await HealthFacility.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!facility) return res.status(404).json({ message: "No encontrado" });
      res.json({ facility });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error al actualizar", error: err.message });
    }
  },
);

// Eliminar establecimiento (solo admin)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const facility = await HealthFacility.findByIdAndDelete(req.params.id);
      if (!facility) return res.status(404).json({ message: "No encontrado" });
      res.json({ message: "Eliminado" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error al eliminar", error: err.message });
    }
  },
);

module.exports = router;
