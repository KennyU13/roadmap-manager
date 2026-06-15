const express = require('express');
const { body, param } = require('express-validator');
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

const router = express.Router();

const taskIdValidation = [param('id').isUUID().withMessage('Task id must be a valid UUID')];

const taskBodyValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 120 }).withMessage('Title is required'),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description is too long'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
];

router.use(authenticate);

router.get('/', taskController.listTasks);

router.post(
  '/',
  [
    body('title').trim().isLength({ min: 1, max: 120 }).withMessage('Title is required'),
    body('description')
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description is too long')
  ],
  validateRequest,
  taskController.createTask
);

router.patch('/:id', [...taskIdValidation, ...taskBodyValidation], validateRequest, taskController.updateTask);

router.patch(
  '/:id/complete',
  taskIdValidation,
  validateRequest,
  taskController.completeTask
);

router.delete('/:id', taskIdValidation, validateRequest, taskController.deleteTask);

module.exports = router;
