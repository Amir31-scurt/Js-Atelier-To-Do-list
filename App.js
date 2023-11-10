// HTML element references
let TaskInput = document.getElementById("tache");
let DateInput = document.getElementById("Date");
let CommentInput = document.getElementById("comments");
let tasks = document.getElementById("tasks");
let ToDoTasks = [];
const button = document.getElementById('button');
button.setAttribute('disabled', '');
const modal = document.getElementById("Modal");

// Open the task input modal
function AddTask() {
    modal.style.display = 'block';
    TaskInput.focus();
}

// Close the task input modal
function CloseAdd() {
    modal.style.display = 'none';
}

// Enable the button based on input values
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

// Save tasks to local storage
function AddToLclStr() {
    localStorage.setItem("TasksStorage", JSON.stringify(ToDoTasks));
}

// Add a new task to the task list
function AddToBoard() {
    const Todo = {
        id: Math.floor(Math.random() * 1024) + 1,
        task: TaskInput.value,
        date: DateInput.value,
        comment: CommentInput.value
    };

    ToDoTasks.push(Todo);
    AddToLclStr();
    CloseAdd();

    tasks.innerHTML += `
    <li class="NewTask bg-success bg-opacity-25 border border-success border-2 border-opacity-50 rounded p-1 d-grid gap-3" id="tsk">
        <span class="fw-bold ${Todo.id}" id="task">${Todo.task}</span>
        <span class="text-secondary small" id="date">${Todo.date}</span>
        <p class="m-0 p-0" id="comment">${Todo.comment}</p>
        <div class="option justify-content-between d-flex gap-4 align-items-center">
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

// Load tasks from local storage when the page is loaded
window.addEventListener("load", load);

function load() {
    const storedTasks = localStorage.getItem("TasksStorage");

    if (storedTasks) {
        ToDoTasks = JSON.parse(storedTasks);

        for (const task of ToDoTasks) {
            tasks.innerHTML += `
            <li class="loadTasks bg-success bg-opacity-25 border border-success border-2 border-opacity-50 rounded p-1 d-grid gap-3" id="tsk">
                <span class="fw-bold ${task.id}" id="task">${task.task}</span>
                <span class="text-secondary small" id="date">${task.date}</span>
                <p class="m-0 p-0" id="comment">${task.comment}</p>
                <div class="option justify-content-between d-flex gap-4 align-items-center">
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


let archbtn = `
  <div class="btns arch d-flex gap-3 justify-content-center">
    <button class="btn btn-success btn-sm" id="archiveButton" onclick="ArchiveTasks(this)">
      <i class="fa-solid fa-box-archive"></i>
    </button>
  </div>
`;

// Load archived tasks from local storage and apply necessary class changes
const archivedTasks = JSON.parse(localStorage.getItem("ArchivedTasks") || "[]");

archivedTasks.forEach((task) => {
  const taskElement = document.querySelector(`.fw-bold`);
  
  if (taskElement !== null) {
    taskElement.classList.add("archivedTask");
  }
});

// Load checked tasks from local storage and apply necessary class changes
const checkedTasks = localStorage.getItem("CheckedTasks") || "[]";

JSON.parse(checkedTasks).forEach((task) => {
  const taskElement = document.querySelector(`.fw-bold`);

  if (taskElement !== null) {
    taskElement.classList.add("checked");
  }
});

function Checked(e) {
  const taskElement = e.parentElement.parentElement;
  taskElement.classList.add("done");

  const newClass = taskElement.parentElement;
  newClass.innerHTML += archbtn;

  // Store the checked task in local storage
  const checkedTask = e.parentElement.parentElement.parentElement;
  localStorage.setItem(`CheckedTasks`, JSON.stringify(checkedTask.textContent));

  // Call the checkedTsk() function
  checkedTsk();
}

function ArchiveTasks(e) {
  const taskElement = e.parentElement.parentElement.parentElement.parentElement;
  taskElement.classList.add("archived");

  const taskId = taskElement.querySelector(".fw-bold").classList[1];
  const taskData = {
    id: taskId,
    task: taskElement.querySelector(".fw-bold").textContent,
    date: taskElement.querySelector(".text-secondary").textContent,
    comment: taskElement.querySelector(".m-0").textContent,
  };

  const archivedTasks = JSON.parse(localStorage.getItem("ArchivedTasks") || "[]");
  archivedTasks.push(taskData);

  localStorage.setItem("ArchivedTasks", JSON.stringify(archivedTasks));

  taskElement.remove();
}

function checkedTsk() {
  const done = [];

  const doneTaskElements = document.querySelectorAll(".done");
  done.push(...doneTaskElements);

  localStorage.setItem("StockChecked", JSON.stringify(done));
}