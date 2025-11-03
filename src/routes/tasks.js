import express from 'express';
import taskController from '../controllers/taskController.js';

const router = express.Router();

// [GET] /
router.get('/', taskController.getTasks);

// Add a new task
router.post('/', taskController.createTask);

// Mark a task as completed
// router.put('/:id/complete', taskController.markTask);

// Unmark a task as not completed
//router.put('/:id/uncomplete', taskController.unmarkTask);

// Delete a task
//router.delete('/:id', taskController.deleteTask);

export default router;