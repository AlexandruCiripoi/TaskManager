import { borderColor, categories, stateDivIds, stateIcons } from "./settings.js";

//TODO: add a time-tracking function
let dateTimeNow = new Date(Date.now()).toLocaleString();
console.log(dateTimeNow);

export class Task{ // the Task 
    constructor(caption='',description='',dateStart='',timeStart='',dateEnd='',timeEnd='',category=0,currentState=0,id){
        this.id=id || `ID${Date.now().toString()}`; //generating ID on task creation
        this.caption = caption;
        this.description = description;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd != dateStart ? dateEnd : '';
        this.timeStart = timeStart;
        this.timeEnd = dateEnd == dateStart && timeStart == timeEnd ? '' : timeEnd;
        this.category = parseInt(category);
        this.currentState = parseInt(currentState);
    };
    get getStartDate(){
        return !this.dateStart ? "" : new Date(this.dateStart).toLocaleDateString()
    };
    get getEndDate(){
        return !this.dateEnd ? "" : new Date(this.dateEnd).toLocaleDateString()
    }
};



export class TaskList{ //the TaskList
    constructor(taskArray,editBtnListener){
        this.taskArray = Array.isArray(taskArray) ? taskArray : []; //checks if taskArray is an array and if not, creates an empty array 
        this.localStorage = window.localStorage; //uses own local storage
        this.editBtnListener = editBtnListener; //a reference to a function that will be added as an EventListener for EDIT buttons on every task card
        this.changeTaskState=this.changeTaskState.bind(this);
    };

    /* Methods to work with Local Storage */
    saveToLocalStorage(){
        this.localStorage.setItem('TaskListObject',JSON.stringify(this.taskArray));
        console.log('List was saved to local storage.')
    };
    readFromLocalStorage(){
        console.log('Reading list from local storage.');
        let savedData = this.localStorage.getItem('TaskListObject'); 
        if (!savedData){
            console.log('No data in storage.');
            this.taskArray = [];
        }else{
            console.log('Data found.');
            savedData=JSON.parse(savedData);
            this.taskArray = savedData.map(taskItem=>new Task(taskItem.caption,taskItem.description,taskItem.dateStart,taskItem.timeStart,taskItem.dateEnd,taskItem.timeEnd,taskItem.category,taskItem.currentState,taskItem.id));
        }
    };

    /* Methods for adding, removing and editing tasks and changing task state inside the array */
    addNewTask(newTask){
        if (newTask instanceof Task){
            this.taskArray.push(newTask);
            console.log(`New task was added to array.`);
            this.saveToLocalStorage();
            this.putNewCardToDiv(newTask.id);
        }else{
            console.log(`Not a Task object!`);
        }
    };
    removeTask(taskId){
        console.log(`Removing task with id ${taskId} from array.`);
        this.taskArray=this.taskArray.filter(taskItem=>taskItem.id!=taskId);
        this.saveToLocalStorage();
        this.removeCardFromDocument(taskId);
    };
    editTask(taskId,newData){
        const editingTask = this.taskArray.find(task=>task.id===taskId); //find a task with id == taskId in array
        editingTask.caption=newData.caption; 
        editingTask.description=newData.description;
        editingTask.dateStart=newData.dateStart;
        editingTask.timeStart=newData.timeStart;
        editingTask.dateEnd=newData.dateEnd;
        editingTask.timeEnd=newData.timeEnd;
        editingTask.category=newData.category;
        editingTask.currentState=newData.currentState;
        editingTask.editBtnListener=this.editBtnListener;
        editingTask.changeTaskStatusBtnListener=this.changeTaskState;
        this.redrawEditedCard(taskId);
        this.saveToLocalStorage(); //keep local storage up-to-date with the array in memory
    };
    changeTaskState(taskId,newState){
        if (typeof newState === 'number' && newState>=0 && newState<=2){
            const taskToChange = this.taskArray.find(taskItem=>taskItem.id===taskId); //find a task where we should change state
            taskToChange.currentState=newState; //set a new state
            this.moveCardToDivByState(taskId);
            this.saveToLocalStorage(); //keep local storage up-to-date with the array in memory
        }
    };
    /* Return task from array */
    getTaskData(taskId){
        return this.taskArray.find(task=>task.id===taskId) || `Can't find ID ${taskId}`
    };
    getTaskArray(){ //if we want to give someone a copy of our array
        return [...this.taskArray]
    };
    /* clear the memory */
    clearTasksAndLocalStorage(){
        this.taskArray=[];
        this.localStorage.clear();
    }


