jest.mock('../src/config/prisma', () => ({
  user: {
    findUnique: jest.fn()
  },
  task: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  $queryRaw: jest.fn()
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const prisma = require('../src/config/prisma');
const app = require('../src/app');

const user = {
  id: 'bfe70bc5-36b9-4df7-8124-6df2c4f4fa76',
  email: 'ada@example.com',
  name: 'Ada'
};

const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
  subject: user.id,
  expiresIn: '1h'
});

describe('task routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.user.findUnique.mockResolvedValue(user);
  });

  test('GET /api/tasks requires authentication', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(401);
  });

  test('GET /api/tasks returns only authenticated user tasks', async () => {
    prisma.task.findMany.mockResolvedValue([
      {
        id: '8723b63d-70df-4d54-995e-68c52dc66930',
        title: 'Deploy',
        completed: false,
        userId: user.id
      }
    ]);

    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    expect(response.body.tasks).toHaveLength(1);
  });

  test('POST /api/tasks creates a task for the authenticated user', async () => {
    prisma.task.create.mockResolvedValue({
      id: '8723b63d-70df-4d54-995e-68c52dc66930',
      title: 'Write CI',
      completed: false,
      userId: user.id
    });

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Write CI' });

    expect(response.status).toBe(201);
    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        title: 'Write CI',
        description: undefined,
        userId: user.id
      }
    });
  });
});
