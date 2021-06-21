import { Task, TaskList } from "./classes.js"; //importing classes from another file - to keep everything clean
import { categories } from "./settings.js"; //importing settings from another file - to keep everything clean

let taskListObject=new TaskList([],editBtnListener,changeTaskStatusBtnListener);
//creating an instance of TaskList.
//1st parameter is an array of tasks (empty array at the moment)
//2nd parameter is a reference to a function that will be added as an EventListener for EDIT buttons on every task card
//3rd parameter is a reference to a function that will be added as an EventListener for buttons that change state of task
taskListObject.readFromLocalStorage(); //taskListObject has its own local storage
taskListObject.putCardsToDivByState(); //can create and put task-card-elements into DIVs that are specified in settings.


const captionField = document.getElementById('caption');
const descriptionField = document.getElementById('description');
const dateStartField = document.getElementById('dateStart');
const timeStartField = document.getElementById('timeStart');
const dateEndField = document.getElementById('dateEnd');
const timeEndField = document.getElementById('timeEnd');
const btnSaveNewTask = document.getElementById('btnSaveNewTask');
const addNewTaskLabel = document.getElementById('staticBackdropLabel'); //We will need to change this label
const btnEditTask = document.getElementById('btnEditTask'); //We will need to toggle "invisible" class on it and make a function to save changes when we press it
const btnDeleteTask = document.getElementById('btnDeleteTask');//We will need to toggle "invisible" class on it and make a function to delete task when we press it
const btnShowModalAddNewTask = document.getElementById('btnShowModalAddNewTask');//We will need to toggle "invisible" class on it and make a function to delete task when we press it
const currentStateHidden = document.getElementById('currentStateHidden');
const taskIDHidden = document.getElementById('taskIDHidden');
const timeAccordion = document.getElementById('flush-collapseOne');
const btnAccordion = document.getElementById('btnAccordion');
/* ============ pre-defined categories ============ */
/* categoriesDropDown menu on the page 
use categoriesDropDown.value OR parseInt(categoriesDropDown.value) to get the value */
const categoriesDropDown = document.getElementById('categoriesDropDown'); 
/* Populate categories on page */
for (let category in categories){
    categoriesDropDown.innerHTML+=`<option value="${category}">${categories[category]}</option>`;
}
/* ========================================================== */
/* ============ this const is used for opening and closing modal window ============ */
/* modalWindowAddNewTask.toggle() - to open amd close it */
const modalWindowAddNewTask = new bootstrap.Modal(document.getElementById('modalWindowAddNewTask'), {keyboard: false});


//If we will press User -> New project button (id=startNew)
//We will clear the taskListArray and local storage. (for now works only on taskcards page)
try {
    const startNew = document.getElementById('startNew');
    startNew.addEventListener('click',()=>{
        taskListObject.clearTasksAndLocalStorage();
    });
}
catch (e){
    console.log(e);
}



/* ============ Event listeners ============ */
/* If user clicked on Add button in Add-new-task modal window */
btnSaveNewTask.addEventListener('click',btnClickAddNewTask);
btnShowModalAddNewTask.addEventListener('click',showModalAddNewTask);
btnDeleteTask.addEventListener('click',btnClickDeleteTask);
btnEditTask.addEventListener('click',btnClickSaveEditedTask);
btnAccordion.addEventListener('click',btnAccordionClick)

function btnAccordionClick() { //if accordion was not open and there were no dates and times, it'll add current dates and times on accordion-opening
    if (!btnSaveNewTask.classList.contains('d-none') && dateStartField.value=="" && timeStartField.value=="" && dateEndField.value=="" && timeEndField.value==""){ //if modal show ADD window
        const dateTimeNow = (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))).toISOString();
        dateStartField.value = dateTimeNow.slice(0,10);
        timeStartField.value = dateTimeNow.slice(11,16);
        dateEndField.value = dateTimeNow.slice(0,10);
        timeEndField.value = dateTimeNow.slice(11,16);
    }
}

