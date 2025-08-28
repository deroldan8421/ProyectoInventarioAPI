const { Product, Purchase, PurchaseItem, User, sequelize } = require('../models');
const logger = require('../config/logger'); // Importa el logger

// Módulo de compras: Agregar 1 o varios productos y la cantidad por cada producto
exports.createPurchase = async (req, res) => {
    const { items } = req.body;
    const userId = req.user.id; 

    if (!items || items.length === 0) {
        logger.warn(`Intento de compra fallido. Usuario: ${userId}. Carrito vacío.`);
        return res.status(400).json({ error: 'La compra debe contener al menos un producto.' });
    }

    const t = await sequelize.transaction();

    try {
        let totalPrice = 0;
        const purchase = await Purchase.create({ userId, totalPrice: 0 }, { transaction: t });
        const purchaseItems = [];

        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction: t });

            if (!product) {
                await t.rollback();
                logger.warn(`Intento de compra fallido. Usuario: ${userId}. Producto con ID ${item.productId} no encontrado.`);
                return res.status(404).json({ error: `Producto con ID ${item.productId} no encontrado.` });
            }

            if (product.quantity < item.quantity) {
                await t.rollback();
                logger.warn(`Intento de compra fallido. Usuario: ${userId}. Stock insuficiente para el producto: ${product.name}.`);
                return res.status(400).json({ error: `No hay suficiente stock para el producto: ${product.name}` });
            }

            const unitPrice = product.price;
            const subtotal = unitPrice * item.quantity;
            totalPrice += subtotal;

            await product.update({ quantity: product.quantity - item.quantity }, { transaction: t });

            purchaseItems.push({
                purchaseId: purchase.id,
                productId: product.id,
                quantity: item.quantity,
                unitPrice,
            });
        }

        await PurchaseItem.bulkCreate(purchaseItems, { transaction: t });
        await purchase.update({ totalPrice }, { transaction: t });

        await t.commit();
        logger.info(`Compra realizada con éxito. ID de compra: ${purchase.id}. Total: ${totalPrice}.`);
        res.status(201).json({ message: 'Compra realizada exitosamente', purchase });
    } catch (error) {
        await t.rollback();
        logger.error(`Error al procesar la compra del usuario ${userId}. Detalles: ${error.message}`);
        res.status(500).json({ error: 'Error al procesar la compra', details: error.message });
    }
};

// Visualización de una factura (cliente)
exports.getPurchaseInvoice = async (req, res) => {
    const purchaseId = req.params.id;
    const userId = req.user.id;

    try {
        const purchase = await Purchase.findOne({
            where: { id: purchaseId, userId },
            include: [{
                model: Product,
                through: { model: PurchaseItem, attributes: ['quantity', 'unitPrice'] },
            }],
        });

        if (!purchase) {
            logger.warn(`Intento de acceso a factura. Usuario: ${userId}. Factura no encontrada o no pertenece al usuario. ID: ${purchaseId}`);
            return res.status(404).json({ error: 'Factura no encontrada o no pertenece al usuario.' });
        }
        logger.info(`Acceso a factura. Usuario: ${userId}. Factura ID: ${purchaseId}.`);
        res.status(200).json(purchase);
    } catch (error) {
        logger.error(`Error al obtener factura. Usuario: ${userId}. Detalles: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener la factura' });
    }
};

// Historial de compras (cliente)
exports.getPurchaseHistory = async (req, res) => {
    const userId = req.user.id;
    try {
        const history = await Purchase.findAll({
            where: { userId },
            include: [{
                model: Product,
                through: { model: PurchaseItem, attributes: ['quantity', 'unitPrice'] },
            }],
            order: [['createdAt', 'DESC']],
        });
        logger.info(`Historial de compras consultado por el usuario: ${userId}`);
        res.status(200).json(history);
    } catch (error) {
        logger.error(`Error al obtener historial de compras. Usuario: ${userId}. Detalles: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener el historial de compras' });
    }
};

// Obtener todas las compras (Admin)
exports.getAllPurchases = async (req, res) => {
    try {
        const allPurchases = await Purchase.findAll({
            include: [{
                model: Product,
                through: { model: PurchaseItem, attributes: ['quantity', 'unitPrice'] },
            }, {
                model: User,
                attributes: ['id', 'username', 'role']
            }],
            order: [['createdAt', 'DESC']],
        });
        logger.info(`Todas las compras consultadas por el administrador: ${req.user.id}`);
        res.status(200).json(allPurchases);
    } catch (error) {
        logger.error(`Error al obtener todas las compras. Detalles: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener todas las compras' });
    }
};