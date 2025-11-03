import express from 'express';
import taskController from '../controllers/taskController.js';

const router = express.Router();

// [GET] / - Render main page with tasks
router.get('/', taskController.renderIndex);

// [POST] / - Add a new task
router.post('/', taskController.addTask);

// [PUT] /:id/complete - Mark a task as completed
router.put('/:id/complete', taskController.markTask);

// [DELETE] /:id - Delete a task
router.delete('/:id', taskController.deleteTask);

export default router;