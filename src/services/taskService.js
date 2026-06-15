const prisma = require('../config/prisma');

const getTasks = (userId) =>
  prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

const getTaskById = async (id, userId) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  return task;
};

const createTask = (userId, data) =>
  prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      userId
    }
  });

const updateTask = async (id, userId, data) => {
  await getTaskById(id, userId);

  return prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      completed: data.completed
    }
  });
};

const deleteTask = async (id, userId) => {
  await getTaskById(id, userId);

  await prisma.task.delete({
    where: { id }
  });
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
