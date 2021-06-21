import { borderColor, categories, stateDivIds } from "./settings.js";



//todo add a time-tracking function
let dateTimeNow = Date.now()
console.log(dateTimeNow);



export class Task{
    constructor(caption='',description='',dateStart='',timeStart='',dateEnd='',timeEnd='',category=0,currentState=0,editBtnListener,id){
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
    };
    get getStartDate(){
        return this.dateStart === "" ? "" : new Date(this.dateStart).toLocaleDateString()
    };
    get getEndDate(){
        return this.dateEnd === "" ? "" : new Date(this.dateEnd).toLocaleDateString()
    }
    createButton(btnDataSetType,btnCaption,btnTaskID) {
        // const btnEditTask=['editTask','Edit'];
        // const btnTaskToProgress=['taskToProgress','In progress'];
        // const btnTaskBackToDo=['taskBackToDo','< ToDo'];
        // const btnTaskToDone=['taskToDone','Done >'];
      const btnA = document.createElement('a');
      btnA.setAttribute('id',`${btnDataSetType}ID${btnTaskID}`);
      btnA.classList.add('btn', 'btn-info', 'border', 'border-light');
      btnA.dataset.btnType=btnDataSetType;
      btnA.dataset.taskId=btnTaskID;
      btnA.href='#';
      btnA.innerText=btnCaption;
      return btnA
    };
    createCard(){
        const cardMainDivRow=document.createElement('div');
        cardMainDivRow.classList.add('row', 'm-1');
        cardMainDivRow.setAttribute('id',`card${this.id}`)
        const cardMainDivCol=document.createElement('div');
        
        cardMainDivCol.classList.add('col', 'border', 'rounded-3', `border-${borderColor[this.category]}`);
        
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
        if (this.currentState===2){ //when state is Done (2) - add an Icon
            const checkedP=document.createTextNode("\u2714 ");
            taskHeaderText.appendChild(checkedP);
        }else if(this.currentState===1){
            const checkedP=document.createTextNode("\u27BA ");
            taskHeaderText.appendChild(checkedP);
        }
        taskHeaderText.innerText+=this.caption;


        taskHeaderCol.appendChild(taskHeaderText);
        taskHeaderRow.appendChild(taskHeaderCol);

        const taskDescriptionRow = document.createElement('div');
        taskDescriptionRow.classList.add('row');
        const taskDescriptionCol = document.createElement('div');
        taskDescriptionCol.classList.add('col-8');
        const taskDescriptionText = document.createElement('p');
        taskDescriptionText.innerText = this.description;
        taskDescriptionCol.appendChild(taskDescriptionText);
        const dateTimeCol = document.createElement('div');
        dateTimeCol.classList.add('col-4');
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
    makeButtons(){
        const btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group');
        btnGroup.setAttribute('role','group');
        btnGroup.setAttribute('id',`btnGrp${this.id}`);
        // add buttons inside btnGroup
        const btnToTODO = this.createButton('taskBackToDo','< ToDo',this.id);
        const btnEdit = this.createButton('editTask','Edit',this.id);
        const btnToProgress = this.createButton('taskToProgress','In progress',this.id);
        const btnToDone = this.createButton('taskToDone','Done >',this.id);
        btnToDone.addEventListener('click',()=>this.setState=2);
        btnToProgress.addEventListener('click',()=>this.setState=1);
        btnToTODO.addEventListener('click',()=>this.setState=0);
        btnEdit.addEventListener('click',this.editBtnListener);

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
    set setState(newState){
        if (typeof newState === 'number' && newState>=0 && newState<=2){
            this.currentState=newState;
            console.log(`Setting current state of Task ${this.id} to ${this.currentState}.`);
            document.getElementById(`btnGrp${this.id}`).remove();
            document.getElementById(`btnDiv${this.id}`).appendChild(this.makeButtons());

            document.getElementById(`card${this.id}`).remove();
            document.getElementById(stateDivIds[this.currentState]).appendChild(this.createCard());
        }
    };
};



export class TaskList{
    constructor(taskArray,editBtnListener){
        this.taskArray = Array.isArray(taskArray) ? taskArray : [];
        this.localStorage = window.localStorage;
        this.editBtnListener=editBtnListener;
    };
    addNewTask(newTask){
        if (newTask instanceof Task){
            this.taskArray.push(newTask);
            console.log(`New task was added to array.`);
            this.saveToLocalStorage();
            document.getElementById(stateDivIds[0]).appendChild(this.taskArray[this.taskArray.length-1].createCard());
        }else{
            console.log(`Not a Task object!`);
        }
    };
    removeTask(taskId){
        console.log(`Removing task with id ${taskId} from array.`);
        this.taskArray=this.taskArray.filter(taskItem=>taskItem.id!=taskId);
        this.saveToLocalStorage();
        document.getElementById(`card${taskId}`).remove();
    };
    saveToLocalStorage(){
        if (this.taskArray.length>0){
            this.localStorage.setItem('TaskListObject',JSON.stringify(this.taskArray));
            console.log('List was saved to local storage.')
        }else console.log('Array is empty, nothing to save.')
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
            // savedData=savedData.map(taskItem=>{
            //     if (Number.isInteger(taskItem.currentState)){
            //         return taskItem
            //     }
            //     console.log(taskItem.currentState);
            //     taskItem.currentState=0;
            //     return taskItem
            // });
            this.taskArray = savedData.map(taskItem=>new Task(taskItem.caption,taskItem.description,taskItem.dateStart,taskItem.timeStart,taskItem.dateEnd,taskItem.timeEnd,taskItem.category,taskItem.currentState,this.editBtnListener,taskItem.id));
        }
    };
    getTaskData(taskId){
        return this.taskArray.find(task=>task.id===taskId)
    };
    editTask(taskId,newData){
        // const editID = this.taskArray.findIndex(task=>task.id===taskId);
        // this.taskArray[editID].caption=newData.caption;
        // this.taskArray[editID].description=newData.description;
        // this.taskArray[editID].dateStart=newData.dateStart;
        // this.taskArray[editID].timeStart=newData.timeStart;
        // this.taskArray[editID].dateEnd=newData.dateEnd;
        // this.taskArray[editID].timeEnd=newData.timeEnd;
        // this.taskArray[editID].category=newData.category;
        // this.taskArray[editID].setState=newData.currentState;
        // this.taskArray[editID].editBtnListener=this.editBtnListener;
        
        // document.getElementById(`card${taskId}`).remove();
        // document.getElementById(stateDivIds[newData.currentState]).appendChild(this.taskArray[editID].createCard());

        const editingTask = this.taskArray.find(task=>task.id===taskId);
        editingTask.caption=newData.caption;
        editingTask.description=newData.description;
        editingTask.dateStart=newData.dateStart;
        editingTask.timeStart=newData.timeStart;
        editingTask.dateEnd=newData.dateEnd;
        editingTask.timeEnd=newData.timeEnd;
        editingTask.category=newData.category;
        editingTask.setState=newData.currentState;
        editingTask.editBtnListener=this.editBtnListener;
        
        document.getElementById(`card${taskId}`).remove();
        document.getElementById(stateDivIds[newData.currentState]).appendChild(editingTask.createCard());

        this.saveToLocalStorage();
    };
    putCardsToDivByState(){
        for (let state in stateDivIds){
            const cardsWithState=this.taskArray.filter(taskItem=>taskItem.currentState==state);
            const divToAppend = document.getElementById(stateDivIds[state]);
            cardsWithState.forEach(card=>divToAppend.appendChild(card.createCard()))
        }
    };
}