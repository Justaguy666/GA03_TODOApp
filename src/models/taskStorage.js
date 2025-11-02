// task structure: { id: number, description: string, completed: boolean }
let tasks = [
{ 
    id: 1, 
    description: "Learn Node.js", 
    completed: false, 
    priority: "High", 
    dueDate: "2025-11-10" 
},
{ 
    id: 2, 
    description: "Build a Todo App", 
    completed: true, 
    priority: "Medium", 
    dueDate: "2025-11-05" 
},
{ 
    id: 3, 
    description: "Master Express.js", 
    completed: false, 
    priority: "Low", 
    dueDate: "2025-11-20" 
}
];  

class TaskStorage {
    getTasks = () => tasks;

    getTaskById = (id) => {
        return tasks.find(task => task.id === id);
    }

    addTasks = (task) => {
        tasks.push(task);
    };

    deleteTaskById = (id) => {
        tasks = tasks.filter(task => task.id !== id);
    }

    toggleTaskCompletion = (id) => {
        let task = this.getTaskById(id);
        task.completed = !task.completed;
    }
}

export default new TaskStorage();