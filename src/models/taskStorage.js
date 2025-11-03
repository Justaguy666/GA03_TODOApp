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
        // Find the smallest missing ID
        let newId = 1;
        const existingIds = tasks.map(task => task.id).sort((a, b) => a - b);
        
        for (let i = 0; i < existingIds.length; i++) {
            if (existingIds[i] !== newId) {
                break;
            }
            newId++;
        }
        
        const newTask = {
            id: newId,
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

    update = (id, updates) => {
        let task = this.getTaskById(id);
        if (task) {
            // Only update allowed fields
            if (updates.description !== undefined) task.description = updates.description;
            if (updates.priority !== undefined) task.priority = updates.priority.toLowerCase();
            if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
            return task;
        }
        return null;
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