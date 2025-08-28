const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../config/logger');

// Función para el registro de un nuevo usuario
exports.register = async (req, res, next) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || 'client',
    });
    logger.info(`Nuevo usuario registrado: ${username} con rol ${role}`);
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    logger.error(`Error al registrar usuario: ${error.message}`);
    next(error);
  }
};

// Función para el login de un usuario
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      logger.warn(`Intento de login fallido para usuario: ${username}. Usuario no encontrado.`);
      const err = new Error('Usuario no encontrado');
      err.statusCode = 401; // Código de estado para "No Autorizado"
      return next(err);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Intento de login fallido para usuario: ${username}. Contraseña incorrecta.`);
      const err = new Error('Contraseña incorrecta');
      err.statusCode = 401;
      return next(err);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
    logger.info(`Login exitoso para usuario: ${username}`);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Error al autenticar el usuario: ${error.message}`);
    // Pasa cualquier otro error inesperado al middleware global
    next(error);
  }
};