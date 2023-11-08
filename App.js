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
        <div class="option justify-content-between d-flex gap-4 align-items-center">
            <div class="btns d-flex gap-3 justify-content-center">
                <button class="btn btn-success btn-sm" id="archiveButton" onclick="ArchiveTasks()"><i class="fa-solid fa-box-archive"></i></button>
            </div>
            <div class="op1 d-flex gap-3 justify-content-center">
                <i class="fa-solid fa-pen-to-square fs-5" id="edit" onclick="Modify(this)" style="cursor: pointer;"></i>
                <i class="fa-solid fa-trash-alt fs-5" id="delete" onclick="Delete(this)" style="cursor: pointer;"></i>
                <div class="chkd">
                    <i class="fa-solid fa-check fs-5" id="check" onclick="Checked(this)" style="cursor: pointer;"></i>
                </div>
            </div>
        </div>
    </li>`;

    TaskInput.value = "";
    DateInput.value = "";
    CommentInput.value = "";
    enableButton();
}
load();
function load(){
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
                    <div class="option justify-content-between d-flex gap-4 align-items-center">
                        <div class="btns d-flex gap-3 justify-content-center">
                            <button class="btn btn-success btn-sm" id="archiveButton" onclick="ArchiveTasks()"><i class="fa-solid fa-box-archive"></i></button>
                        </div>
                        <div class="op1 d-flex gap-3 justify-content-center">
                            <i class="fa-solid fa-pen-to-square fs-5" id="edit" onclick="Modify(this)" style="cursor: pointer;"></i>
                            <i class="fa-solid fa-trash-alt fs-5" id="delete" onclick="Delete(this)" style="cursor: pointer;"></i>
                            <div class="chkd">
                                <i class="fa-solid fa-check fs-5" id="check" onclick="Checked(this)" style="cursor: pointer;"></i>
                            </div>
                        </div>
                    </div>
                </li>`;
            }
        }
    });
}

// Delete Task
function Delete(e) {
    // Identify the element by ID
    const taskId = e.parentElement.parentElement.parentElement.querySelector('.fw-bold').classList[1];
    // Filter elements that don't have the same ID as the selected task
    ToDoTasks = ToDoTasks.filter(task => task.id !== parseInt(taskId));
    // Update the Local Storage
    AddToLclStr();
    // Delete the task from the DOM
    e.parentElement.parentElement.parentElement.remove();
}
// Modify Task
function Modify(e) {
    // Identify the element by ID
    const taskId = e.parentElement.parentElement.parentElement.querySelector('.fw-bold').classList[1];
    const taskToModify = ToDoTasks.find(task => task.id === parseInt(taskId));

    // Open the modal to edit the task
    AddTask();
    
    // Update the input fields with the task details
    TaskInput.value = taskToModify.task;
    DateInput.value = taskToModify.date;
    CommentInput.value = taskToModify.comment;
    enableButton();

    // Listen for changes to the task details
    TaskInput.addEventListener("input", enableButton);
    DateInput.addEventListener("input", enableButton);

    // Add a save button
    button.textContent = "Modifier";
    button.onclick = function() {
        // Check if there are modifications
        const newTaskValue = TaskInput.value;
        const newDateValue = DateInput.value;
        const newCommentValue = CommentInput.value;

        if (
            newTaskValue !== taskToModify.task ||
            newDateValue !== taskToModify.date ||
            newCommentValue !== taskToModify.comment
        ) {
            // Update the task details if there are modifications
            taskToModify.task = newTaskValue;
            taskToModify.date = newDateValue;
            taskToModify.comment = newCommentValue;

            // Update local storage with the modified ToDoTasks array
            AddToLclStr();

            // Close the modal
            CloseAdd();
            location.reload();
        }
    };
}


function Checked(e) {
    // Add the "done" class
    const TskElem = e.parentElement.parentElement.parentElement.parentElement;
    TskElem.classList.add("done");

    // Create an object to store the task's class list
    const TaskInLcl = {
        id: Math.floor(Math.random() * 1024) + 1,
        TskClass: Array.from(TskElem.classList)
    };

    // Retrieve the class list from the clicked task element
    const taskClassList = TaskInLcl.TskClass;

    // Identify the element by ID
    const taskId = e.parentElement.parentElement.parentElement.querySelector('.fw-bold').classList[1];
    const taskToModify = ToDoTasks.find(task => task.id === parseInt(taskId));

    // Retrieve the stored checked tasks from local storage
    const CheckedTasks = JSON.parse(localStorage.getItem("CheckedTask")) || [];

    // Add the new checked task to the existing array
    CheckedTasks.push(taskClassList);

    // Store the updated array in local storage
    localStorage.setItem("CheckedTask", JSON.stringify(CheckedTasks));

    // Clear the existing class list and apply the classes from the local storage
    TskElem.classList = "";
    TskElem.classList.add(...taskClassList);

    console.log(TskElem.classList);
}





function ArchiveTasks(e) {
    // Get all completed tasks from the state management system
    const completedTasks = stateManager.getCompletedTasks();

    completedTasks.forEach(task => {
        // Remove the task from the ToDoTasks array
        ToDoTasks = ToDoTasks.filter(t => t.id !== task.id);

        // Remove the task element from the DOM
        const taskElement = document.querySelector(`.${task.id}`);
        if (taskElement) {
            taskElement.remove();
        }
    });

    // Update local storage with the modified ToDoTasks array
    AddToLclStr();

    // Store the completed tasks in the "ArchivedTasksStorage"
    AddToArchivedStorage(completedTasks);
}