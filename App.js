// HTML element references
let TaskInput = document.getElementById("tache");
let DateInput = document.getElementById("Date");
let CommentInput = document.getElementById("comments");
let tasks = document.getElementById("tasks");
let archivedTasks = document.getElementById("archivedTasks");
let ToDoTasks = [];
let ArchivedTask = [];
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
        comment: CommentInput.value,
        statut : false,
        archive : false
    };

    ToDoTasks.push(Todo);
    AddToLclStr();
    CloseAdd();

    tasks.innerHTML += `
    <li class="NewTask bg-success bg-opacity-25 border border-success border-2 border-opacity-50 rounded p-1 d-grid gap-3" id="tsk">
        <span class="fw-bold ${Todo.id} ${Todo.statut}" id="task"><input class="inp" readonly value="${Todo.task}"/></span>
        <span class="text-secondary small" id="date"><input type="date" class="inpDate" disabled value="${Todo.date}"/></span>
        <p class="m-0 p-0" id="comment"><input type="text" readonly class="inpComment" value="${Todo.comment}"/></p>
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

// Load tasks from local storage when the page is loaded
window.addEventListener("load", load);

function load() {
    const storedTasks = localStorage.getItem("TasksStorage");

    if (storedTasks) { 
        ToDoTasks = JSON.parse(storedTasks);

        for (const task of ToDoTasks) {
            tasks.innerHTML += `
            <li class="loadTasks bg-success bg-opacity-25 border border-success border-2 border-opacity-50 rounded p-1 d-grid gap-3" id="tsk">
                <span class="fw-bold ${task.id} ${task.statut}" id="task"><input class="inp" readonly value="${task.task}"/></span>
                <span class="text-secondary small" id="date"><input type="date" class="inpDate" disabled value="${task.date}"/></span>
                <p class="m-0 p-0" id="comment"><input type="text" readonly class="inpComment" value="${task.comment}"/></p>
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
    addDoneClassToTasks();
    HideArchivedTask();
}
function addDoneClassToTasks() {
    const tasksList = document.querySelectorAll('.loadTasks');

    tasksList.forEach(taskElement => {
        const taskId = taskElement.querySelector('.fw-bold').classList[1];
        const task = ToDoTasks.find(task => task.id === parseInt(taskId));

        if (task && task.statut === true) {
            taskElement.querySelector('.op1').classList.add('done');
            const newClass = taskElement.querySelector('.op1').parentElement;
            const archbtn = `
                <div class="btns arch d-flex gap-3 justify-content-center">
                    <button class="btn btn-success btn-sm" id="archiveButton" onclick="ArchiveTask(this)">
                        <i>Archiver</i>
                    </button>
                </div>`;
            newClass.innerHTML += archbtn;
        }
    });
}
function HideArchivedTask() {
    const tasksList = document.querySelectorAll('.loadTasks');

    tasksList.forEach(taskElement => {
        const taskId = taskElement.querySelector('.fw-bold').classList[1];
        const task = ToDoTasks.find(task => task.id === parseInt(taskId));

        if (task && task.archive === true) {
            taskElement.classList.add('d-none');
            archivedTasks.innerHTML += `
            <li class="ArchiveLoad bg-danger bg-opacity-25 border border-danger border-2 border-opacity-50 rounded p-1 d-grid gap-3" id="tsk">
                <span class="fw-bold ${task.id} ${task.statut}" id="task"><input class="inp" readonly value="${task.task}"/></span>
                <span class="text-secondary small" id="date"><input type="date" class="inpDate" disabled value="${task.date}"/></span>
                <p class="m-0 p-0" id="comment"><input type="text" readonly class="inpComment" value="${task.comment}"/></p>
                <div class="option justify-content-between d-flex gap-4 align-items-center">
                    <div class="op1 d-flex gap-3 justify-content-center">
                        <i class="fa-solid fa-trash-alt fs-5" id="delete" onclick="Delete(this)" style="cursor: pointer;"></i>
                    </div>
                </div>
            </li>`;
        }
    });
}
function showArch(){
    const archlist = document.querySelector(".archived").classList;
    if(!archlist.contains("d-none")){
        archlist.add("d-none");
        document.querySelector(".ShowAndHide").textContent = "Show Archived Tasks";
    }
    else{
        archlist.remove("d-none");
        document.querySelector(".ShowAndHide").textContent = "Hide Archived Tasks";
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
    const toSelect = e.parentElement.parentElement.parentElement;
    toSelect.querySelector('.inp').removeAttribute("readonly");
    toSelect.querySelector('.inpDate').removeAttribute("disabled");
    toSelect.querySelector('.inpComment').removeAttribute("readonly");

    // create div and buttons for modification and Cancellation
    const DivButtonModify = document.createElement("div");
    e.parentElement.parentElement.appendChild(DivButtonModify);
    DivButtonModify.classList.add("Spicy");

    // Save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Modifier";
    DivButtonModify.appendChild(saveButton);
    saveButton.classList.add("save_Button");

    // Cancel button
    const CancelButton = document.createElement("button");
    CancelButton.textContent = "Annuler";
    DivButtonModify.appendChild(CancelButton);
    CancelButton.classList.add("Cancel_Button");

    // Disable modify and Check Button
    e.parentElement.querySelector("#edit").classList.add("locked");
    e.parentElement.querySelector(".chkd").classList.add("locked");

    // Modify button function
    saveButton.addEventListener("click", () =>{
        const newTaskValue = toSelect.querySelector('.inp').value;
        const newDateValue = toSelect.querySelector('.inpDate').value;
        const newCommentValue = toSelect.querySelector('.inpComment').value;

        if (newTaskValue !== taskToModify.task || newDateValue !== taskToModify.date || newCommentValue !== taskToModify.comment) {
            // Update the task details if there are modifications
            taskToModify.task = newTaskValue;
            taskToModify.date = newDateValue;
            taskToModify.comment = newCommentValue;

            // Update local storage with the modified ToDoTasks array
            AddToLclStr();
            
            saveButton.style.display = "none";
            e.parentElement.querySelector("#edit").classList.remove("locked");
            location.reload();
        }
    })

    // Cancel Function
    CancelButton.addEventListener("click", () => {
        AddToLclStr();
        location.reload();
    })
}
function Checked(e) {
    const taskId = e.parentElement.parentElement.parentElement.parentElement.querySelector('.fw-bold').classList[1];
    const taskToCheck = ToDoTasks.find(task => task.id === parseInt(taskId));

    if (taskToCheck) {
        taskToCheck.statut = true;
        taskToCheck.task += ` ✓`;
        AddToLclStr();
        location.reload();
    }
}

function ArchiveTask(e) {
    const taskId = e.parentElement.parentElement.parentElement.querySelector('.fw-bold').classList[1];
    console.log(taskId);
    const taskToCheck = ToDoTasks.find(task => task.id === parseInt(taskId));
    if (taskToCheck) {
        taskToCheck.archive = true;
        taskToCheck.task += ` Archivée`;
        AddToLclStr();
        location.reload();
    }

  /*const taskData = {
    id: taskId,
    task: taskElement.querySelector(".fw-bold").textContent,
    date: taskElement.querySelector(".text-secondary").textContent,
    comment: taskElement.querySelector(".m-0").textContent,
  };
    const taskToUpdate = ToDoTasks.find(task => task.id === parseInt(taskId));
    if (taskElement.textContent.contains("Terminée")) {
    taskToUpdate.task += " - Archivée";

    // Save changes to local storage
    AddToLclStr();
    }
  taskElement.remove();*/
}

addDoneClassToTasks();
HideArchivedTask()