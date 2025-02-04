// select all DOM elements
const taskCount = document.getElementById("taskCount");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const clearAll = document.getElementById("clearAll");
const filters = document.querySelectorAll(".filter-btn");
const taskList = document.getElementById("taskList");

//create  a task array
let tasks = [];

// function to add a task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

// create a task object
    const task = {
        text: taskText,
        completed: false,
        id: Date.now(), // unique ID for task
    };

// add task to the array
    tasks.push(task);
    taskInput.value = "";
    
// update UI and store data
    renderTasks();
    updateLocalStorage();
}

// add event to the add button
addBtn.addEventListener("click", addTask);

// function to render tasks
function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    
    const filteredTasks = tasks.filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });
// loop through tasks and html for each (for filter each task )
    filteredTasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";
        taskItem.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${task.completed ? "checked" : ""}
                data-id="${task.id}"
            >
            <span class="task-text ${task.completed ? "completed" : ""}">
                ${task.text}
            </span>
            <button class="delete-btn" data-id="${task.id}">X</button>
        `;
        taskList.appendChild(taskItem);
    });
// update task count
    taskCount.textContent = tasks.length;
}

// Ffunctionality to mark a task as completed
function toggleTaskCompletion(taskId) {
    const task = tasks.find((task) => task.id === taskId); // find the task
    if (task) {
        task.completed = !task.completed; // completion status
        renderTasks();
        updateLocalStorage();
    }
}
//event deletation for checkbox
taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("checkbox")) {
        const taskId = Number(e.target.getAttribute("data-id"));
        toggleTaskCompletion(taskId);
    }
});

// functionality to delete
function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId); //remove the task and render
    renderTasks();
    updateLocalStorage(); 
}

// add event for delete button
taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const taskId = Number(e.target.getAttribute("data-id"));
        deleteTask(taskId);
    }
});

// add event for all filter
filters.forEach((filterBtn) => {
    filterBtn.addEventListener("click", () => {
        filters.forEach((btn) => btn.classList.remove("active"));
        filterBtn.classList.add("active");
        const filter = filterBtn.getAttribute("data-filter");
        renderTasks(filter);
    });
});

//functionality for all completed task
clearAll.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed); // keep only active tasks
    renderTasks();
    updateLocalStorage();
});

//store local storage , task arrey --> json string
function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// load tasks on page load
function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

//  call loadTasks when page loads
window.addEventListener("load", loadTasks);