const winston = require('winston');

// Настройка логгера
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware для логирования запросов
const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip
  });
  next();
};

module.exports = { logger, requestLogger }; 