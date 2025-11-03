// task structure: { id: number, description: string, completed: boolean, priority: string, dueDate: string }
let tasks = [
{ 
    id: 1, 
    description: "Finish Project Analysis", 
    completed: false, 
    priority: "high", 
    dueDate: "01/11/2025" 
},
{ 
    id: 2, 
    description: "Build Todo App UI", 
    completed: true, 
    priority: "medium", 
    dueDate: "05/11/2025" 
},
{ 
    id: 3, 
    description: "Master Express.js", 
    completed: false, 
    priority: "low", 
    dueDate: "20/11/2025" 
}
];  

class TaskStorage {
    getTasks = () => tasks;

    getTaskById = (id) => {
        return tasks.find(task => task.id === id);
    }

    add = ({ description, priority = 'medium', dueDate = '' }) => {
        const newTask = {
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            description,
            priority: priority.toLowerCase(),
            dueDate,
            completed: false
        };
        tasks.push(newTask);
        return newTask;
    };

    delete = (id) => {
        tasks = tasks.filter(task => task.id !== id);
    }

    mark = (id) => {
        let task = this.getTaskById(id);
        if (task) {
            task.completed = true;
        }
    }

    toggleTaskCompletion = (id) => {
        let task = this.getTaskById(id);
        if (task) {
            task.completed = !task.completed;
        }
    }
}

export default new TaskStorage();