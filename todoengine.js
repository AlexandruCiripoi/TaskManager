/* variables */
let taskList={};
let theStorage = window.localStorage;
const dateObj = new Date();
// Use next
// const myList = JSON.parse(localStorage.getItem('list')) || []


/* ============ pre-defined categories ============ */
const categories = {
    0:'No category',
    1:'Learning',
    2:'Eating',
    3:'Exercises',
    4:'Important',
    5:'Not important',
};
/* categoriesDropDown menu on the page 
use categoriesDropDown.value OR parseInt(categoriesDropDown.value) to get the value */
const categoriesDropDown = document.getElementById('categoriesDropDown'); 
/* Populate categories on page */
for (let category in categories){
    categoriesDropDown.innerHTML+=`<option value="${category}">${categories[category]}</option>`;
}
/* ========================================================== */


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
/* ============ this const is used for opening and closing modal window ============ */
/* modalWindowAddNewTask.toggle() - to open amd close it */
const modalWindowAddNewTask = new bootstrap.Modal(document.getElementById('modalWindowAddNewTask'), {keyboard: false});

/* ============  DIVS to output data ============ */
const toDoDiv = document.getElementById('toDoDiv');
const inProgressDiv = document.getElementById('inProgressDiv');
const doneDiv = document.getElementById('doneDiv');
/* ========================================================== */


taskList=readFromLocalStorage(); //try to load data from local storage
showTaskList(taskList); //put the data to page


/* ============ Event listeners ============ */
/* If user clicked on Add button in Add-new-task modal window */
btnSaveNewTask.addEventListener('click',btnClickAddNewTask);
btnShowModalAddNewTask.addEventListener('click',showModalAddNewTask);
btnDeleteTask.addEventListener('click',btnClickDeleteTask);
btnEditTask.addEventListener('click',btnClickSaveEditedTask);
btnAccordion.addEventListener('click',btnAccordionClick)
/* listen to every click on the page and when we click on "special" buttons - call a function */
/* theese special buttons have dataset attributes */
document.addEventListener('click',function(e){
    if(e.target && e.target.dataset.btnType && e.target.dataset.taskId){
        if (e.target.dataset.btnType==='taskToProgress')btnClickMoveTaskToProgress(e.target.dataset.taskId);
        if (e.target.dataset.btnType==='editTask')btnClickEditTask(e.target.dataset.taskId);
        if (e.target.dataset.btnType==='taskBackToDo')btnClickMoveTaskBackToDo(e.target.dataset.taskId);
        if (e.target.dataset.btnType==='taskToDone')btnClickMoveTaskToDone(e.target.dataset.taskId);
      }
});
/* ========================================================== */

/* Functions */
function readFromLocalStorage() {
    console.log('Reading list from local storage.');
    const savedData = theStorage.getItem('TaskList'); 
    if (!savedData){
        console.log('No data in storage.');
        return {}
    }
    console.log('Data found.');
    return JSON.parse(savedData);
};

function saveListToLocalStorage(taskList) {
    theStorage.setItem('TaskList',JSON.stringify(taskList));
    console.log('List was saved to local storage.')
};



/* function called when "Change-Status" buttons pressed */
function btnClickMoveTaskToProgress(taskID) {
    taskList[taskID].currentState=1; //just set currentState of taskID in taskList to 1 (in progress)
    saveListToLocalStorage(taskList); //Save the tasklist to local storage
    showTaskList(taskList);//redraw all the items
};

function btnClickMoveTaskToDone(taskID) {
    taskList[taskID].currentState=2;//just set currentState of taskID in taskList to 2 (done)
    saveListToLocalStorage(taskList);//Save the tasklist to local storage
    showTaskList(taskList);//redraw all the items
};

function btnClickMoveTaskBackToDo(taskID) {
    taskList[taskID].currentState=0;//just set currentState of taskID in taskList to 0 (todo)
    saveListToLocalStorage(taskList);//Save the tasklist to local storage
    showTaskList(taskList);//redraw all the items
};

