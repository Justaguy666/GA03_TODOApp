import taskStorage from '../models/taskStorage.js'
import path from 'path';
import { fileURLToPath } from 'url';

// tạo __dirname (nếu file controller là module ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TaskController {
    renderIndex = (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
    };

    // API endpoint to get tasks as JSON (for Client-Side Rendering)
    getTasks = (req, res) => {
        const tasks = taskStorage.getTasks();
        return res.status(200).json(tasks);
    }

    // Add new task (API endpoint for AJAX)
    addTask = (req, res) => {
        const { description, priority, dueDate } = req.body;
        if (description) {
            const newTask = taskStorage.add({ description, priority, dueDate });
            return res.status(201).json(newTask);
        }
        return res.status(400).json({ error: 'Description is required' });
    }

    // Mark task as completed (API endpoint for AJAX)
    markTask = (req, res) => {
        const id = parseInt(req.params.id);
        if (!isNaN(id)) {
            taskStorage.mark(id);
            return res.status(200).json({ success: true });
        }
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    // Delete task (API endpoint for AJAX)
    deleteTask = (req, res) => {
        const id = parseInt(req.params.id);
        if (!isNaN(id)) {
            taskStorage.delete(id);
            return res.status(200).json({ success: true });
        }
        return res.status(400).json({ error: 'Invalid task ID' });
    }
}

export default new TaskController();