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
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
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
        const response = await fetch(`/api/tasks/${taskId}/toggle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Refresh tasks after toggle
            await fetchTasks();
            showNotification('Task updated!', 'success');
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
        const response = await fetch(`/api/tasks/${taskId}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Refresh tasks after delete
            await fetchTasks();
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
        <div class="relative h-[100px] md:h-[100px] sm:h-[80px] border-b border-black/20 ${priorityClass} hover:opacity-90 transition-opacity" data-task-id="${task.id}">
            <div class="flex items-center justify-between h-full px-4 sm:px-6 md:px-8 gap-2 sm:gap-3 md:gap-4">
                
                <!-- Checkbox -->
                <div class="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white rounded flex items-center justify-center cursor-pointer hover:scale-110 transition-transform task-checkbox flex-shrink-0">
                        ${task.completed ? `
                            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#000000"/>
                            </svg>
                        ` : ''}
                    </div>
                    
                    <!-- Task Info -->
                    <div class="flex flex-col min-w-0 flex-1">
                        <span class="font-space text-base sm:text-lg md:text-2xl text-white ${task.completed ? 'opacity-50' : ''} truncate" style="text-decoration: underline; text-decoration-color: white;">
                            ${escapeHtml(task.description || task.title || 'Untitled Task')}
                        </span>
                        ${task.dueDate ? `
                            <span class="font-space text-xs sm:text-sm text-white/60 mt-0.5 sm:mt-1 truncate">
                                Due: ${escapeHtml(task.dueDate)}
                            </span>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
                    <!-- Edit Button -->
                    <button class="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px] bg-btn-edit rounded hover:bg-btn-edit/80 transition-colors flex items-center justify-center group task-edit">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    
                    <!-- Delete Button -->
                    <button class="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px] bg-btn-delete rounded hover:bg-btn-delete/80 transition-colors flex items-center justify-center group task-delete">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="white">
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
            
            // Show delete confirmation modal
            showDeleteConfirmModal(taskId);
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
    // Create modal HTML with new design
    const modalHTML = `
        <div id="taskModal" class="fixed inset-0 bg-black/60 backdrop-blur-[10px] flex items-center justify-center z-50 animate-fadeIn">
            <div class="relative bg-[#3A3A3A] border border-[#444444] rounded-[20px] w-[660px] shadow-2xl animate-slideUp">
                
                <!-- Header -->
                <div class="relative h-[69px] flex items-center justify-center border-b border-[#444444]">
                    <h2 class="font-space text-2xl text-[#EDEDED] text-center">Add New Task</h2>
                    
                    <!-- Close Button -->
                    <button 
                        id="closeModalBtn"
                        class="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
                    >
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="#999999" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Form Content -->
                <form id="addTaskForm" class="px-6 py-6 space-y-6">
                    
                    <!-- Task Name -->
                    <div>
                        <label class="block font-space text-base text-[#EDEDED] mb-2">Task Name</label>
                        <input 
                            type="text" 
                            name="description" 
                            required
                            placeholder="Enter task name..."
                            class="w-full h-[47px] px-4 bg-[#2A2A2A] border border-[#444444] rounded-lg text-[#EDEDED] text-sm font-space placeholder-[#EDEDED]/50 focus:outline-none focus:border-btn-primary transition-colors"
                        />
                    </div>
                    
                    <!-- Priority -->
                    <div>
                        <label class="block font-space text-base text-[#EDEDED] mb-2">Priority</label>
                        <div class="relative">
                            <select 
                                name="priority"
                                class="w-full h-[49px] px-4 bg-[#2A2A2A] border border-[#444444] rounded-lg text-[#EDEDED] text-sm font-space focus:outline-none focus:border-btn-primary transition-colors appearance-none cursor-pointer"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium" selected>Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <!-- Dropdown Arrow -->
                            <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" viewBox="0 0 16 16" fill="none">
                                <path d="M4 6L8 10L12 6" stroke="#EDEDED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    
                    <!-- Due Date -->
                    <div>
                        <label class="block font-space text-base text-[#EDEDED] mb-2">Due Date</label>
                        <style>
                            input[type="date"]::-webkit-calendar-picker-indicator {
                                display: none;
                            }
                        </style>
                        <input 
                            type="date" 
                            name="dueDate"
                            placeholder="MM/DD/YYYY"
                            class="w-full h-[47px] px-4 bg-[#2A2A2A] border border-[#444444] rounded-lg text-[#EDEDED] text-sm font-space placeholder-[#EDEDED]/50 focus:outline-none focus:border-btn-primary transition-colors"
                        />
                    </div>
                    
                    <!-- Submit Button -->
                    <div class="pt-4">
                        <button 
                            type="submit"
                            class="w-full h-[47px] bg-[#4A4A4A] border border-[#555555] rounded-lg text-[#EDEDED] text-sm font-space text-center hover:opacity-80 transition-opacity disabled:opacity-50"
                        >
                            Add Task
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
    const closeBtn = document.getElementById('closeModalBtn');
    
    // Submit form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const taskData = Object.fromEntries(formData);
        
        // Convert date format from yyyy-mm-dd to dd/mm/yyyy
        if (taskData.dueDate) {
            const [year, month, day] = taskData.dueDate.split('-');
            taskData.dueDate = `${day}/${month}/${year}`;
        } else {
            // Set default to current date if empty
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            taskData.dueDate = `${day}/${month}/${year}`;
        }
        
        await addTask(taskData);
        modal.remove();
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // ESC key to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Focus first input
    setTimeout(() => {
        form.querySelector('input[name="description"]').focus();
    }, 100);
}

/**
 * Edit task
 */
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Convert date from dd/mm/yyyy to yyyy-mm-dd for input type="date"
    let dateValue = '';
    if (task.dueDate) {
        const [day, month, year] = task.dueDate.split('/');
        dateValue = `${year}-${month}-${day}`;
    }
    
    // Create modal HTML with edit form
    const modalHTML = `
        <div id="editModal" class="fixed inset-0 bg-black/60 backdrop-blur-[10px] flex items-center justify-center z-50 animate-fadeIn">
            <div class="relative bg-[#3A3A3A] border border-[#444444] rounded-[20px] w-[660px] shadow-2xl animate-slideUp">
                
                <!-- Header -->
                <div class="relative h-[69px] flex items-center justify-center border-b border-[#444444]">
                    <h2 class="font-space text-2xl text-[#EDEDED] text-center">Edit Task</h2>
                    
                    <!-- Close Button -->
                    <button 
                        id="closeEditModalBtn"
                        class="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
                    >
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="#999999" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Form Content -->
                <form id="editTaskForm" class="px-6 py-6 space-y-6">
                    
                    <!-- Task Name -->
                    <div>
                        <label class="block font-space text-base text-[#EDEDED] mb-2">Task Name</label>
                        <input 
                            type="text" 
                            name="description" 
                            required
                            value="${escapeHtml(task.description || task.title || '')}"
                            placeholder="Enter task name..."
                            class="w-full h-[47px] px-4 bg-[#2A2A2A] border border-[#444444] rounded-lg text-[#EDEDED] text-sm font-space placeholder-[#EDEDED]/50 focus:outline-none focus:border-btn-primary transition-colors"
                        />
                    </div>

                    <!-- Priority -->
                    <div>
                        <label class="block font-space text-base text-[#EDEDED] mb-2">Priority</label>
                        <div class="relative">
                            <select 
                                name="priority"
                                class="w-full h-[49px] px-4 bg-[#2A2A2A] border border-[#444444] rounded-lg text-[#EDEDED] text-sm font-space focus:outline-none focus:border-btn-primary transition-colors appearance-none cursor-pointer"
                            >
                                <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low Priority</option>
                                <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium Priority</option>
                                <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High Priority</option>
                            </select>
                            <!-- Dropdown Arrow -->
                            <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" viewBox="0 0 16 16" fill="none">
                                <path d="M4 6L8 10L12 6" stroke="#EDEDED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    
                    <!-- Due Date -->
                    <div>
                        <label class="block font-space text-base text-[#EDEDED] mb-2">Due Date</label>
                        <style>
                            input[type="date"]::-webkit-calendar-picker-indicator {
                                display: none;
                            }
                        </style>
                        <input 
                            type="date" 
                            name="dueDate"
                            value="${dateValue}"
                            placeholder="MM/DD/YYYY"
                            class="w-full h-[47px] px-4 bg-[#2A2A2A] border border-[#444444] rounded-lg text-[#EDEDED] text-sm font-space placeholder-[#EDEDED]/50 focus:outline-none focus:border-btn-primary transition-colors"
                        />
                    </div>
                    
                    <!-- Submit Button -->
                    <div class="pt-4">
                        <button 
                            type="submit"
                            id="saveTaskBtn"
                            class="w-full h-[47px] bg-[#4A4A4A] border border-[#555555] rounded-lg text-[#EDEDED] text-sm font-space text-center hover:opacity-80 transition-all disabled:opacity-50"
                        >
                            Save Changes
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Attach event listeners
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editTaskForm');
    const closeBtn = document.getElementById('closeEditModalBtn');
    const saveBtn = document.getElementById('saveTaskBtn');
    
    // Store original values for change detection
    const originalValues = {
        description: task.description || task.title || '',
        priority: task.priority || 'medium',
        dueDate: dateValue
    };
    
    // Track changes and highlight save button
    let hasChanges = false;
    
    function checkForChanges() {
        // Check if form still exists in DOM
        if (!document.body.contains(form)) {
            return;
        }
        
        const descInput = form.querySelector('[name="description"]');
        const priorityInput = form.querySelector('[name="priority"]');
        const dateInput = form.querySelector('[name="dueDate"]');
        
        // Check if all inputs exist
        if (!descInput || !priorityInput || !dateInput) {
            return;
        }
        
        const currentValues = {
            description: descInput.value,
            priority: priorityInput.value,
            dueDate: dateInput.value
        };
        
        hasChanges = JSON.stringify(originalValues) !== JSON.stringify(currentValues);
        
        if (hasChanges) {
            saveBtn.classList.add('!bg-btn-primary', 'border-btn-primary', 'scale-[1.02]');
            saveBtn.classList.remove('bg-[#4A4A4A]', 'border-[#555555]');
        } else {
            saveBtn.classList.remove('!bg-btn-primary', 'border-btn-primary', 'scale-[1.02]');
            saveBtn.classList.add('bg-[#4A4A4A]', 'border-[#555555]');
        }
    }
    
    // Add change listeners to all inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', checkForChanges);
        input.addEventListener('change', checkForChanges);
    });
    
    // Submit form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!hasChanges) {
            showNotification('No changes to save', 'info');
            return;
        }
        
        const formData = new FormData(form);
        const taskData = Object.fromEntries(formData);
        
        // Convert date format from yyyy-mm-dd to dd/mm/yyyy
        if (taskData.dueDate) {
            const [year, month, day] = taskData.dueDate.split('-');
            taskData.dueDate = `${day}/${month}/${year}`;
        }
        
        // Update task via API
        try {
            const response = await fetch(`/api/tasks/${taskId}/edit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            
            if (response.ok) {
                await fetchTasks();
                showNotification('Task updated successfully!', 'success');
                modal.remove();
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            showNotification('Failed to update task', 'error');
        }
    });
    
    // ESC key to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Close button
    closeBtn.addEventListener('click', () => {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    });
    
    // Focus first input
    setTimeout(() => {
        form.querySelector('input[name="description"]').focus();
        form.querySelector('input[name="description"]').select();
    }, 100);
}

