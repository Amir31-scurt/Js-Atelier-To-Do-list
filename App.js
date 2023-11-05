let TaskInput = document.getElementById("tache");
let DateInput = document.getElementById("Date");
let CommentInput = document.getElementById("comments");
let tasks = document.getElementById("tasks");
const button = document.getElementById('button');
button.setAttribute('disabled', '');
function enableButton() {
    const taskValue = TaskInput.value;
    const dateValue = DateInput.value;

    if (taskValue.length > 3 && dateValue.length > 3) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', '');
    }
}

TaskInput.addEventListener("input", enableButton);
DateInput.addEventListener("input", enableButton);

window.addEventListener("load", () => {
    tasks.innerHTML = localStorage.getItem("TasksStorage") || "";
});

function TaskToLocStor() {
    localStorage.setItem("TasksStorage", tasks.innerHTML);
}
function AddToBoard(){     
    // insert tasks;
    tasks.innerHTML += `
    <div class="bg-success bg-opacity-25 border border-success border-2 border-opacity-50 rounded p-1 d-grid gap-3">
        <span class="fw-bold text-">${TaskInput.value}</span>
        <span class="text-secondary small">${DateInput.value}</span>
        <p class="m-0 p-0">${CommentInput.value}</p>
        <span class="option justify-content-center d-flex gap-4">
            <i class="fa-solid fa-pen-to-square fs-5" id="edit" onclick="Modify(this)" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
            <i class="fa-solid fa-trash-alt fs-5" id="delete" onclick="Delete(this)" style="cursor: pointer;"></i>
        </span>
    </div>`;

    TaskToLocStor()

    TaskInput.value = "";
    DateInput.value = "";
    CommentInput.value = "";
    enableButton();
}
// Delete Task
function Delete (e){
    e.parentElement.parentElement.remove();
    const tk = "TasksStorage";
    localStorage.removeItem(tk);
    TaskToLocStor();
}
// Modify Task
function Modify(e){
    e.parentElement.parentElement.remove(); 
    CommentInput.value = e.parentElement.previousElementSibling.innerHTML;
    DateInput.value = e.parentElement.previousElementSibling.previousElementSibling.innerHTML;
    TaskInput.value = e.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
    enableButton();
    TaskToLocStor();
}