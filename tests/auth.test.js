jest.mock('../src/config/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn()
  },
  $queryRaw: jest.fn()
}));

const request = require('supertest');
const bcrypt = require('bcrypt');
const prisma = require('../src/config/prisma');
const app = require('../src/app');

describe('auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/register creates a user and returns a JWT', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'bfe70bc5-36b9-4df7-8124-6df2c4f4fa76',
      email: 'ada@example.com',
      name: 'Ada',
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const response = await request(app).post('/api/auth/register').send({
      email: 'ada@example.com',
      name: 'Ada',
      password: 'strong-password'
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('ada@example.com');
    expect(response.body.user.password).toBeUndefined();
    expect(response.body.token).toBeDefined();
  });

  test('POST /api/auth/login rejects invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app).post('/api/auth/login').send({
      email: 'ada@example.com',
      password: 'wrong-password'
    });

    expect(response.status).toBe(401);
  });

  test('POST /api/auth/login accepts valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('strong-password', 4);

    prisma.user.findUnique.mockResolvedValue({
      id: 'bfe70bc5-36b9-4df7-8124-6df2c4f4fa76',
      email: 'ada@example.com',
      name: 'Ada',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'ada@example.com',
      password: 'strong-password'
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
