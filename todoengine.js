/* variables */
let taskList={};
let theStorage = window.localStorage;


/* find the nodes to work with */
const captionField = document.getElementById('caption');
const descriptionField = document.getElementById('description');
const dateStartField = document.getElementById('dateStart');
const timeStartField = document.getElementById('timeStart');
const dateEndField = document.getElementById('dateEnd');
const timeEndField = document.getElementById('timeEnd');
// todo - delete next const
const outputField = document.getElementById('output-tasks');
//----

//find DIVS to output data
const toDoDiv = document.getElementById('toDoDiv');
const inProgressDiv = document.getElementById('inProgressDiv');
const doneDiv = document.getElementById('doneDiv');
//END DIVS to output data


/* Buttons */
const btnSaveNewTask = document.getElementById('btnSaveNewTask');
btnSaveNewTask.addEventListener('click',btnClickAddNewTask);




const btnReadFromLocalStorage = document.getElementById('btnReadFromLocalStorage');
btnReadFromLocalStorage.addEventListener('click',readFromLocalStorage);

const btnListToConsole = document.getElementById('btnListToConsole');
btnListToConsole.addEventListener('click',listToConsole);

const btnListToLocalStorage = document.getElementById('btnListToLocalStorage');
btnListToLocalStorage.addEventListener('click',saveListToLocalStorage);


/* Functions needed */

function readFromLocalStorage() {
    taskList = JSON.parse(theStorage.getItem('TaskList'));
    console.log('List was read from local storage.');
    showTaskList(taskList,outputField);
}

function saveListToLocalStorage() {
    theStorage.setItem('TaskList',JSON.stringify(taskList));
    console.log('List was saved to local storage.')
}


document.addEventListener('click',function(e){
    if(e.target && e.target.dataset.btnType && e.target.dataset.taskId){
        if (e.target.dataset.btnType==='removeTask')btnClickRemoveTask(e.target.dataset.taskId);
        if (e.target.dataset.btnType==='editTask')btnClickEditTask(e.target.dataset.taskId);
      }
 });

function btnClickRemoveTask(taskID) {
    deleteTaskFromList(taskList,taskID);
    showTaskList(taskList,outputField);
}

function btnClickEditTask(taskID) {
    console.log('editTask',taskID)
}

function listToConsole() {
    console.log(taskList);
}



function btnClickAddNewTask() {
    addNewTaskToTaskList(taskList);
    showTaskList(taskList,outputField);
}

function addNewTaskToTaskList(taskList) {
    taskList[generateId()]={ /* 1. generating ID.  2. creating a new task inside the taskList obj */
        caption:captionField.value,
        description:descriptionField.value,
        dateStart:dateStartField.value,
        timeStart:timeStartField.value,
        dateEnd:dateEndField.value,
        timeEnd:timeEndField.value,
        category:0,
        currentState:0,
    };
}

function showTaskList(taskList,whereToOutput) {
    whereToOutput.innerHTML="<div>";
    for (let task in taskList){
        whereToOutput.innerHTML+=`<h2>${taskList[task].caption}</h2><p>${taskList[task].description}</p><h3>${taskList[task].timeStart} / ${taskList[task].dateStart}</h3><h3>${taskList[task].timeEnd} / ${taskList[task].dateEnd}</h3>`;
        whereToOutput.innerHTML+=`<button data-btn-type='removeTask' data-task-id='${task}'>remove</button>`
        whereToOutput.innerHTML+=`<button data-btn-type='editTask' data-task-id='${task}'>edit</button>`
        // console.log(`Caption of ${task} is ${taskList[task].caption}`);
        // console.log(`Description is ${taskList[task].description}`);
        // console.log(`dateStart is ${taskList[task].dateStart}`);
        // console.log(`dateEnd ${taskList[task].dateEnd}`);
    }
    whereToOutput.innerHTML+="</div>";
}

function prepareCard(taskData) {
    const borderColor;
    const taskCategory;
    const taskCaption;
    const taskDescription;
    const taskTimeStart;
    const taskDateStart;
    const taskTimeEnd;
    const taskDateEnd;

    const cardTemplate = ```
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
                  <a href="#" class="btn btn-info border border-light">< ToDo </a>
                  <a href="#" class="btn btn-info border border-light"> Edit </a>
                  <a href="#" class="btn btn-info border border-light"> Done! > </a>
                </div>
              </div>
            </div>
            <!-- end Task description -->
              
          
          </div>
          <!-- Card end (col) -->
      </div>
      <!-- Card end (row) -->


      <!-- END CARDS -->
    ```;
}


/* Generates a uniqe string using Date object so every task will have a uniqe ID */
function generateId() {
    return `ID${Date.now().toString()}` /* Returns a unique string */
}

/* Deleting a Task from TaskList (ID) */
function deleteTaskFromList(taskList,taskID) {
    delete taskList[taskID]; 
}

/* function takes a taskList and returns 3 list objects splitted by state 0/1/2 
Usage:
let [state0,state1,state2] = splitByState(taskList);
*/
function splitByState(taskList) { 
    let state0;
    let state1;
    let state2;
    for (let task in taskList){
        if (taskList[task].currentState===0)state0[task]=taskList[task];
        if (taskList[task].currentState===1)state1[task]=taskList[task];
        if (taskList[task].currentState===2)state2[task]=taskList[task];
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