/**
 * Delete task
 */
function showDeleteConfirmModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const confirmDeleteModal = `
        <div id="confirmDeleteModal" class="fixed inset-0 bg-black/60 backdrop-blur-[10px] flex items-center justify-center z-50 animate-fadeIn">
            <div class="relative bg-[#3A3A3A] border border-[#444444] rounded-[20px] w-[660px] shadow-2xl animate-slideUp">
                
                <!-- Header -->
                <div class="relative h-[69px] flex items-center justify-center border-b border-[#444444]">
                    <h2 class="font-space text-2xl text-[#EDEDED] text-center">Delete Task</h2>
                </div>
                
                <!-- Content -->
                <div class="px-6 py-8">
                    
                    <!-- Warning Message -->
                    <div class="mb-8">
                        <p class="font-space text-base text-[#EDEDED] text-center leading-relaxed">
                            Are you sure you want to delete the task:<br>
                            <span class="text-white font-semibold text-lg mt-2 inline-block">"${escapeHtml(task.description || task.title || 'Untitled Task')}"</span>
                        </p>
                        <p class="font-space text-sm text-[#ff0000] text-center mt-4">
                            This action cannot be undone.
                        </p>
                    </div>
                    
                    <!-- Buttons -->
                    <div class="flex gap-5">
                        <button 
                            id="cancelDeleteBtn"
                            class="flex-1 h-[47px] bg-[#4A4A4A] border border-[#555555] rounded-lg text-[#EDEDED] text-sm font-space text-center hover:opacity-80 transition-opacity"
                        >
                            Cancel
                        </button>
                        <button 
                            id="confirmDeleteBtn"
                            class="flex-1 h-[47px] bg-[#E59046] border border-[#E59046] rounded-lg text-white text-sm font-space text-center hover:opacity-80 transition-opacity"
                        >
                            Delete
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.insertAdjacentHTML('beforeend', confirmDeleteModal);
    
    // Attach event listeners
    const modal = document.getElementById('confirmDeleteModal');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    // ESC key to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Close modal function
    const closeModal = () => {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
    };
    
    // Confirm delete
    confirmBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/tasks/${taskId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                await fetchTasks();
                showNotification('Task deleted successfully!', 'success');
                closeModal();
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            showNotification('Failed to delete task', 'error');
        }
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', closeModal);
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
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
