const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info', // Nivel mínimo de log. Puedes cambiarlo a 'debug', 'warn', o 'error'
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    // Transporte para mostrar logs en la consola
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
      )
    }),
    
    // Transporte para guardar logs en un archivo (opcional, pero recomendado)
    new transports.File({ filename: 'logs/combined.log' })
  ],
});

module.exports = logger;