import taskStorage from '../models/taskStorage.js'

class TaskController {
    // Render the main page with tasks (Server-Side Rendering)
    renderIndex = (req, res) => {
        const tasks = taskStorage.getTasks();
        res.render('index', { tasks });
    }

    // API endpoint to get tasks as JSON (for Client-Side Rendering)
    getTasks = (req, res) => {
        const tasks = taskStorage.getTasks();
        return res.status(200).json(tasks);
    }

    // Add new task
    addTask = (req, res) => {
        const { description, priority, dueDate } = req.body;
        if (description) {
            taskStorage.add({ description, priority, dueDate });
        }
        res.redirect('/');
    }

    // Mark task as completed
    markTask = (req, res) => {
        const id = parseInt(req.params.id);
        if (!isNaN(id)) {
            taskStorage.mark(id);
        }
        res.redirect('/');
    }

    // Delete task
    deleteTask = (req, res) => {
        const id = parseInt(req.params.id);
        if (!isNaN(id)) {
            taskStorage.delete(id);
        }
        res.redirect('/');
    }
}

export default new TaskController();