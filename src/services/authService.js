const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const env = require('../config/env');

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const generateToken = (user) =>
  jwt.sign(
    {
      email: user.email
    },
    env.jwtSecret,
    {
      subject: user.id,
      expiresIn: env.jwtExpiresIn
    }
  );

const register = async ({ email, password, name }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword
    }
  });

  return {
    user: sanitizeUser(user),
    token: generateToken(user)
  };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  return {
    user: sanitizeUser(user),
    token: generateToken(user)
  };
};

module.exports = {
  register,
  login
};