function btnClickDeleteTask() {
    
    deleteTaskFromList(taskIDHidden.value);
    saveListToLocalStorage(taskList);
    showTaskList(taskList);
    
    modalWindowAddNewTask.toggle(); 
};

function btnClickSaveEditedTask() {
    console.log('editing');
    taskList[taskIDHidden.value]={ /* 1. generating ID.  2. creating a new task inside the taskList obj */
        caption:captionField.value, //add Data (values) from inputs to task-object
        description:descriptionField.value,
        dateStart:dateStartField.value,
        timeStart:timeStartField.value,
        dateEnd:dateEndField.value,
        timeEnd:timeEndField.value,
        category:parseInt(categoriesDropDown.value),// category should be saved as a number, not a string
        currentState:0,
    };
    console.log(taskList);
    showTaskList(taskList);
    modalWindowAddNewTask.toggle();
}

function btnAccordionClick() {
    if (!btnSaveNewTask.classList.contains('d-none') && dateStartField.value=="" && timeStartField.value=="" && dateEndField.value=="" && timeEndField.value==""){ //if modal show ADD window
        const dateTimeNow = (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))).toISOString();
        dateStartField.value = dateTimeNow.slice(0,10);
        timeStartField.value = dateTimeNow.slice(11,16);
        dateEndField.value = dateTimeNow.slice(0,10);
        timeEndField.value = dateTimeNow.slice(11,16);
    }

    // console.log(timeAccordion.classList.contains('show'));
    // console.log(timeAccordion.classList);
    // if (timeAccordion.style.classList.contains('show')) /* is accordion open? */
    // {

    // }

}

function listToConsole() {
    console.log(taskList);
}


/* function called when a ADD button pressed */
function btnClickAddNewTask() {
    addNewTaskToTaskList(); //add Data from inputs to TaskList
    saveListToLocalStorage(taskList); //Save the tasklist to local storage
    showTaskList(taskList); //redraw all the items including new one
    modalWindowAddNewTask.toggle() //close modal window
};


/* function for adding a new task to tasklist with values from inputs  */
function addNewTaskToTaskList() {
    if (dateStartField.value===dateEndField.value && timeStartField.value===timeEndField.value){
        dateEndField.value="";
        timeEndField.value="";
    }

    taskList[generateId()]={ /* 1. generating ID.  2. creating a new task inside the taskList obj */
        caption:captionField.value, //add Data (values) from inputs to task-object
        description:descriptionField.value,
        dateStart:dateStartField.value,
        timeStart:timeStartField.value,
        dateEnd:dateEndField.value,
        timeEnd:timeEndField.value,
        category:parseInt(categoriesDropDown.value),// category should be saved as a number, not a string
        currentState:parseInt(currentStateHidden.value),
    };
    console.log('Added new task to tasklist',taskList);
};

/* function for filling up DIVs with template styles and data from TaskList */
function showTaskList(taskList) {
    let [state0,state1,state2] = splitByState(taskList); //Split into 3 tasklists based on currentState value
    fillTheDivs(toDoDiv,state0); // Put all the tasks with state0 to toDoDiv
    fillTheDivs(inProgressDiv,state1);// Put all the tasks with state1 to inProgressDiv
    fillTheDivs(doneDiv,state2);// Put all the tasks with state2 to doneDiv
};
/* DRY - We can use FOR loop 3 times or write a function for that */
function fillTheDivs(divId,taskList) {
    divId.innerHTML=""; //clear DIV
    for (let task in taskList){ //loop thru tasklist
        divId.innerHTML+=prepareCard(task,taskList[task]);//put data, which we get from prepareCard function into this div
    }
}



function categoryToText(category) {
    return categories[category]
}

function formatDate(date) {
    return date === "" ? "" : new Date(date).toLocaleDateString()
}

