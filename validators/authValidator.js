const Joi = require('joi');

// Esquema de validación para el registro de usuarios
const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    'string.base': 'El nombre de usuario debe ser un texto.',
    'string.empty': 'El nombre de usuario no puede estar vacío.',
    'string.min': 'El nombre de usuario debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre de usuario no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre de usuario es requerido.'
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'La contraseña debe ser un texto.',
    'string.empty': 'La contraseña no puede estar vacía.',
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres.',
    'any.required': 'La contraseña es requerida.'
  }),
  role: Joi.string().valid('admin', 'client').default('client').messages({
    'any.only': 'El rol debe ser "admin" o "client".'
  })
});

// Middleware de validación para el registro
exports.validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Esquema de validación para el login de usuarios
const loginSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  password: Joi.string().min(8).required()
});

// Middleware de validación para el login
exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};