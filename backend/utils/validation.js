const Joi = require('joi');

// Esquema de validación para registro
const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede tener más de 50 caracteres',
      'any.required': 'El nombre es requerido'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    }),
  
  role: Joi.string()
    .valid('user', 'provider')
    .default('user')
    .messages({
      'any.only': 'El rol debe ser user o provider'
    })
});

// Esquema de validación para login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña es requerida'
    })
});

// Esquema para actualizar perfil
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[+]?[0-9\s\-$$$$]+$/),
  location: Joi.object({
    address: Joi.string().max(200),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90),
      lng: Joi.number().min(-180).max(180)
    })
  }),
  settings: Joi.object({
    notifications: Joi.boolean(),
    location: Joi.boolean()
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema
};