    /* Method for creating HTML elements and putting them inside the DIVs on the page */
    createButton(btnDataSetType,btnCaption,btnTaskID) { //this function creates and returns button elements. Used in MakeButtons function.
        const btnA = document.createElement('a');
        btnA.setAttribute('id',`${btnDataSetType}ID${btnTaskID}`);
        btnA.classList.add('btn', 'btn-info', 'border', 'border-light');
        btnA.dataset.btnType=btnDataSetType;
        btnA.dataset.taskId=btnTaskID;
        btnA.href='#';
        btnA.innerText=btnCaption;
        return btnA
      };
    createCard(taskId){ //creates Nodes (html elements), adds event listeners. Just like a simple card-template
        const referenceToTask = this.taskArray.find(task=>task.id===taskId);
        //pretty basic document.createElement etc...
        const cardMainDivRow=document.createElement('div');
        cardMainDivRow.classList.add('row', 'm-1');
        cardMainDivRow.setAttribute('id',`card${referenceToTask.id}`)
        const cardMainDivCol=document.createElement('div');
        
        cardMainDivCol.classList.add('col', 'border', 'rounded-3', `border-${borderColor[referenceToTask.category]}`);//takes border colors from settings
        
        const categoryDivRow=document.createElement('div');
        categoryDivRow.classList.add('row');
        const categoryDivCol=document.createElement('div');
        categoryDivCol.classList.add('col', `bg-${borderColor[referenceToTask.category]}`, `text-${referenceToTask.category==4 ? 'light': 'dark'}`, 'rounded-3', 'p-2');
        categoryDivCol.innerText=categories[referenceToTask.category];


        categoryDivRow.appendChild(categoryDivCol);

        const taskHeaderRow = document.createElement('div');
        taskHeaderRow.classList.add('row','mt-2');

        const taskHeaderCol = document.createElement('div');
        taskHeaderCol.classList.add('col');

        const taskHeaderText = document.createElement('h4'); //innerText is clean on new created element
        
        const checkedP=document.createTextNode(stateIcons[referenceToTask.currentState]);


        //Add icon if we've passed the deadline (date or date+time)
        if (referenceToTask.currentState<2){ //if task is still not done (if it's done - we dont care)
            if (referenceToTask.dateEnd || (referenceToTask.timeEnd && referenceToTask.dateStart)){ //if we have a deadline set - either a date or time if it is on the same date
                const dateEnd = new Date(referenceToTask.dateEnd ? referenceToTask.dateEnd : referenceToTask.dateStart);
                dateEnd.setHours(23,59,59); //if only date is used - time should be set to 23.59
                const dateTimeNow = new Date();
                const clockIcon = document.createTextNode(stateIcons[99]);
                if (dateEnd<dateTimeNow){
                    console.log('Ooops!',referenceToTask.id,'date is already passed');
                    taskHeaderText.appendChild(clockIcon);
                }else if (dateEnd.toLocaleDateString()==dateTimeNow.toLocaleDateString() && referenceToTask.timeEnd){//if the date is the same then check time
                    const timeEnd=new Date();
                    timeEnd.setHours(referenceToTask.timeEnd.slice(0,2));
                    timeEnd.setMinutes(referenceToTask.timeEnd.slice(3,5));
                    if (timeEnd<dateTimeNow){
                        console.log('Ooops!',referenceToTask.id,'time is already passed');
                        taskHeaderText.appendChild(clockIcon);
                    }
                }
            }
        }

        taskHeaderText.appendChild(checkedP);
        taskHeaderText.innerText+=' ' + referenceToTask.caption;


        taskHeaderCol.appendChild(taskHeaderText);
        taskHeaderRow.appendChild(taskHeaderCol);

        const taskDescriptionRow = document.createElement('div');
        taskDescriptionRow.classList.add('row');
        const taskDescriptionCol = document.createElement('div');
        taskDescriptionCol.classList.add('col');
        const taskDescriptionText = document.createElement('p');
        taskDescriptionText.innerText = referenceToTask.description;
        taskDescriptionCol.appendChild(taskDescriptionText);
        taskDescriptionRow.appendChild(taskDescriptionCol);

        const dateTimeRow = document.createElement('div');
        dateTimeRow.classList.add('row','mb-3');
        // const dateTimeCol = document.createElement('div');
        // dateTimeCol.classList.add('col');
        const dateTimeText1 = document.createElement('div');
        const dateTimeText2 = document.createElement('div');
        const dateTimeText3 = document.createElement('div');
        const dateTimeText4 = document.createElement('div');
        dateTimeText1.classList.add('col');
        dateTimeText2.classList.add('col');
        dateTimeText3.classList.add('col');
        dateTimeText4.classList.add('col');
        dateTimeText1.innerText = referenceToTask.getStartDate;
        dateTimeText2.innerText = referenceToTask.timeStart;
        dateTimeText3.innerText = referenceToTask.getEndDate;
        dateTimeText4.innerText = referenceToTask.timeEnd;
        if (referenceToTask.dateStart)dateTimeRow.appendChild(dateTimeText1);
        if (referenceToTask.timeStart)dateTimeRow.appendChild(dateTimeText2);
        if (referenceToTask.dateEnd)dateTimeRow.appendChild(dateTimeText3);
        if (referenceToTask.dateEnd)dateTimeRow.appendChild(dateTimeText4);
        // dateTimeRow.appendChild(dateTimeCol);
        

        const taskFooterRow = document.createElement('div');
        taskFooterRow.classList.add('row','mb-3');
        const taskFooterCol = document.createElement('div');
        taskFooterCol.classList.add('col');
        taskFooterCol.setAttribute('id',`btnDiv${referenceToTask.id}`)

        taskFooterCol.appendChild(this.makeButtons(referenceToTask.id));
        taskFooterRow.appendChild(taskFooterCol);
        cardMainDivCol.appendChild(categoryDivRow);
        cardMainDivCol.appendChild(taskHeaderRow);
        cardMainDivCol.appendChild(taskDescriptionRow);

        cardMainDivCol.appendChild(dateTimeRow);

        cardMainDivCol.appendChild(taskFooterRow);
        cardMainDivRow.appendChild(cardMainDivCol);

        return cardMainDivRow
      };
    makeButtons(taskId){ //makes button elements (depending on Task status) with event listeners
        const referenceToTask = this.taskArray.find(task=>task.id===taskId);
        const btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group');
        btnGroup.setAttribute('role','group');
        btnGroup.setAttribute('id',`btnGrp${referenceToTask.id}`);
        // add buttons inside btnGroup
        const btnToTODO = this.createButton('taskBackToDo','< ToDo',referenceToTask.id);
        const btnEdit = this.createButton('editTask','Edit',referenceToTask.id);
        const btnToProgress = this.createButton('taskToProgress','In progress',referenceToTask.id);
        const btnToDone = this.createButton('taskToDone','Done >',referenceToTask.id);
        btnToDone.addEventListener('click',()=>this.changeTaskState(referenceToTask.id,2));
        btnToProgress.addEventListener('click',()=>this.changeTaskState(referenceToTask.id,1));
        btnToTODO.addEventListener('click',()=>this.changeTaskState(referenceToTask.id,0));
        btnEdit.addEventListener('click',()=>this.editBtnListener(referenceToTask.id));

        if (referenceToTask.currentState === 0){
            btnGroup.appendChild(btnEdit);
            btnGroup.appendChild(btnToProgress);
        }else if (referenceToTask.currentState === 1){
            btnGroup.appendChild(btnToTODO);
            btnGroup.appendChild(btnEdit);
            btnGroup.appendChild(btnToDone);
        }
        else if (referenceToTask.currentState === 2){
            btnGroup.appendChild(btnToProgress);
            btnGroup.appendChild(btnEdit);
        }
        return btnGroup
      };

