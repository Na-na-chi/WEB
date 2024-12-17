const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

describe('Orders API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let testProduct;

  beforeEach(async () => {
    // Создаем тестовый продукт для заказов
    const productRes = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Product',
        price: 99.99,
        stock: 10
      });
    testProduct = productRes.body;
  });

  const testOrder = {
    customerName: 'Test Customer',
    totalAmount: 99.99,
    items: [
      {
        id: 1,
        quantity: 1
      }
    ]
  };

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      testOrder.items[0].id = testProduct.id;
      
      const res = await request(app)
        .post('/api/orders')
        .send(testOrder);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.customerName).toBe(testOrder.customerName);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should check product stock', async () => {
      testOrder.items[0].quantity = 100; // Больше, чем есть в наличии

      const res = await request(app)
        .post('/api/orders')
        .send(testOrder);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Недостаточно товара');
    });
  });

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      const res = await request(app).get('/api/orders');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    it('should update order status', async () => {
      // Создаем заказ
      testOrder.items[0].quantity = 1;
      const order = await request(app)
        .post('/api/orders')
        .send(testOrder);

      const res = await request(app)
        .put(`/api/orders/${order.body.id}/status`)
        .send({ status: 'completed' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('completed');
    });

    it('should validate status value', async () => {
      const res = await request(app)
        .put('/api/orders/1/status')
        .send({ status: 'invalid-status' });

      expect(res.statusCode).toBe(400);
    });
  });
}); 