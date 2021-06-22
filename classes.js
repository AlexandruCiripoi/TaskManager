import { borderColor, categories, stateDivIds, stateIcons } from "./settings.js";

//TODO: add a time-tracking function
let dateTimeNow = Date.now()
console.log(dateTimeNow);


export class Task{ // the Task 
    constructor(caption='',description='',dateStart='',timeStart='',dateEnd='',timeEnd='',category=0,currentState=0,editBtnListener,changeTaskState,id){
        this.id=id || `ID${Date.now().toString()}`; //generating ID on task creation
        this.caption = caption;
        this.description = description;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd != dateStart ? dateEnd : '';
        this.timeStart = timeStart;
        this.timeEnd = dateEnd == dateStart && timeStart == timeEnd ? '' : timeEnd;
        this.category = parseInt(category);
        this.currentState = parseInt(currentState);
        this.editBtnListener=editBtnListener;
        this.changeTaskState=changeTaskState;
    };
    get getStartDate(){
        return !this.dateStart ? "" : new Date(this.dateStart).toLocaleDateString()
    };
    get getEndDate(){
        return !this.dateEnd ? "" : new Date(this.dateEnd).toLocaleDateString()
    }
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
    createCard(){ //creates Nodes (html elements), adds event listeners. Just like a simple card-template

        //pretty basic document.createElement etc...
        const cardMainDivRow=document.createElement('div');
        cardMainDivRow.classList.add('row', 'm-1');
        cardMainDivRow.setAttribute('id',`card${this.id}`)
        const cardMainDivCol=document.createElement('div');
        
        cardMainDivCol.classList.add('col', 'border', 'rounded-3', `border-${borderColor[this.category]}`);//takes border colors from settings
        
        const categoryDivRow=document.createElement('div');
        categoryDivRow.classList.add('row');
        const categoryDivCol=document.createElement('div');
        categoryDivCol.classList.add('col', 'bg-light', 'text-dark', 'rounded-3', 'p-2');
        categoryDivCol.innerText=categories[this.category];


        categoryDivRow.appendChild(categoryDivCol);

        const taskHeaderRow = document.createElement('div');
        taskHeaderRow.classList.add('row','mt-2');

        const taskHeaderCol = document.createElement('div');
        taskHeaderCol.classList.add('col');

        const taskHeaderText = document.createElement('h4'); //innerText is clean on new created element
        
        const checkedP=document.createTextNode(stateIcons[this.currentState]);
        taskHeaderText.appendChild(checkedP);
        taskHeaderText.innerText+=' ' + this.caption;


        taskHeaderCol.appendChild(taskHeaderText);
        taskHeaderRow.appendChild(taskHeaderCol);

        const taskDescriptionRow = document.createElement('div');
        taskDescriptionRow.classList.add('row');
        const taskDescriptionCol = document.createElement('div');
        taskDescriptionCol.classList.add('col-lg-8');
        const taskDescriptionText = document.createElement('p');
        taskDescriptionText.innerText = this.description;
        taskDescriptionCol.appendChild(taskDescriptionText);
        const dateTimeCol = document.createElement('div');
        dateTimeCol.classList.add('col-lg-4');
        const dateTimeText1 = document.createElement('h5');
        const dateTimeText2 = document.createElement('h5');
        const dateTimeText3 = document.createElement('h5');
        const dateTimeText4 = document.createElement('h5');
        dateTimeText1.innerText = this.getStartDate;
        dateTimeText2.innerText = this.timeStart;
        dateTimeText3.innerText = this.getEndDate;
        dateTimeText4.innerText = this.timeEnd;
        dateTimeCol.appendChild(dateTimeText1);
        dateTimeCol.appendChild(dateTimeText2);
        dateTimeCol.appendChild(dateTimeText3);
        dateTimeCol.appendChild(dateTimeText4);
        taskDescriptionRow.appendChild(taskDescriptionCol);
        taskDescriptionRow.appendChild(dateTimeCol);

        const taskFooterRow = document.createElement('div');
        taskFooterRow.classList.add('row','mb-3');
        const taskFooterCol = document.createElement('div');
        taskFooterCol.classList.add('col');
        taskFooterCol.setAttribute('id',`btnDiv${this.id}`)

        taskFooterCol.appendChild(this.makeButtons());
        taskFooterRow.appendChild(taskFooterCol);
        cardMainDivCol.appendChild(categoryDivRow);
        cardMainDivCol.appendChild(taskHeaderRow);
        cardMainDivCol.appendChild(taskDescriptionRow);
        cardMainDivCol.appendChild(taskFooterRow);
        cardMainDivRow.appendChild(cardMainDivCol);

        return cardMainDivRow
    };
    makeButtons(){ //makes button elements (depending on Task status) with event listeners
        const btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group');
        btnGroup.setAttribute('role','group');
        btnGroup.setAttribute('id',`btnGrp${this.id}`);
        // add buttons inside btnGroup
        const btnToTODO = this.createButton('taskBackToDo','< ToDo',this.id);
        const btnEdit = this.createButton('editTask','Edit',this.id);
        const btnToProgress = this.createButton('taskToProgress','In progress',this.id);
        const btnToDone = this.createButton('taskToDone','Done >',this.id);
        btnToDone.addEventListener('click',()=>this.changeTaskStatusBtnListener(this.id,2));
        btnToProgress.addEventListener('click',()=>this.changeTaskStatusBtnListener(this.id,1));
        btnToTODO.addEventListener('click',()=>this.changeTaskStatusBtnListener(this.id,0));
        btnEdit.addEventListener('click',()=>this.editBtnListener(this.id));

        if (this.currentState === 0){
            btnGroup.appendChild(btnEdit);
            btnGroup.appendChild(btnToProgress);
        }else if (this.currentState === 1){
            btnGroup.appendChild(btnToTODO);
            btnGroup.appendChild(btnEdit);
            btnGroup.appendChild(btnToDone);
        }
        else if (this.currentState === 2){
            btnGroup.appendChild(btnToProgress);
            btnGroup.appendChild(btnEdit);
        }

        return btnGroup
    };
    set setState(newState){ //State setter. Also removes old button group (by ID) and puts a new button group inside task-card
        if (typeof newState === 'number' && newState>=0 && newState<=2){
            this.currentState=newState;
            console.log(`Setting current state of Task ${this.id} to ${this.currentState}.`);
            document.getElementById(`btnGrp${this.id}`).remove(); //remove button group, because we need other buttons for another state
            document.getElementById(`btnDiv${this.id}`).appendChild(this.makeButtons()); //generate new buttons according to new state

            document.getElementById(`card${this.id}`).remove(); //remove task card from DIV for the cards with old-state
            document.getElementById(stateDivIds[this.currentState]).appendChild(this.createCard()); //add out task-card to a div, where it should be
        }
    };
};



