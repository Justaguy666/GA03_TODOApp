const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Display all tasks
router.get('/', taskController.getAllTasks);

// Add a new task
//router.post('/', taskController.createTask);

// Mark a task as completed
router.put('/:id/complete', taskController.markTask);

// Unmark a task as not completed
//router.put('/:id/uncomplete', taskController.unmarkTask);

// Delete a task
//router.delete('/:id', taskController.deleteTask);

module.exports = router;