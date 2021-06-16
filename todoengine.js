/* variables */
let taskList={
    ID1623744856709:{ /* ID can be generated using  generateId() */
        caption:'some caption', /* text from text field */
        description:'some description', /* text from text field */
        dateStart:'2021-06-20', /* text from input type=date */
        /* dates should be converted to toLocaleDateString() using new Date obj */
        timeStart:'15:55', /* text from input type=time */
        dateEnd:'2021-06-24', /* text from input type=date */
        timeEnd:'15:55', /* text from input type=time */
        category:1,/* a number that represents category (we can use an external obj for this list)
        a category can be used for highlighting or to split tasks into groups */
        currentState:0, /* a number that represents current state of the Task
        0 - Todo
        1 - in progress
        2 - done */
    },
    ID1623744856218:{ /* ID can be generated using  generateId() */
        caption:'1Create a GitHub repository', /* text from text field */
        description:'And decide who does which part', /* text from text field */
        dateStart:'2021-06-15', /* text from input type=date */
        /* dates should be converted to toLocaleDateString() using new Date obj */
        timeStart:'11:00', /* text from input type=time */
        dateEnd:'2021-06-24', /* text from input type=date */
        timeEnd:'15:55', /* text from input type=time */
        category:1,/* a number that represents category (we can use an external obj for this list)
        a category can be used for highlighting or to split tasks into groups */
        currentState:1, /* a number that represents current state of the Task
        0 - Todo
        1 - in progress
        2 - done */
    },
    ID1633744856218:{ /* ID can be generated using  generateId() */
        caption:'2Create a GitHub repository', /* text from text field */
        description:'And decide who does which part', /* text from text field */
        dateStart:'2021-06-15', /* text from input type=date */
        /* dates should be converted to toLocaleDateString() using new Date obj */
        timeStart:'11:00', /* text from input type=time */
        dateEnd:'2021-06-24', /* text from input type=date */
        timeEnd:'15:55', /* text from input type=time */
        category:1,/* a number that represents category (we can use an external obj for this list)
        a category can be used for highlighting or to split tasks into groups */
        currentState:2, /* a number that represents current state of the Task
        0 - Todo
        1 - in progress
        2 - done */
    },

};
let theStorage = window.localStorage;


//fill up categories
const categories = {
    0:'No category',
    1:'Learning',
    2:'Eating',
    3:'Exercises',
    4:'Important',
    5:'Not important',
};
const categoriesDropDown = document.getElementById('categoriesDropDown');
for (let category in categories){
    categoriesDropDown.innerHTML+=`<option value="${category}">${categories[category]}</option>`;
}


document.addEventListener('click',function(e){
    if(e.target && e.target.dataset.btnType && e.target.dataset.taskId){
        if (e.target.dataset.btnType==='removeTask')btnClickRemoveTask(e.target.dataset.taskId);
        if (e.target.dataset.btnType==='editTask')btnClickEditTask(e.target.dataset.taskId);
      }
 });


/* ========================================================== */
const captionField = document.getElementById('caption');
const descriptionField = document.getElementById('description');
const dateStartField = document.getElementById('dateStart');
const timeStartField = document.getElementById('timeStart');
const dateEndField = document.getElementById('dateEnd');
const timeEndField = document.getElementById('timeEnd');
const btnSaveNewTask = document.getElementById('btnSaveNewTask');
btnSaveNewTask.addEventListener('click',btnClickAddNewTask);

//this const is used for opening and closing modal window
const modalWindowAddNewTask = new bootstrap.Modal(document.getElementById('modalWindowAddNewTask'), {keyboard: false});
//modalWindowAddNewTask.toggle() - to open amd close it

/* ========================================================== */
//labels and buttons for EDIT / ADD
const addNewTaskLabel = document.getElementById('staticBackdropLabel'); //We will need to change this label
const btnEditTask = document.getElementById('btnEditTask'); //We will need to toggle "invisible" class on it and make a function to save changes when we press it
const btnDeleteTask = document.getElementById('btnDeleteTask');//We will need to toggle "invisible" class on it and make a function to delete task when we press it
// btnSaveNewTask is already defined above and We will need to toggle "invisible" class on it 
/* ========================================================== */

// todo - delete next const
const outputField = document.getElementById('output-tasks');
//----

//find DIVS to output data
const toDoDiv = document.getElementById('toDoDiv');
const inProgressDiv = document.getElementById('inProgressDiv');
const doneDiv = document.getElementById('doneDiv');
//END DIVS to output data





// const btnReadFromLocalStorage = document.getElementById('btnReadFromLocalStorage');
// btnReadFromLocalStorage.addEventListener('click',readFromLocalStorage);

// const btnListToConsole = document.getElementById('btnListToConsole');
// btnListToConsole.addEventListener('click',listToConsole);

// const btnListToLocalStorage = document.getElementById('btnListToLocalStorage');
// btnListToLocalStorage.addEventListener('click',saveListToLocalStorage);


taskList=readFromLocalStorage();
showTaskList(taskList);


/* Functions needed */




function readFromLocalStorage() {
    console.log('Reading list from local storage.');
    const savedData = theStorage.getItem('TaskList'); 
    if (!savedData){
        console.log('No data in storage.');
        return {}
    }
    console.log('Data found.');
    return JSON.parse(savedData);
}

