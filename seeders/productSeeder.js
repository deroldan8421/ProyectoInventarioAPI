const { faker } = require('@faker-js/faker');
const { Product } = require('../models');

// Función para generar un producto de prueba
const createFakeProduct = () => {
  return {
    batchNumber: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price({ min: 10, max: 200, dec: 2 }),
    quantity: faker.number.int({ min: 10, max: 100 }),
  };
};

// Función para poblar la base de datos
const seedProducts = async (numProducts) => {
  try {
    const fakeProducts = [];
    for (let i = 0; i < numProducts; i++) {
      fakeProducts.push(createFakeProduct());
    }

    await Product.bulkCreate(fakeProducts);
    console.log(`${numProducts} productos de prueba han sido creados exitosamente.`);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  }
};

// Ejecuta la función para crear 50 productos de prueba
seedProducts(50);

module.exports = {
    seedProducts
};