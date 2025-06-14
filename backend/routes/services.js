const express = require("express");
const Service = require("../models/Service");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Obtener todos los servicios con filtros
router.get("/", authenticateToken, async (req, res) => {
  try {
    const {
      category,
      provider,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      status, // opcional: para filtrar desde el frontend
    } = req.query;

    let filters = {};

    // Solo usuarios normales ven activos, admin ve todos
    if (!req.user || req.user.role !== "admin") {
      filters.isActive = true;
    } else if (status === "active") {
      filters.isActive = true;
    } else if (status === "inactive") {
      filters.isActive = false;
    }

    // Filtro por categoría
    if (category) {
      filters.category = category;
    }

    // Filtro por proveedor
    if (provider) {
      filters.provider = provider;
    }

    // Filtro por búsqueda de texto
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filtro por precio
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const services = await Service.find(filters)
      .populate("category", "name icon color")
      .populate("provider", "name avatar")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Service.countDocuments(filters);

    res.json({
      services,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  } catch (error) {
    console.error("Error obteniendo servicios:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

// Obtener servicio por ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category", "name icon color")
      .populate("provider", "name avatar phone");

    if (!service || !service.isActive) {
      return res.status(404).json({
        message: "Servicio no encontrado",
      });
    }

    res.json({ service });
  } catch (error) {
    console.error("Error obteniendo servicio:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

// Crear nuevo servicio (solo proveedores)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("provider"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        price,
        duration,
        images,
        features,
        availability,
      } = req.body;

      const service = new Service({
        title,
        description,
        category,
        price,
        duration,
        images,
        features,
        availability,
        provider: req.user._id,
      });

      await service.save();

      // Populate para la respuesta
      const populatedService = await Service.findById(service._id)
        .populate("category", "name icon color")
        .populate("provider", "name avatar");

      res.status(201).json({
        message: "Servicio creado exitosamente",
        service: populatedService,
      });
    } catch (error) {
      console.error("Error creando servicio:", error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  },
);

// Actualizar servicio (solo el proveedor propietario)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("provider"),
  async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(404).json({
          message: "Servicio no encontrado",
        });
      }

      // Verificar que el usuario sea el propietario del servicio
      if (service.provider.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "No tienes permisos para modificar este servicio",
        });
      }

      const {
        title,
        description,
        category,
        price,
        duration,
        images,
        features,
        availability,
        isActive,
      } = req.body;

      // Actualizar campos
      if (title) service.title = title;
      if (description) service.description = description;
      if (category) service.category = category;
      if (price) service.price = price;
      if (duration) service.duration = duration;
      if (images) service.images = images;
      if (features) service.features = features;
      if (availability) service.availability = availability;
      if (isActive !== undefined) service.isActive = isActive;

      await service.save();

      // Populate para la respuesta
      const populatedService = await Service.findById(service._id)
        .populate("category", "name icon color")
        .populate("provider", "name avatar");

      res.json({
        message: "Servicio actualizado exitosamente",
        service: populatedService,
      });
    } catch (error) {
      console.error("Error actualizando servicio:", error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  },
);

// Eliminar servicio (solo el proveedor propietario)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("provider"),
  async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(404).json({
          message: "Servicio no encontrado",
        });
      }

      // Verificar que el usuario sea el propietario del servicio
      if (service.provider.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "No tienes permisos para eliminar este servicio",
        });
      }

      // Soft delete
      service.isActive = false;
      await service.save();

      res.json({
        message: "Servicio eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error eliminando servicio:", error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  },
);

// Obtener servicios de un proveedor específico
router.get("/provider/:providerId", async (req, res) => {
  try {
    const services = await Service.find({
      provider: req.params.providerId,
      isActive: true,
    })
      .populate("category", "name icon color")
      .sort({ createdAt: -1 });

    res.json({
      services,
      total: services.length,
    });
  } catch (error) {
    console.error("Error obteniendo servicios del proveedor:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

// Eliminar (soft delete) como admin
router.patch(
  "/:id/admin-delete",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { reason } = req.body;
      const service = await Service.findById(req.params.id);
      if (!service)
        return res.status(404).json({ message: "Servicio no encontrado" });

      service.isActive = false;
      service.adminDeleted = true;
      service.adminDeleteReason = reason || "";
      service.adminDeletedAt = new Date();
      await service.save();

      res.json({ message: "Servicio eliminado por admin", service });
    } catch (error) {
      console.error("Error admin eliminando servicio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
);

// Restaurar como admin
router.patch(
  "/:id/admin-restore",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service)
        return res.status(404).json({ message: "Servicio no encontrado" });

      service.isActive = true;
      service.adminDeleted = false;
      service.adminDeleteReason = "";
      service.adminRestoredAt = new Date();
      await service.save();

      res.json({ message: "Servicio restaurado por admin", service });
    } catch (error) {
      console.error("Error admin restaurando servicio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
);

module.exports = router;