function saveListToLocalStorage(taskList) {
    theStorage.setItem('TaskList',JSON.stringify(taskList));
    console.log('List was saved to local storage.')
}


/* listen to every click on the page and when we click on "special" buttons - call a function */
document.addEventListener('click',function(e){
    if(e.target && e.target.dataset.btnType && e.target.dataset.taskId){
        if (e.target.dataset.btnType==='taskToProgress')btnClickMoveTaskToProgress(e.target.dataset.taskId);
        if (e.target.dataset.btnType==='editTask')btnClickEditTask(e.target.dataset.taskId);
        if (e.target.dataset.btnType==='taskBackToDo')btnClickMoveTaskBackToDo(e.target.dataset.taskId);
        if (e.target.dataset.btnType==='taskToDone')btnClickMoveTaskToDone(e.target.dataset.taskId);
      }
 });

function btnClickMoveTaskToProgress(taskID) {
    taskList[taskID].currentState=1;
    saveListToLocalStorage(taskList)
    showTaskList(taskList);
}

function btnClickMoveTaskToDone(taskID) {
    taskList[taskID].currentState=2;
    saveListToLocalStorage(taskList)
    showTaskList(taskList);
}
function btnClickMoveTaskBackToDo(taskID) {
    taskList[taskID].currentState=0;
    saveListToLocalStorage(taskList)
    showTaskList(taskList);
}

function btnClickRemoveTask(taskID) {
    deleteTaskFromList(taskList,taskID);
    showTaskList(taskList,outputField);
}





function listToConsole() {
    console.log(taskList);
}


  
function btnClickAddNewTask() {
    addNewTaskToTaskList(taskList);
    saveListToLocalStorage(taskList);
    showTaskList(taskList);
    modalWindowAddNewTask.toggle() //close moddal window
}

function addNewTaskToTaskList(taskList) {
    taskList[generateId()]={ /* 1. generating ID.  2. creating a new task inside the taskList obj */
        caption:captionField.value,
        description:descriptionField.value,
        dateStart:dateStartField.value,
        timeStart:timeStartField.value,
        dateEnd:dateEndField.value,
        timeEnd:timeEndField.value,
        category:parseInt(categoriesDropDown.value),
        currentState:0,
    };
}

function showTaskList(taskList) {
    let [state0,state1,state2] = splitByState(taskList);
    toDoDiv.innerHTML="";
    inProgressDiv.innerHTML="";
    doneDiv.innerHTML="";
    for (let task in state0){
        toDoDiv.innerHTML+=prepareCard(task,state0[task]);
    }
    for (let task in state1){
        inProgressDiv.innerHTML+=prepareCard(task,state1[task]);
    }
    for (let task in state2){
        doneDiv.innerHTML+=prepareCard(task,state2[task]);
    }

}



function categoryToText(category) {
    return categories[category]
}

function prepareCard(taskID,taskData) {
    //border color
    console.log('taskData');
    // console.log(taskData);
    const borderColor=taskData.category===0 ? "dark" : taskData.category===1 ? "warning" : taskData.category===2 ? "info" : taskData.category===3 ? "success" : taskData.category===4 ? "danger" : "light";

    const taskCategory=categoryToText(taskData.category);
    const taskCaption=taskData.caption;
    const taskDescription=taskData.description;
    const taskTimeStart=taskData.timeStart;
    const taskDateStart=taskData.dateStart;
    const taskTimeEnd=taskData.timeEnd;
    const taskDateEnd=taskData.dateEnd;

    let addButtonsToCard = "";
    if (taskData.currentState===0){
        addButtonsToCard=`
        <a href="#" class="btn btn-info border border-light" data-btn-type="editTask" data-task-id="${taskID}"> Edit </a>
        <a href="#" class="btn btn-info border border-light" data-btn-type="taskToProgress" data-task-id="${taskID}"> In progress > </a>`;
    }else if(taskData.currentState===1){
        addButtonsToCard=`
        <a href="#" class="btn btn-info border border-light" data-btn-type="taskBackToDo" data-task-id="${taskID}"> < ToDo </a>
        <a href="#" class="btn btn-info border border-light" data-btn-type="editTask" data-task-id="${taskID}"> Edit </a>
        <a href="#" class="btn btn-info border border-light" data-btn-type="taskToDone" data-task-id="${taskID}"> Done > </a>`;
    }else if(taskData.currentState===2){
        addButtonsToCard=`
        <a href="#" class="btn btn-info border border-light" data-btn-type="taskToProgress" data-task-id="${taskID}"> < In progress </a>
        <a href="#" class="btn btn-info border border-light" data-btn-type="editTask" data-task-id="${taskID}"> Edit </a>`;
    };


    const cardTemplate = `
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
    `;


    return cardTemplate
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
    let state0={};
    let state1={};
    let state2={};
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




/* ========================================================== */
/* If we click on Edit button this function will run */
function btnClickEditTask(taskID) {
    console.log('editTask',taskID);
    /* you can edit task list by 
    taskList[taskID].caption = "new caption";
    taskList[taskID].description = "new description";
    and so on...!


    modalWindowAddNewTask.toggle() - call it to toggle modal
    */

}