import taskStorage from '../models/taskStorage.js'

class APIController {
    getTasks = (req, res) => {
        const tasks = taskStorage.getTasks();
        return res.status(200).json(tasks);
    }

    addTask = (req, res) => {
        const newTask = req.body;
        if(newTask.id in taskStorage.getTasks()) {
            return res.status(409).json({ message: "Task with this ID already exists" });
        }
        
        taskStorage.addTasks(newTask);

        return res.status(200).json({ message: "The task was added"});
    }

    deleteTask = (req, res) => {
        if(!taskStorage.getTaskById(parseInt(req.params.id))) {
            return res.status(404).json({ message: "Task not found" });
        }

        taskStorage.deleteTaskById(parseInt(req.params.id));

        return res.status(200).json({ message: "The task was deleted" });
    }

    updateTask = (req, res) => {
        let task = taskStorage.getTaskById(parseInt(req.params.id));

        if(!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        Object.assign(task, req.body);

        return res.status(200).json({ message: "The task was updated" });
    }

    toggleTaskCompletion = (req, res) => {
        if(!taskStorage.getTaskById(parseInt(req.params.id))) {
            return res.status(404).json({ message: "Task not found" });
        }

        taskStorage.toggleTaskCompletion(parseInt(req.params.id));

        return res.status(200).json(taskStorage.getTasks());
    }
}

export default new APIController();