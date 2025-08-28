const logger = require('../config/logger');

// Middleware para manejar errores de forma centralizada
const errorHandler = (err, req, res, next) => {
    // Si el error tiene un código de estado, úsalo, si no, usa 500
    const statusCode = err.statusCode || 500;

    // Registra el error completo en el log para depuración
    logger.error(`Error en la solicitud para ${req.method} ${req.originalUrl}:`, {
        error: err.message,
        stack: err.stack,
    });

    // Envía una respuesta al cliente con un mensaje de error genérico y seguro
    res.status(statusCode).json({
        error: "Ha ocurrido un error en el servidor. Por favor, intente de nuevo más tarde."
    });
};

module.exports = errorHandler;