const { Product } = require('../models');
const logger = require('../config/logger');
// Crear un nuevo producto (solo Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    logger.info(`Nuevo producto creado por admin (${req.user.id}): ${newProduct.name}`);
    res.status(201).json(newProduct);
  } catch (error) {
    logger.error(`Error al crear producto: ${error.message}`);
    next(error);
  }
};

// Obtener todos los productos (público)
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    logger.info('Solicitud exitosa para obtener todos los productos.');
    res.status(200).json(products);
  } catch (error) {
    logger.error(`Error al obtener productos: ${error.message}`);
    next(error);
  }
};

// Obtener un solo producto por ID (público)
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      logger.warn(`Intento de obtener producto fallido. ID: ${req.params.id}. Producto no encontrado.`);
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    logger.info(`Solicitud exitosa para obtener producto. ID: ${req.params.id}`);
    res.status(200).json(product);
  } catch (error) {
    logger.error(`Error al obtener producto. ID: ${req.params.id}. Error: ${error.message}`);
    next(error);
  }
};

// Actualizar un producto por ID (solo Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      logger.info(`Producto actualizado por admin (${req.user.id}). ID: ${req.params.id}`);
      return res.status(200).json(updatedProduct);
    }
    logger.warn(`Intento de actualización de producto fallido. ID: ${req.params.id}. Producto no encontrado.`);
    next(error);
  } catch (error) {
    logger.error(`Error al actualizar producto. ID: ${req.params.id}. Error: ${error.message}`);
    next(error);
  }
};

// Eliminar un producto por ID (solo Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      logger.info(`Producto eliminado por admin (${req.user.id}). ID: ${req.params.id}`);
      return res.status(204).json({ message: 'Producto eliminado' });
    }
    logger.warn(`Intento de eliminación de producto fallido. ID: ${req.params.id}. Producto no encontrado.`);
    next(error);
  } catch (error) {
    logger.error(`Error al eliminar producto. ID: ${req.params.id}. Error: ${error.message}`);
    next(error);
  }
};