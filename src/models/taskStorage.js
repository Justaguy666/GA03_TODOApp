// task structure: { id: number, description: string, completed: boolean }
let tasks = [];

// Get all tasks
exports.getAll = () => tasks;

// Mark a task as completed
exports.mark = (id) => {
    const task = tasks.find(t => t.id === Number(id));
    if (task) {
        task.completed = true;
    }
}