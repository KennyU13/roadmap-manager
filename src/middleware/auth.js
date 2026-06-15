const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/prisma');

const authenticate = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    const token = authorizationHeader.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired authentication token' });
    }

    return next(error);
  }
};

module.exports = authenticate;
