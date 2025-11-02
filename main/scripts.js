document.querySelectorAll(".task-item").forEach(item => item.addEventListener("click", function() {
    showTaskDetails(this);
}));

document.querySelectorAll(".delete-btn").forEach(button => button.addEventListener("click", function(event) {
    event.stopPropagation();
    const taskItem = this.closest(".task-item");
    taskItem.remove();
}));

const showTaskDetails = (taskElement) => {
    const overlay = document.querySelector(".overlay")
    overlay.style.display = "block";
    const taskWindow = document.createElement("div");
    taskWindow.classList.add("show-task-modal");

    taskWindow.innerHTML = `
        <div class="task-window">
            <h2>Task Details</h2>
            <p>${taskElement.innerText}</p>
            <button class="close-btn">Close</button>
        </div>
    `;

    overlay.appendChild(taskWindow);

    taskWindow.querySelector(".close-btn").addEventListener("click", function() {
        overlay.style.display = "none";
        taskWindow.remove();
    });
}

document.getElementById("add-task-button").addEventListener("click", function() {
    const overlay = document.querySelector(".overlay")
    overlay.style.display = "block";

    const addTaskWindow = document.createElement("div");
    addTaskWindow.classList.add("add-task-modal");

    addTaskWindow.innerHTML = ` 
        <div class="task-window">
            <h2>Add New Task</h2>
            <input type="text" class="new-task-input" placeholder="Task description">
            <button class="save-task-btn">Save Task</button>
            <button class="close-btn">Close</button>
        </div>
    `;
    overlay.appendChild(addTaskWindow);

    addTaskWindow.querySelector(".save-task-btn").addEventListener("click", function() {
        const todoList = document.querySelector(".to-do-list");

        const new_task = document.createElement("li");
        new_task.classList.add("task-item");
        new_task.innerHTML = `
            <input type="checkbox" class="task-checkbox"/> ${addTaskWindow.querySelector(".new-task-input").value}
            <button class="edit-btn"><i class="ti-pencil"></i></button>
            <button class="delete-btn"><i class="ti-trash"></i></button>
        `;

        new_task.addEventListener("click", function() {
            showTaskDetails(this);
        });

        todoList.appendChild(new_task);

        overlay.style.display = "none";
        addTaskWindow.remove();
    });

    addTaskWindow.querySelector(".close-btn").addEventListener("click", function() {
        overlay.style.display = "none";
        addTaskWindow.remove();
    });
});

