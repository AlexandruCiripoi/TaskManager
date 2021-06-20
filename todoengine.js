import { Task, TaskList } from "./classes.js";
import { categories } from "./settings.js";

let taskListObject=new TaskList();
taskListObject.readFromLocalStorage();
taskListObject.putCardsToDivByState();


/* ============ get the fields from ADD/EDIT task modal window ============ */
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


/* ============ Event listeners ============ */
/* If user clicked on Add button in Add-new-task modal window */
btnSaveNewTask.addEventListener('click',btnClickAddNewTask);
btnShowModalAddNewTask.addEventListener('click',showModalAddNewTask);
btnDeleteTask.addEventListener('click',btnClickDeleteTask);
btnEditTask.addEventListener('click',btnClickSaveEditedTask);
btnAccordion.addEventListener('click',btnAccordionClick)

function btnAccordionClick() {
    if (!btnSaveNewTask.classList.contains('d-none') && dateStartField.value=="" && timeStartField.value=="" && dateEndField.value=="" && timeEndField.value==""){ //if modal show ADD window
        const dateTimeNow = (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))).toISOString();
        dateStartField.value = dateTimeNow.slice(0,10);
        timeStartField.value = dateTimeNow.slice(11,16);
        dateEndField.value = dateTimeNow.slice(0,10);
        timeEndField.value = dateTimeNow.slice(11,16);
    }
}

function showModalAddNewTask() {
    toggleAddModal('add');
    timeAccordion.classList.remove('show'); //close accordion
    captionField.value = "";
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
function btnClickEditTask(taskID) {
    // console.log('editTask',taskID);
    /* you can edit task list by 
    taskList[taskID].caption = "new caption";
    taskList[taskID].description = "new description";
    and so on...!
    or fill up elements on the page by
    captionField.value = 'some caption';

    modalWindowAddNewTask.toggle() - call it to toggle modal
    */
    toggleAddModal('edit');
    if (taskList[taskID].dateStart != "" || taskList[taskID].timeStart != "" ||taskList[taskID].timeEnd != "" ||taskList[taskID].dateEnd != ""){
        timeAccordion.classList.add('show');
        if (btnAccordion.classList.contains('collapsed'))btnAccordion.classList.remove('collapsed');
    }else{
        timeAccordion.classList.remove('show')
        if (!btnAccordion.classList.contains('collapsed'))btnAccordion.classList.add('collapsed');
    }
    captionField.value = taskList[taskID].caption;
    descriptionField.value = taskList[taskID].description;
    dateStartField.value = taskList[taskID].dateStart;
    timeStartField.value = taskList[taskID].timeStart;
    timeEndField.value = taskList[taskID].timeEnd;
    dateEndField.value = taskList[taskID].dateEnd;
    categoriesDropDown.value = taskList[taskID].category;
    currentStateHidden.value = taskList[taskID].currentState;
    taskIDHidden.value = taskID;
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
/* function called when a ADD button pressed */
function btnClickAddNewTask() {
  const taskToAdd = new Task(captionField.value,captionField.value,dateStartField.value,timeStartField.value,dateEndField.value,timeEndField.value,categoriesDropDown.value)
  taskListObject.addNewTask(taskToAdd);
  modalWindowAddNewTask.toggle() //close modal window
};

function btnClickDeleteTask() {
  taskListObject.removeTask(taskIDHidden.value);
  modalWindowAddNewTask.toggle(); 
};

function btnClickSaveEditedTask() { 
  console.log('editing');
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
  taskListObject.editTask(taskIDHidden.value,newData);
  modalWindowAddNewTask.toggle();
}