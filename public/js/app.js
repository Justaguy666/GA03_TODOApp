/**
 * Task Manager - Client-Side JavaScript
 * Handles client-side rendering (CSR) and interactions
 * Progressive Enhancement: works with or without JS
 */

// ========================
// State Management
// ========================
let tasks = [];

// ========================
// DOM Elements
// ========================
const todoList = document.getElementById('todoList');
const completedList = document.getElementById('completedList');
const addTaskBtn = document.getElementById('addTaskBtn');

// ========================
// API Functions
// ========================

/**
 * Fetch all tasks from server
 */
async function fetchTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showNotification('Failed to load tasks', 'error');
    }
}

/**
 * Add new task to server
 */
async function addTask(taskData) {
    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(taskData)
        });
        
        if (response.ok) {
            // Refresh tasks after adding
            await fetchTasks();
            showNotification('Task added successfully!', 'success');
        } else {
            throw new Error('Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Failed to add task', 'error');
    }
}

/**
 * Toggle task completion status
 */
async function toggleTask(taskId) {
    try {
        const response = await fetch(`/${taskId}/complete?_method=PUT`, {
            method: 'POST',
        });
        
        if (response.ok) {
            // Update local state
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                renderTasks();
                showNotification('Task updated!', 'success');
            }
        } else {
            throw new Error('Failed to update task');
        }
    } catch (error) {
        console.error('Error toggling task:', error);
        showNotification('Failed to update task', 'error');
    }
}

/**
 * Delete task from server
 */
