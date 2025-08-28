// models/index.js
const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./product');
const Purchase = require('./purchase');
const PurchaseItem = require('./purchaseItem');

// Definir las relaciones (asociaciones)
// Un usuario puede tener muchas compras
User.hasMany(Purchase, { foreignKey: 'userId' });
Purchase.belongsTo(User, { foreignKey: 'userId' });

// Una compra tiene muchos productos y un producto puede estar en muchas compras
// a través de la tabla intermedia PurchaseItems
Product.belongsToMany(Purchase, { through: PurchaseItem, foreignKey: 'productId' });
Purchase.belongsToMany(Product, { through: PurchaseItem, foreignKey: 'purchaseId' });

module.exports = {
  sequelize,
  User,
  Product,
  Purchase,
  PurchaseItem,
};

