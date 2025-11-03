import express from 'express';
import APIController from '../controllers/apiController.js';

const router = express.Router();

// [GET] /api/tasks
router.get('/tasks', APIController.getTasks);

// [POST] /api/tasks
router.post('/tasks', APIController.addTask);

// [DELETE] /api/tasks/:id/delete
router.delete('/tasks/:id/delete', APIController.deleteTask);

// [PATCH] /api/tasks/:id
router.patch('/tasks/:id/edit', APIController.updateTask);

// [PATH] /api/tasks/:id/toggle
router.patch('/tasks/:id/toggle', APIController.toggleTaskCompletion);

export default router;