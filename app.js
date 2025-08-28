// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Importa el middleware de manejo de errores
const errorHandler = require('./middleware/errorHandler');

// Importa las rutas de autenticación
const authRoutes = require('./routes/authRoutes');
// Importa las rutas de productos
const productRoutes = require('./routes/productsRoutes');
// Importa las rutas de compras
const purchaseRoutes = require('./routes/purchaseRoutes');

// Conecta las rutas de autenticación, productos y compras
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);

// Mensaje de bienvenida (opcional)
app.get('/', (req, res) => {
  res.send('¡API de Inventario en funcionamiento!');
});

app.use(errorHandler);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada. Conexión exitosa.');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos y/o al iniciar el servidor:', err);
  });