// task structure: { id: number, description: string, completed: boolean }
let tasks = [
    { id: 1, description: "Learn Node.js", completed: false },
    { id: 2, description: "Build a Todo App", completed: true },
    { id: 3, description: "Master Express.js", completed: false }
];

// Get all tasks
exports.getAll = () => tasks;

// Mark a task as completed
exports.mark = (id) => {
    const task = tasks.find(t => t.id === Number(id));
    if (task) {
        task.completed = true;
    }
}

exports.add = (description) => {
    const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    tasks.push({ id: newId, description, completed: false });
}