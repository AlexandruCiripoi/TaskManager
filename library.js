let noCategory = document.getElementById("nocategory");
let learning = document.getElementById("learning");
let eating = document.getElementById("eating");
let excercise = document.getElementById("excercise");
let important = document.getElementById("important");
let notImportant = document.getElementById("notimportant");
let addTemplateBTN = document.getElementById("addTemplate")
const btnSaveNewTask = document.getElementById('btnSaveNewTask');
const btnEditTask = document.getElementById('btnEditTask');
const btnDeleteTask = document.getElementById('btnDeleteTask');
const btnShowModalAddNewTask = document.getElementById('btnShowModalAddNewTask');
const addNewTaskLabel = document.getElementById('staticBackdropLabel');
const captionField = document.getElementById('caption');
const descriptionField = document.getElementById('description');

const categories = {
    0:'No category',
    1:'Learning',
    2:'Eating',
    3:'Exercises',
    4:'Important',
    5:'Not important',
};


const categoriesDropDown = document.getElementById('categoriesDropDown'); 
/* Populate categories on page */
for (let category in categories){
    categoriesDropDown.innerHTML+=`<option value="${category}">${categories[category]}</option>`;
}

function populateLibrary() {
    noCategory.innerHTML = ""
    learning.innerHTML = ""
    eating.innerHTML = ""
    excercise.innerHTML = ""
    important.innerHTML = ""
    notImportant.innerHTML = ""
    for (const property in templateList) {
        console.log(property)
        let templateDOM = `<div class="col-4 border m-2">
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
                <a href="#" class="btn btn-info border border-light" id="editBTNid${property}">Edit </a>
                <a href="#" class="btn btn-info border border-light" id="scheduleBTNid${property}"> Schedule </a>
                <a href="#" class="btn btn-info border border-light" id="deleteBTNid${property}"> Delete </a>
            </div>
        </div>
                </div>
    <!-- end Task description -->


</div>`

        switch (parseInt(templateList[property].category)) {
            case 0:
                noCategory.innerHTML += templateDOM
                addListinerToBTN(`editBTNid${property}`)
                addListinerToSchedule(`scheduleBTNid${property}`)
                addListinerToDelete(`deleteBTNid${property}`)
                break;
            case 1:
                learning.innerHTML += templateDOM
                addListinerToBTN(`editBTNid${property}`)
                addListinerToSchedule(`scheduleBTNid${property}`)
                addListinerToDelete(`deleteBTNid${property}`)
                break;
            case 2:
                eating.innerHTML += templateDOM
                addListinerToBTN(`editBTNid${property}`)
                addListinerToSchedule(`scheduleBTNid${property}`)
                addListinerToDelete(`deleteBTNid${property}`)
                break;
            case 3:
                excercise.innerHTML += templateDOM
                addListinerToBTN(`editBTNid${property}`)
                addListinerToSchedule(`scheduleBTNid${property}`)
                addListinerToDelete(`deleteBTNid${property}`)
                break;
            case 4:
                important.innerHTML += templateDOM
                addListinerToBTN(`editBTNid${property}`)
                addListinerToSchedule(`scheduleBTNid${property}`)
                addListinerToDelete(`deleteBTNid${property}`)
                break;
            case 5:
                notImportant.innerHTML += templateDOM
                addListinerToBTN(`editBTNid${property}`)
                addListinerToSchedule(`scheduleBTNid${property}`)
                addListinerToDelete(`deleteBTNid${property}`)
                break;
            default:
            // code block
        }
    }     

}

populateLibrary()

function addListinerToBTN(id) {
    const x = document.getElementById(id)
    console.log(x)
    x.addEventListener("click", function() {
        modalLibrary.toggle()
        toggleAddModal("edit")
        let identification = parseInt(id.substring(9))
        captionField.value = templateList[identification].caption
        descriptionField.value = templateList[identification].description
        categoriesDropDown.value = templateList[identification].category
        });
}


function addListinerToDelete(id) {
    document.getElementById(id).addEventListener("click", function() {
        let identification = parseInt(id.substring(11))
        
        delete templateList[identification]
        console.log(templateList)
        populateLibrary()
        });
}

function addListinerToSchedule(id) {
    document.getElementById(id).addEventListener("click", function() {
        let identification = parseInt(id.substring(13))
        console.log(templateList[identification])
        const localStorage = window.localStorage;
        localStorage.setItem('addNewFromTemplate',JSON.stringify(templateList[identification]));
        window.location.assign('./taskcards.html')
        });
}

const modalLibrary = new bootstrap.Modal(document.getElementById('modalLibrary'), {keyboard: false});

addTemplateBTN.addEventListener("click", function () {
    modalLibrary.toggle()
    toggleAddModal("add")
});


function toggleAddModal(action) {
    if (action==='edit'){
        // console.log('you pressed Edit');
        btnSaveNewTask.classList.add('d-none');
        btnEditTask.classList.remove('d-none');
        addNewTaskLabel.innerText="Edit Task Template";
    }else if (action==='add'){
        btnSaveNewTask.classList.remove('d-none');
        btnEditTask.classList.add('d-none');
        addNewTaskLabel.innerText="Add Task Template";
    }
}
let idNewTemplate = (Object.keys(templateList)).length
function addNewTemplate() {
    let newTemplate = {
            caption: captionField.value,
            description: descriptionField.value,
            category: parseInt(categoriesDropDown.value)
        }
    let idNewTemplate = (Object.keys(templateList)).length
    templateList[idNewTemplate] = newTemplate
    modalLibrary.toggle() 
    populateLibrary()

  };
  
  btnSaveNewTask.addEventListener('click',addNewTemplate);

