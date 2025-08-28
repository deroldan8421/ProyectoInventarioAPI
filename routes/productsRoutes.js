const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateProduct } = require('../validators/productValidator');

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA CREAR UN NUEVO PRODUCTO
//----------------------------------------------------------------------------------------------------
/**
 * @api {post} /api/products Crear un nuevo producto
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token de autenticación JWT.
 *
 * @apiBody {String} name Nombre del producto.
 * @apiBody {String} batchNumber Número de lote.
 * @apiBody {Number} price Precio del producto.
 * @apiBody {Number} quantity Cantidad en stock.
 *
 * @apiSuccess {Number} id ID del producto creado.
 * @apiSuccess {String} name Nombre del producto.
 * @apiSuccess {String} batchNumber Número de lote.
 * @apiSuccess {Number} price Precio del producto.
 * @apiSuccess {Number} quantity Cantidad en stock.
 *
 * @apiError (403 Forbidden) ForbiddenError Solo los administradores pueden crear productos.
 * @apiError (400 Bad Request) ValidationError Datos de entrada inválidos.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al crear el producto.
 */
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, validateProduct, productController.createProduct);

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA OBTENER TODOS LOS PRODUCTOS
//----------------------------------------------------------------------------------------------------
/**
 * @api {get} /api/products Obtener todos los productos
 * @apiName GetProducts
 * @apiGroup Products
 * @apiPermission public
 *
 * @apiSuccess {Object[]} products Lista de productos.
 * @apiSuccess {Number} products.id ID del producto.
 * @apiSuccess {String} products.name Nombre del producto.
 * @apiSuccess {String} products.batchNumber Número de lote.
 * @apiSuccess {Number} products.price Precio del producto.
 * @apiSuccess {Number} products.quantity Cantidad en stock.
 *
 * @apiError (500 Internal Server Error) ServerError Error del servidor al obtener los productos.
 */
router.get('/', productController.getProducts);

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA OBTENER UN SOLO PRODUCTO
//----------------------------------------------------------------------------------------------------
/**
 * @api {get} /api/products/:id Obtener un solo producto
 * @apiName GetProductById
 * @apiGroup Products
 * @apiPermission public
 *
 * @apiParam {Number} id ID único del producto.
 *
 * @apiSuccess {Number} id ID del producto.
 * @apiSuccess {String} name Nombre del producto.
 * @apiSuccess {String} batchNumber Número de lote.
 * @apiSuccess {Number} price Precio del producto.
 * @apiSuccess {Number} quantity Cantidad en stock.
 *
 * @apiError (404 Not Found) ProductNotFound El producto no fue encontrado.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al obtener el producto.
 */
router.get('/:id', productController.getProductById);

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA ACTUALIZAR UN PRODUCTO
//----------------------------------------------------------------------------------------------------
/**
 * @api {put} /api/products/:id Actualizar un producto
 * @apiName UpdateProduct
 * @apiGroup Products
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token de autenticación JWT.
 *
 * @apiParam {Number} id ID único del producto.
 * @apiBody {String} name Nombre del producto.
 * @apiBody {String} batchNumber Número de lote.
 * @apiBody {Number} price Precio del producto.
 * @apiBody {Number} quantity Cantidad en stock.
 *
 * @apiSuccess {Number} id ID del producto actualizado.
 * @apiSuccess {String} name Nombre del producto.
 * @apiSuccess {String} batchNumber Número de lote.
 * @apiSuccess {Number} price Precio del producto.
 * @apiSuccess {Number} quantity Cantidad en stock.
 *
 * @apiError (403 Forbidden) ForbiddenError Solo los administradores pueden actualizar productos.
 * @apiError (400 Bad Request) ValidationError Datos de entrada inválidos.
 * @apiError (404 Not Found) ProductNotFound El producto no fue encontrado.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al actualizar el producto.
 */
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, validateProduct, productController.updateProduct);

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA ELIMINAR UN PRODUCTO
//----------------------------------------------------------------------------------------------------
/**
 * @api {delete} /api/products/:id Eliminar un producto
 * @apiName DeleteProduct
 * @apiGroup Products
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token de autenticación JWT.
 *
 * @apiParam {Number} id ID único del producto.
 *
 * @apiSuccess {Number} 204 No Content. La eliminación fue exitosa.
 *
 * @apiError (403 Forbidden) ForbiddenError Solo los administradores pueden eliminar productos.
 * @apiError (404 Not Found) ProductNotFound El producto no fue encontrado.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al eliminar el producto.
 */
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, productController.deleteProduct);

module.exports = router;