    /* functions to put cards into DIVS on the page */
    putCardsToDivByState(){
        try{ //if for example we are not on a page with DIVs with specific IDs
            for (let state in stateDivIds){
                const tasksWithState=this.taskArray.filter(taskItem=>taskItem.currentState==state);
                const divToAppend = document.getElementById(stateDivIds[state]);
                tasksWithState.forEach(task=>divToAppend.appendChild(this.createCard(task.id)))
            }
        }
        catch (e){ //then don't do code above and just log error to console
            console.log(e);
        }
    };
    putNewCardToDiv(taskId){
        try{ //if for example we are not on a page with DIVs with specific IDs
            document.getElementById(stateDivIds[0]).appendChild(this.createCard(taskId));
        }catch(e){//then don't do code above and just log error to console
            console.log(e);
        }
    };
    moveCardToDivByState(taskId){
        const referenceToTask = this.taskArray.find(task=>task.id===taskId);
        try {
            console.log(`Moving card to another DIV after changing state of Task ${taskId}.`);
            document.getElementById(`btnGrp${taskId}`).remove(); //remove button group, because we need other buttons for another state
            document.getElementById(`btnDiv${taskId}`).appendChild(this.makeButtons(taskId)); //generate new buttons according to new state

            document.getElementById(`card${taskId}`).remove(); //remove task card from DIV for the cards with old-state
            document.getElementById(stateDivIds[referenceToTask.currentState]).appendChild(this.createCard(taskId)); //add out task-card to a div, where it should be
        } catch (e) {
            console.log(e);
        }
    };
    removeCardFromDocument(taskId){
        try{ //if for example we are not on a page with DIVs with specific IDs
            document.getElementById(`card${taskId}`).remove();
        }catch(e){//then don't do code above and just log error to console
            console.log(e);
        }
    }
    redrawEditedCard(taskId){
        try{
            const referenceToTask = this.taskArray.find(task=>task.id===taskId);
            document.getElementById(`card${taskId}`).remove();
            document.getElementById(stateDivIds[referenceToTask.currentState]).appendChild(this.createCard(taskId));
        }catch(e){
            console.log(e);
        }
    };
}



// Just info how to bind
// this.equals = this.equals.bind(this);
// this.clear = this.clear.bind(this);
// this.output = this.output.bind(this);
