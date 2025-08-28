const Joi = require('joi');

const purchaseItemSchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del producto debe ser un número.',
    'number.integer': 'El ID del producto debe ser un número entero.',
    'number.positive': 'El ID del producto debe ser un número positivo.',
    'any.required': 'El ID del producto es requerido.'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'La cantidad debe ser un número.',
    'number.integer': 'La cantidad debe ser un número entero.',
    'number.min': 'La cantidad no puede ser menor a 1.',
    'any.required': 'La cantidad es requerida.'
  })
});

const purchaseSchema = Joi.object({
  items: Joi.array().items(purchaseItemSchema).min(1).required().messages({
    'array.base': 'Los productos deben ser un array.',
    'array.min': 'La compra debe contener al menos un producto.',
    'any.required': 'Los productos a comprar son requeridos.'
  })
});

exports.validatePurchase = (req, res, next) => {
  const { error } = purchaseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};