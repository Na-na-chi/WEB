const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
const { requestLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shop API',
      version: '1.0.0',
      description: 'API документация для магазина',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
  },
  apis: [path.resolve(__dirname, './routes/*.js')], // Исправленный путь
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

module.exports = app; 