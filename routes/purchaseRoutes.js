const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authMiddleware = require('../middleware/authMiddleware');
const { validatePurchase } = require('../validators/purchaseValidator');

// Middleware para verificar que el usuario es un cliente
const isClient = (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ error: 'Acceso denegado. Solo clientes pueden realizar esta acción.' });
    }
    next();
};

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA CREAR UNA NUEVA COMPRA
//----------------------------------------------------------------------------------------------------
/**
 * @api {post} /api/purchases Crear una nueva compra
 * @apiName CreatePurchase
 * @apiGroup Purchases
 * @apiPermission client
 *
 * @apiHeader {String} Authorization Token de autenticación JWT.
 *
 * @apiBody {Object[]} items Array de productos a comprar.
 * @apiBody {Number} items.productId ID del producto.
 * @apiBody {Number} items.quantity Cantidad del producto.
 *
 * @apiSuccess {String} message Mensaje de éxito.
 * @apiSuccess {Object} purchase Objeto de la compra creada.
 *
 * @apiError (403 Forbidden) ForbiddenError Solo los clientes pueden crear compras.
 * @apiError (400 Bad Request) ValidationError Datos de entrada inválidos o stock insuficiente.
 * @apiError (404 Not Found) ProductNotFound El producto no existe.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al procesar la compra.
 */
router.post('/', authMiddleware.verifyToken, validatePurchase, isClient, purchaseController.createPurchase);

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA OBTENER TODAS LAS COMPRAS (ADMIN)
//----------------------------------------------------------------------------------------------------
/**
 * @api {get} /api/purchases/all Obtener todas las compras
 * @apiName GetAllPurchases
 * @apiGroup Purchases
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Token de autenticación JWT.
 *
 * @apiSuccess {Object[]} purchases Lista de todas las compras del sistema.
 * @apiSuccess {Number} purchases.id ID de cada compra.
 * @apiSuccess {Number} purchases.totalPrice Precio total de cada compra.
 * @apiSuccess {Object} purchases.User El usuario que realizó la compra.
 * @apiSuccess {Object[]} purchases.Products Lista de productos de cada compra.
 *
 * @apiError (403 Forbidden) ForbiddenError Solo los administradores pueden ver todas las compras.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al obtener todas las compras.
 */
router.get('/all', authMiddleware.verifyToken, authMiddleware.isAdmin, purchaseController.getAllPurchases);

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA OBTENER UNA FACTURA DETALLADA
//----------------------------------------------------------------------------------------------------
/**
 * @api {get} /api/purchases/:id Obtener una factura detallada
 * @apiName GetPurchaseInvoice
 * @apiGroup Purchases
 * @apiPermission client
 *
 * @apiHeader {String} Authorization Token de autenticación JWT.
 *
 * @apiParam {Number} id ID de la compra.
 *
 * @apiSuccess {Number} id ID de la compra.
 * @apiSuccess {Number} totalPrice Precio total de la compra.
 * @apiSuccess {Object[]} Products Lista de productos de la compra.
 *
 * @apiError (403 Forbidden) ForbiddenError Solo el cliente que realizó la compra puede ver la factura.
 * @apiError (404 Not Found) PurchaseNotFound La compra no fue encontrada.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al obtener la factura.
 */
router.get('/:id', authMiddleware.verifyToken, isClient, purchaseController.getPurchaseInvoice);

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA OBTENER EL HISTORIAL DE COMPRAS
//----------------------------------------------------------------------------------------------------
/**
 * @api {get} /api/purchases Obtener el historial de compras
 * @apiName GetPurchaseHistory
 * @apiGroup Purchases
 * @apiPermission client
 *
 * @apiHeader {String} Authorization Token de autenticación JWT.
 *
 * @apiSuccess {Object[]} history Historial de compras del usuario.
 * @apiSuccess {Number} history.id ID de cada compra.
 * @apiSuccess {Number} history.totalPrice Precio total de cada compra.
 * @apiSuccess {Object[]} history.Products Lista de productos de cada compra.
 *
 * @apiError (403 Forbidden) ForbiddenError Solo los clientes pueden ver su historial.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al obtener el historial.
 */
router.get('/', authMiddleware.verifyToken, isClient, purchaseController.getPurchaseHistory);

module.exports = router;    