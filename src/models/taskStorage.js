// task structure: { id: number, description: string, completed: boolean }
let tasks = [
    { id: 1, description: "Learn Node.js", completed: false },
    { id: 2, description: "Build a Todo App", completed: true },
    { id: 3, description: "Master Express.js", completed: false }
];

// Get all tasks
export function getAll() {
    return tasks;
}