function prepareCard(taskID,taskData) {
    //border color
    const borderColor=taskData.category===0 ? "dark" : taskData.category===1 ? "warning" : taskData.category===2 ? "info" : taskData.category===3 ? "success" : taskData.category===4 ? "danger" : "light";
    const taskCategory=categoryToText(taskData.category);
    const taskCaption=taskData.caption;
    const taskDescription=taskData.description;
    const taskTimeStart=taskData.timeStart;
    const taskDateStart=formatDate(taskData.dateStart);
    const taskTimeEnd=taskData.timeEnd;
    const taskDateEnd=formatDate(taskData.dateEnd);

    let addButtonsToCard = "";
    if (parseInt(taskData.currentState)===0){
        addButtonsToCard=`
        <a href="#" class="btn btn-info border border-light" data-btn-type="editTask" data-task-id="${taskID}"> Edit </a>
        <a href="#" class="btn btn-info border border-light" data-btn-type="taskToProgress" data-task-id="${taskID}"> In progress > </a>`;
    }else if(parseInt(taskData.currentState)===1){
        addButtonsToCard=`
        <a href="#" class="btn btn-info border border-light" data-btn-type="taskBackToDo" data-task-id="${taskID}"> < ToDo </a>
        <a href="#" class="btn btn-info border border-light" data-btn-type="editTask" data-task-id="${taskID}"> Edit </a>
        <a href="#" class="btn btn-info border border-light" data-btn-type="taskToDone" data-task-id="${taskID}"> Done > </a>`;
    }else if(parseInt(taskData.currentState)===2){
        addButtonsToCard=`
        <a href="#" class="btn btn-info border border-light" data-btn-type="taskToProgress" data-task-id="${taskID}"> < In progress </a>
        <a href="#" class="btn btn-info border border-light" data-btn-type="editTask" data-task-id="${taskID}"> Edit </a>`;
    };


    return `
    <!-- CARDS -->
    <!-- Card begin (row) -->
    <div class="row m-1">
        <!-- Card begin (col) -->
          <div class="col border rounded-3 border-${borderColor}">
            
            <!-- category of task -->
            <div class="row">
              <div class="col bg-light text-dark rounded-3 p-2">
                ${taskCategory}
              </div>
            </div>
            <!-- end category of task -->

            <!-- task header row -->
            <div class="row mt-2">
              <!-- header col -->
              <div class="col">
                <h4>${taskCaption}</h4>
              </div>
            </div>
            <!-- end task header row -->
            
            <!-- Task description -->
            <div class="row">
              <div class="col-8">
                <p class="card-text">${taskDescription}</p>
              </div>
              <!-- date-time -->
              <div class="col-4">
                <h5>${taskTimeStart}</h5>
                <h5>${taskDateStart}</h5>
                <h5>${taskTimeEnd}</h5>
                <h5>${taskDateEnd}</h5>
              </div>
            </div>
            <div class="row mb-3">
              <!-- we can add <hr> here -->
              <div class="col">
                <div class="btn-group" role="group" aria-label="Basic example">
                ${addButtonsToCard}
                </div>
              </div>
            </div>
            <!-- end Task description -->
              
          
          </div>
          <!-- Card end (col) -->
      </div>
      <!-- Card end (row) -->


      <!-- END CARDS -->
    `
};


/* Generates a uniqe string using Date object so every task will have a uniqe ID */
function generateId() {
    return `ID${Date.now().toString()}` /* Returns a unique string */
};

/* Deleting a Task from TaskList (ID) */
function deleteTaskFromList(taskID) {
    delete taskList[taskID]; 
};

/* function takes a taskList and returns 3 list objects splitted by state 0/1/2 
Usage:
let [state0,state1,state2] = splitByState(taskList);
*/
function splitByState(taskList) { 
    let state0={};
    let state1={};
    let state2={};
    for (let task in taskList){
        if (parseInt(taskList[task].currentState)===0)state0[task]=taskList[task];
        if (parseInt(taskList[task].currentState)===1)state1[task]=taskList[task];
        if (parseInt(taskList[task].currentState)===2)state2[task]=taskList[task];
    }
    return [state0,state1,state2]
}

/* Looping thru TaskList */
// for (let task in taskList){
//     console.log(`Caption of ${task} is ${taskList[task].caption}`);
//     console.log(`Description is ${taskList[task].description}`);
//     console.log(`dateStart is ${taskList[task].dateStart}`);
//     console.log(`dateEnd ${taskList[task].dateEnd}`);
// }

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