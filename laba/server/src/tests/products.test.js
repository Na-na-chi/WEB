const request = require('supertest');
const app = require('../app'); // Нужно будет создать
const sequelize = require('../config/database');

describe('Products API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const testProduct = {
    name: 'Test Product',
    price: 99.99,
    description: 'Test Description',
    stock: 10
  };

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send(testProduct);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(testProduct.name);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by id', async () => {
      // Сначала создаем продукт
      const product = await request(app)
        .post('/api/products')
        .send(testProduct);

      const res = await request(app)
        .get(`/api/products/${product.body.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(testProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/9999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      // Создаем продукт
      const product = await request(app)
        .post('/api/products')
        .send(testProduct);

      const updatedData = {
        name: 'Updated Product',
        price: 199.99
      };

      const res = await request(app)
        .put(`/api/products/${product.body.id}`)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(updatedData.name);
      expect(res.body.price).toBe(updatedData.price);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      // Создаем продукт
      const product = await request(app)
        .post('/api/products')
        .send(testProduct);

      const res = await request(app)
        .delete(`/api/products/${product.body.id}`);

      expect(res.statusCode).toBe(204);

      // Проверяем, что продукт действительно удален
      const checkRes = await request(app)
        .get(`/api/products/${product.body.id}`);
      expect(checkRes.statusCode).toBe(404);
    });
  });
}); 