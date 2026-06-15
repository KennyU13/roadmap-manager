jest.mock('../src/config/prisma', () => ({
  $queryRaw: jest.fn()
}));

const request = require('supertest');
const prisma = require('../src/config/prisma');
const app = require('../src/app');

describe('health endpoints', () => {
  test('GET /health returns ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('GET /ready returns ready when database responds', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const response = await request(app).get('/ready');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ready');
  });
});