export class TaskList{ //the TaskList
    constructor(taskArray,editBtnListener,changeTaskStatusBtnListener){
        this.taskArray = Array.isArray(taskArray) ? taskArray : []; //checks if taskArray is an array and if not, creates an empty array 
        this.localStorage = window.localStorage; //uses own local storage
        this.editBtnListener = editBtnListener; //a reference to a function that will be added as an EventListener for EDIT buttons on every task card
        this.changeTaskStatusBtnListener = changeTaskStatusBtnListener; //a reference to a function that will be added as an EventListener for buttons that change state of task
    };
    addNewTask(newTask){
        if (newTask instanceof Task){
            this.taskArray.push(newTask);
            console.log(`New task was added to array.`);
            this.saveToLocalStorage();
            try{ //if for example we are not on a page with DIVs with specific IDs
                document.getElementById(stateDivIds[0]).appendChild(this.taskArray[this.taskArray.length-1].createCard());
            }catch(e){//then don't do code above and just log error to console
                console.log(e);
            }
        }else{
            console.log(`Not a Task object!`);
        }
    };
    removeTask(taskId){
        console.log(`Removing task with id ${taskId} from array.`);
        this.taskArray=this.taskArray.filter(taskItem=>taskItem.id!=taskId);
        this.saveToLocalStorage();
        try{ //if for example we are not on a page with DIVs with specific IDs
            document.getElementById(`card${taskId}`).remove();
        }catch(e){//then don't do code above and just log error to console
            console.log(e);
        }
    };
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
            this.taskArray = savedData.map(taskItem=>new Task(taskItem.caption,taskItem.description,taskItem.dateStart,taskItem.timeStart,taskItem.dateEnd,taskItem.timeEnd,taskItem.category,taskItem.currentState,this.editBtnListener,this.changeTaskState,taskItem.id));
        }
    };
    getTaskData(taskId){
        return this.taskArray.find(task=>task.id===taskId) || `Can't find ID ${taskId}`
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
        editingTask.setState=newData.currentState;
        editingTask.editBtnListener=this.editBtnListener;
        editingTask.changeTaskStatusBtnListener=this.changeTaskStatusBtnListener;
        document.getElementById(`card${taskId}`).remove();
        document.getElementById(stateDivIds[newData.currentState]).appendChild(editingTask.createCard());
        this.saveToLocalStorage(); //keep local storage up-to-date with the array in memory
    };
    putCardsToDivByState(){
        try{ //if for example we are not on a page with DIVs with specific IDs
            for (let state in stateDivIds){
                const cardsWithState=this.taskArray.filter(taskItem=>taskItem.currentState==state);
                const divToAppend = document.getElementById(stateDivIds[state]);
                cardsWithState.forEach(card=>divToAppend.appendChild(card.createCard()))
            }
        }
        catch (e){ //then don't do code above and just log error to console
            console.log(e);
        }
    };
    changeTaskState(taskId,newState){
        if (typeof newState === 'number' && newState>=0 && newState<=2){
            const taskToChange = this.taskArray.find(taskItem=>taskItem.id===taskId); //find a task where we should change state
            taskToChange.setState=newState; //set a new set with a setter
            this.saveToLocalStorage(); //keep local storage up-to-date with the array in memory
        }
    }
    clearTasksAndLocalStorage(){
        this.taskArray=[];
        this.localStorage.clear();
    }
}