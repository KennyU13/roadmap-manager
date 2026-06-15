const taskService = require('../services/taskService');

const listTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    return res.status(200).json({ tasks });
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return res.status(201).json({ task });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const completeTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.id, {
      completed: true
    });
    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask
};
