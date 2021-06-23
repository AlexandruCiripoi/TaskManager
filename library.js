// function toggleAddModal(action) {
//     if (action==='edit'){
//         // console.log('you pressed Edit');
//         btnSaveNewTask.classList.add('d-none');
//         btnEditTask.classList.remove('d-none');
//         btnDeleteTask.classList.remove('d-none');
//         addNewTaskLabel.innerText="Edit or delete task";
//     }else if (action==='add'){
//         btnSaveNewTask.classList.remove('d-none');
//         btnEditTask.classList.add('d-none');
//         btnDeleteTask.classList.add('d-none');
//         addNewTaskLabel.innerText="Add a new task";
//     }
// }


let noCategory = document.getElementById("nocategory");
let learning = document.getElementById("learning");
let eating = document.getElementById("eating");
let excercise = document.getElementById("excercise");
let important = document.getElementById("important");
let notImportant = document.getElementById("notimportant");

function populateLibrary() {
    for (const property in templateList) {
        let templateDOM = `<div class="col-4 border ">
<!-- Card begin (col) -->
<div class="col  ">

    <!-- end category of task -->

    <!-- task header row -->
    <div class="row mt-2">
        <!-- header col -->
        <div class="col">
            <h4>${templateList[property].caption}</h4>
        </div>
    </div>
    <!-- end task header row -->

    <!-- Task description -->

    <div class="col-8">
        <p class="card-text">${templateList[property].description}</p>

    </div>
    <!-- date-time -->

</div>
<div class="row mb-3">
    <!-- we can add <hr> here -->
        <div class="col">
            <div class="btn-group" role="group" aria-label="Basic example">
                <a href="#" class="btn btn-info border border-light">Edit </a>
                <a href="#" class="btn btn-info border border-light"> Schadule </a>
                <a href="#" class="btn btn-info border border-light"> Delete </a>
            </div>
        </div>
                </div>
    <!-- end Task description -->


</div>`

        // console.log(`${property}: ${templateList[property].description}`);
        console.log(property, templateList[property])
        switch (parseInt(property)) {
            case 0:
                noCategory.innerHTML += templateDOM
                
                break;
            case 1:
                learning.innerHTML += templateDOM
                break;
            case 2:
                eating.innerHTML += templateDOM
                break;
            case 3:
                excercise.innerHTML += templateDOM
                break;
            case 4:
                important.innerHTML += templateDOM
                break;
            case 5:
                notImportant.innerHTML += templateDOM
                break;
            default:
            // code block
        }
    }
}

populateLibrary()