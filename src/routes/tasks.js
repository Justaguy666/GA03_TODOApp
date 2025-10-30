const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Display all tasks
router.get('/tasks', taskController.getAllTasks);

// Add a new task
router.post('/tasks', taskController.createTask);

// Mark a task as completed
router.put('/tasks/:id/complete', taskController.completeTask);

// Unmark a task as not completed
router.put('/tasks/:id/uncomplete', taskController.uncompleteTask);

// Delete a task
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;