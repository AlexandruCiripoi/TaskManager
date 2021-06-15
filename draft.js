/* Sample taskList structure */
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
        3 - done */
    /*  isVisible:true, // do we need a flag to hide a task??? */
    },
    ID1623744856218:{ /* ID can be generated using  generateId() */
        caption:'Create a GitHub repository', /* text from text field */
        description:'And decide who does which part', /* text from text field */
        dateStart:'2021-06-15', /* text from input type=date */
        /* dates should be converted to toLocaleDateString() using new Date obj */
        timeStart:'11:00', /* text from input type=time */
        dateEnd:'2021-06-24', /* text from input type=date */
        timeEnd:'15:55', /* text from input type=time */
        category:1,/* a number that represents category (we can use an external obj for this list)
        a category can be used for highlighting or to split tasks into groups */
        currentState:0, /* a number that represents current state of the Task
        0 - Todo
        1 - in progress
        3 - done */
    },

};

/* Generates a uniqe string using Date object so every task will have a uniqe ID */
function generateId() {
    return `ID${Date.now().toString()}` /* Returns a unique string */
}

/* Adding a new Task to TaskList */
taskList[generateId()]={ /* 1. generating ID.  2. creating a new task inside the taskList obj */
    caption:'Newly added caption',
    description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident assumenda ex, recusandae impedit iure delectus dolorem debitis? Excepturi aliquam ullam consectetur fugit doloribus quidem ducimus laudantium. Itaque nobis iste earum.',
    dateStart:'2021-01-01',
    timeStart:'11:30',
    dateEnd:'2021-12-31',
    timeEnd:'12:00',
    category:0,
    isDone:false,
};
/* //Example with inputs on HTML page
taskList[generateId()]={
    caption:document.getElementById('idOfInputInHtmlFile').value,
    description:document.getElementById('idOfAnotherInputInHtmlFile').value, //and so on
    dateStart:'2021-01-01',
    timeStart:'11:30',
    dateEnd:'2021-12-31',
    timeEnd:'12:00',
    category:0,
    isDone:false,
};
*/

/* Deleting a Task from TaskList (ID) */
function deleteTaskFromList(taskID) {
    delete taskList[taskID]; 
}


/* Looping thru TaskList */
for (let task in taskList){
    console.log(`Caption of ${task} is ${taskList[task].caption}`);
    console.log(`Description is ${taskList[task].description}`);
    console.log(`dateStart is ${taskList[task].dateStart}`);
    console.log(`dateEnd ${taskList[task].dateEnd}`);
}

/* All the tasks should be saved in a variable
Then saved to local storage 
let theStorage = window.localStorage;
theStorage.setItem('someName',JSON.stringify(taskList)) 
To get the data:
let retrievedObject = JSON.parse(theStorage.getItem('someName'));
*/






/* Some helpfull information */

/* window.localStorage Usage:
.setItem('myCat', 'Tom');
.getItem('myCat');
.removeItem('myCat'); // returns undefined
.clear() // to clear the storage

Put the object into storage
localStorage.setItem('testObject', JSON.stringify(testObject));

Retrieve the object from storage
var retrievedObject = localStorage.getItem('testObject');

console.log('retrievedObject: ', JSON.parse(retrievedObject));
*/


/*
Date constructor https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
const date1 = new Date('December 17, 1995 03:24:00');
// Sun Dec 17 1995 03:24:00 GMT...

const date2 = new Date('1995-12-17T03:24:00');
// Sun Dec 17 1995 03:24:00 GMT...

console.log(date1 === date2);
// expected output: false;

console.log(date1 - date2);
// expected output: 0
new Date()
new Date(value)
new Date(dateString)

new Date(year, monthIndex)
new Date(year, monthIndex, day)
new Date(year, monthIndex, day, hours)
new Date(year, monthIndex, day, hours, minutes)
new Date(year, monthIndex, day, hours, minutes, seconds)
new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)


*/