function showModalAddNewTask() { //Show modal window for adding a new task
    toggleAddModal('add');//There are 2 states of modal window. Now we need ADD
    timeAccordion.classList.remove('show'); //close accordion
    if (!btnAccordion.classList.contains('collapsed'))btnAccordion.classList.add('collapsed');//close accordion 2
    captionField.value = ""; //clear all values inside input elements
    descriptionField.value = "";
    dateStartField.value = "";
    timeStartField.value = "";
    dateEndField.value = "";
    timeEndField.value = "";
    categoriesDropDown.value = 0;
    currentStateHidden.value = 0;
    modalWindowAddNewTask.toggle(); //open modal window
}
/* ========================================================== */
/* ========================================================== */
/* If we click on Edit button this function will run */
function openModalEditWin(taskToEdit) {
    toggleAddModal('edit'); //There are 2 states of modal window. Now we need EDIT

    if (taskToEdit.dateStart || taskToEdit.timeStart || taskToEdit.timeEnd || taskToEdit.dateEnd){ //Prepare accordion - should we show or hide it
        console.log('datetime exist');
        timeAccordion.classList.add('show');
        if (btnAccordion.classList.contains('collapsed'))btnAccordion.classList.remove('collapsed');
    }else{
        timeAccordion.classList.remove('show')
        if (!btnAccordion.classList.contains('collapsed'))btnAccordion.classList.add('collapsed');
    }

    captionField.value = taskToEdit.caption;
    descriptionField.value = taskToEdit.description;
    dateStartField.value = taskToEdit.dateStart;
    timeStartField.value = taskToEdit.timeStart;
    timeEndField.value = taskToEdit.timeEnd;
    dateEndField.value = taskToEdit.dateEnd;
    categoriesDropDown.value = taskToEdit.category;
    currentStateHidden.value = taskToEdit.currentState;
    taskIDHidden.value = taskToEdit.id;
    modalWindowAddNewTask.toggle(); //open modal window
}
// toggleAddModal();
function toggleAddModal(action) {
    if (action==='edit'){
        // console.log('you pressed Edit');
        btnSaveNewTask.classList.add('d-none');
        btnEditTask.classList.remove('d-none');
        btnDeleteTask.classList.remove('d-none');
        addNewTaskLabel.innerText="Edit or delete task";
    }else if (action==='add'){
        btnSaveNewTask.classList.remove('d-none');
        btnEditTask.classList.add('d-none');
        btnDeleteTask.classList.add('d-none');
        addNewTaskLabel.innerText="Add a new task";
    }
}

//OBJ rewritten functions

//A reference to this function is added to every EDIT button as onClick
function editBtnListener(taskId) {
    openModalEditWin(taskListObject.getTaskData(taskId));
}
//A reference to this function is added to every button that changes state of the task (onClick)
function changeTaskStatusBtnListener(taskId,newState) {
    taskListObject.changeTaskState(taskId,newState) //I would call this directly, but I didn't manage to make a direct reference to THIS of current taskListObject
}

/* function called when a ADD button pressed */
function btnClickAddNewTask() {
  const taskToAdd = new Task(captionField.value,descriptionField.value,dateStartField.value,timeStartField.value,dateEndField.value,timeEndField.value,categoriesDropDown.value,0,editBtnListener,changeTaskStatusBtnListener);
  taskListObject.addNewTask(taskToAdd);
  modalWindowAddNewTask.toggle() //close modal window
  if (window.location.pathname.includes('index.html')){
    window.location.assign('./taskcards.html')
  }
};

function btnClickDeleteTask() {
  taskListObject.removeTask(taskIDHidden.value);
  modalWindowAddNewTask.toggle(); 
};

function btnClickSaveEditedTask() { 
  console.log('editing');
  //Prepare an Object with new data inside it and pass it to our taskListObject's function
  const newData = {
    caption:captionField.value, 
    description:descriptionField.value,
    dateStart:dateStartField.value,
    timeStart:timeStartField.value,
    dateEnd:dateEndField.value,
    timeEnd:timeEndField.value,
    category:parseInt(categoriesDropDown.value),
    currentState:parseInt(currentStateHidden.value),
  };
  taskListObject.editTask(taskIDHidden.value,newData); //passing to taskListObject
  modalWindowAddNewTask.toggle();
}