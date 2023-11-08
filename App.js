let TaskInput = document.getElementById("tache");
let DateInput = document.getElementById("Date");
let CommentInput = document.getElementById("comments");
let tasks = document.getElementById("tasks");
let ToDoTasks = [];
const button = document.getElementById('button');
button.setAttribute('disabled', '');
const modal = document.getElementById("Modal");

function AddTask() {
    modal.style.display = 'block';
    TaskInput.focus();
}

function CloseAdd() {
    modal.style.display = 'none';
}

function enableButton() {
    const taskValue = TaskInput.value;
    const dateValue = DateInput.value;

    if (taskValue.length > 3 && dateValue.length > 3) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', 'true');
    }
}

TaskInput.addEventListener("input", enableButton);
DateInput.addEventListener("input", enableButton);

function AddToLclStr() {
    localStorage.setItem("TasksStorage", JSON.stringify(ToDoTasks));
}

function AddToBoard() {
    const Todo = {
        id: Math.floor(Math.random() * 1024) + 1,
        task: TaskInput.value,
        date: DateInput.value,
        comment: CommentInput.value
    };
    // Convert tasks details to an array
    ToDoTasks.push(Todo);

    // Save to local storage
    AddToLclStr();

    // Close modal
    CloseAdd();

    // Insert tasks
    tasks.innerHTML += `
    <li class="bg-success bg-opacity-25 border border-success border-2 border-opacity-50 rounded p-1 d-grid gap-3" id="tsk">
        <span class="fw-bold ${Todo.id}">${Todo.task}</span>
        <span class="text-secondary small">${Todo.date}</span>
        <p class="m-0 p-0">${Todo.comment}</p>
        <span class="option justify-content-center d-flex gap-4">
            <i class="fa-solid fa-pen-to-square fs-5" id="edit" onclick="Modify(this)" style="cursor: pointer;"></i>
            <i class="fa-solid fa-trash-alt fs-5" id="delete" onclick="Delete(this)" style="cursor: pointer;"></i>
            <div class="chkd">
                <i class="fa-solid fa-check fs-5" id="delete" onclick="Checked(this)" style="cursor: pointer;"></i>
                <button id="archiveButton" onclick="ArchiveCompletedTasks()">Archive Completed Tasks</button>
            </div>
        </span>
    </li>`;

    TaskInput.value = "";
    DateInput.value = "";
    CommentInput.value = "";
    enableButton();
}

window.addEventListener("load", () => {
    const storedTasks = localStorage.getItem("TasksStorage");
    if (storedTasks) {
        ToDoTasks = JSON.parse(storedTasks);
        for (const task of ToDoTasks) {
            tasks.innerHTML += `
            <li class="bg-success bg-opacity-25 border border-success border-2 border-opacity-50 rounded p-1 d-grid gap-3" id="tsk">
                <span class="fw-bold ${task.id}">${task.task}</span>
                <span class="text-secondary small">${task.date}</span>
                <p class="m-0 p-0">${task.comment}</p>
                <span class="option justify-content-center d-flex gap-4">
                    <i class="fa-solid fa-pen-to-square fs-5" id="edit" onclick="Modify(this)" style="cursor: pointer;"></i>
                    <i class="fa-solid fa-trash-alt fs-5" id="delete" onclick="Delete(this)" style="cursor: pointer;"></i>
                    <div class="chkd">
                        <i class="fa-solid fa-check fs-5" id="delete" onclick="Checked(this)" style="cursor: pointer;"></i>
                        <button id="archiveButton" onclick="ArchiveCompletedTasks()">Archive Completed Tasks</button>
                    </div>
                </span>
            </li>`;
        }
    }
});

// Delete Task
function Delete(e) {
    // Identify the element by ID
    const taskId = e.parentElement.parentElement.querySelector('.fw-bold').classList[1];
    // Filter elements that don't have the same ID as the selected task
    ToDoTasks = ToDoTasks.filter(task => task.id !== parseInt(taskId));
    // Update the Local Storage
    AddToLclStr();
    // Delete the task from the DOM
    e.parentElement.parentElement.remove();
}

function Modify(e){
    // Identify the element by ID
    const taskId = e.parentElement.parentElement.querySelector('.fw-bold').classList[1];
    const taskToModify = ToDoTasks.find(task => task.id === parseInt(taskId));

    // Open Modal to Add Task
    AddTask();
    TaskInput.value = taskToModify.task;
    DateInput.value = taskToModify.date;
    CommentInput.value = taskToModify.comment;
    enableButton();
    // Remove the task from the array and from the DOM
    ToDoTasks = ToDoTasks.filter(task => task.id !== parseInt(taskId));
    e.parentElement.parentElement.remove();
    
    // Update local storage with the modified ToDoTasks array
    AddToLclStr();
}

function Checked(e) {
    e.parentElement.parentElement.parentElement.classList.add("done");
    const taskId = e.parentElement.parentElement.querySelector('.fw-bold').classList[1];
    const taskIndex = ToDoTasks.findIndex(task => task.id === Number(taskId));

    if (taskIndex !== -1) {
        ToDoTasks[taskIndex].completed = true;

        // Update local storage with the modified ToDoTasks array
        AddToLclStr();
    }
}

function ArchiveTasks() {
    // Get all task elements with the "done" class
    const completedTaskElements = document.querySelectorAll(".done");

    // Create an array to store completed tasks
    const completedTasks = [];

    completedTaskElements.forEach(taskElement => {
        const taskId = taskElement.querySelector('.fw-bold').classList[1];
        const task = ToDoTasks.find(task => task.id === Number(taskId));

        if (task) {
            // Add the task to the completedTasks array
            completedTasks.push(task);

            // Remove the task from the ToDoTasks array
            ToDoTasks = ToDoTasks.filter(t => t.id !== task.id);
        }

        // Remove the task element from the DOM
        taskElement.remove();
    });

    // Update local storage with the modified ToDoTasks array
    AddToLclStr();

    // Store the completed tasks in the "ArchivedTasksStorage"
    AddToArchivedStorage(completedTasks);
}