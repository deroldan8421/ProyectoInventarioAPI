const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    'string.base': 'El nombre del producto debe ser un texto.',
    'string.empty': 'El nombre del producto no puede estar vacío.',
    'string.min': 'El nombre del producto debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre del producto no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre del producto es requerido.'
  }),
  batchNumber: Joi.string().trim().required().messages({
    'string.empty': 'El número de lote no puede estar vacío.',
    'any.required': 'El número de lote es requerido.'
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'El precio debe ser un número.',
    'number.positive': 'El precio debe ser un número positivo.',
    'number.precision': 'El precio solo puede tener dos decimales.',
    'any.required': 'El precio es requerido.'
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': 'La cantidad debe ser un número.',
    'number.integer': 'La cantidad debe ser un número entero.',
    'number.min': 'La cantidad no puede ser menor a cero.',
    'any.required': 'La cantidad es requerida.'
  })
});

// Middleware de validación para crear y actualizar un producto
exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};