async function deleteTask(taskId) {
    try {
        const response = await fetch(`/${taskId}?_method=DELETE`, {
            method: 'POST',
        });
        
        if (response.ok) {
            // Remove from local state
            tasks = tasks.filter(t => t.id !== taskId);
            renderTasks();
            showNotification('Task deleted!', 'success');
        } else {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Failed to delete task', 'error');
    }
}

// ========================
// Rendering Functions
// ========================

/**
 * Get priority class based on task priority
 */
function getPriorityClass(priority) {
    const priorityMap = {
        'high': 'bg-priority-high',
        'medium': 'bg-priority-medium',
        'low': 'bg-priority-low'
    };
    return priorityMap[priority?.toLowerCase()] || 'bg-dark-item';
}

/**
 * Create task item HTML
 */
function createTaskHTML(task, priorityClass = 'bg-dark-item') {
    return `
        <div class="relative h-[100px] border-b border-black/20 ${priorityClass} hover:opacity-90 transition-opacity" data-task-id="${task.id}">
            <div class="flex items-center justify-between h-full px-8">
                
                <!-- Checkbox -->
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-white rounded flex items-center justify-center cursor-pointer hover:scale-110 transition-transform task-checkbox">
                        ${task.completed ? `
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#000000"/>
                            </svg>
                        ` : ''}
                    </div>
                    
                    <!-- Task Info -->
                    <div class="flex flex-col">
                        <span class="font-space text-2xl text-white ${task.completed ? 'underline opacity-50' : ''} text-center">
                            ${escapeHtml(task.description || task.title || 'Untitled Task')}
                        </span>
                        ${task.dueDate ? `
                            <span class="font-space text-sm text-white/60 mt-1">
                                Due: ${escapeHtml(task.dueDate)}
                            </span>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex gap-2">
                    <!-- Edit Button -->
                    <button class="w-[50px] h-[50px] bg-btn-edit rounded hover:bg-btn-edit/80 transition-colors flex items-center justify-center group task-edit">
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    
                    <!-- Delete Button -->
                    <button class="w-[50px] h-[50px] bg-btn-delete rounded hover:bg-btn-delete/80 transition-colors flex items-center justify-center group task-delete">
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="white">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
                
            </div>
        </div>
    `;
}

/**
 * Render all tasks to DOM
 */
function renderTasks() {
    // Filter tasks
    const todoTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    
    // Render To-Do list
    if (todoTasks.length > 0) {
        todoList.innerHTML = todoTasks.map(task => {
            const priorityClass = getPriorityClass(task.priority);
            return createTaskHTML(task, priorityClass);
        }).join('');
    } else {
        todoList.innerHTML = `
            <div class="flex items-center justify-center h-full text-dark-secondary text-xl">
                No tasks yet. Add one to get started!
            </div>
        `;
    }
    
    // Render Completed list
    if (completedTasks.length > 0) {
        completedList.innerHTML = completedTasks.map(task => {
            return createTaskHTML(task, 'bg-dark-item');
        }).join('');
    } else {
        completedList.innerHTML = `
            <div class="flex items-center justify-center h-full text-dark-secondary text-xl">
                No completed tasks
            </div>
        `;
    }
    
    // Attach event listeners to new elements
    attachTaskEventListeners();
}

// ========================
// Event Handlers
// ========================

/**
 * Attach event listeners to task items
 */
function attachTaskEventListeners() {
    // Checkbox click - toggle completion
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            const taskItem = e.target.closest('[data-task-id]');
            const taskId = parseInt(taskItem.dataset.taskId);
            toggleTask(taskId);
        });
    });
    
    // Delete button click
    document.querySelectorAll('.task-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskItem = e.target.closest('[data-task-id]');
            const taskId = parseInt(taskItem.dataset.taskId);
            
            // Confirm before delete
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(taskId);
            }
        });
    });
    
    // Edit button click (placeholder for future implementation)
    document.querySelectorAll('.task-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskItem = e.target.closest('[data-task-id]');
            const taskId = parseInt(taskItem.dataset.taskId);
            editTask(taskId);
        });
    });
}

/**
 * Handle Add Task button click
 */
addTaskBtn?.addEventListener('click', () => {
    showAddTaskModal();
});

// ========================
// Modal Functions
// ========================

/**
 * Show Add Task Modal
 */
function showAddTaskModal() {
    // Create modal HTML
    const modalHTML = `
        <div id="taskModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div class="bg-dark-card border border-dark-border rounded-[20px] p-8 w-full max-w-md shadow-2xl animate-slideUp">
                <h2 class="font-space text-3xl text-dark-text mb-6">Add New Task</h2>
                
                <form id="addTaskForm" class="space-y-4">
                    <!-- Description -->
                    <div>
                        <label class="block font-space text-sm text-dark-text mb-2">Task Description</label>
                        <input 
                            type="text" 
                            name="description" 
                            required
                            placeholder="Enter task description..."
                            class="w-full px-4 py-3 bg-dark-item border border-dark-border rounded-lg text-dark-text font-space focus:outline-none focus:border-btn-primary transition-colors"
                        />
                    </div>
                    
                    <!-- Priority -->
                    <div>
                        <label class="block font-space text-sm text-dark-text mb-2">Priority</label>
                        <select 
                            name="priority"
                            class="w-full px-4 py-3 bg-dark-item border border-dark-border rounded-lg text-dark-text font-space focus:outline-none focus:border-btn-primary transition-colors"
                        >
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    
                    <!-- Due Date -->
                    <div>
                        <label class="block font-space text-sm text-dark-text mb-2">Due Date</label>
                        <input 
                            type="date" 
                            name="dueDate"
                            class="w-full px-4 py-3 bg-dark-item border border-dark-border rounded-lg text-dark-text font-space focus:outline-none focus:border-btn-primary transition-colors"
                        />
                    </div>
                    
                    <!-- Buttons -->
                    <div class="flex gap-4 mt-6">
                        <button 
                            type="submit"
                            class="flex-1 px-6 py-3 bg-gradient-to-r from-btn-primary to-btn-primary-dark text-dark-text font-space rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Add Task
                        </button>
                        <button 
                            type="button"
                            id="cancelBtn"
                            class="flex-1 px-6 py-3 bg-dark-item text-dark-secondary font-space rounded-lg hover:bg-dark-border transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Attach event listeners
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('addTaskForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Submit form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const taskData = Object.fromEntries(formData);
        
        await addTask(taskData);
        modal.remove();
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Focus first input
    form.querySelector('input[name="description"]').focus();
}

/**
 * Edit task (placeholder for future implementation)
 */
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // TODO: Implement edit modal similar to add modal
    showNotification('Edit feature coming soon!', 'info');
    console.log('Edit task:', task);
}

// ========================
// Utility Functions
// ========================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-priority-low',
        error: 'bg-priority-high',
        info: 'bg-btn-primary'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-8 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg font-space z-50 animate-slideIn`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-slideOut');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================
// Initialize
// ========================

/**
 * Initialize app on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Task Manager initialized');
    
    // Fetch initial tasks from server
    fetchTasks();
    
    // Attach initial event listeners
    attachTaskEventListeners();
});

// ========================
// Animations CSS (inject to <head>)
// ========================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
    
    .animate-slideUp {
        animation: slideUp 0.3s ease-out;
    }
    
    .animate-slideIn {
        animation: slideIn 0.3s ease-out;
    }
    
    .animate-slideOut {
        animation: slideOut 0.3s ease-out;
    }
`;
document.head.appendChild(style);
