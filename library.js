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
    noCategory.innerHTML = ""
    learning.innerHTML = ""
    eating.innerHTML = ""
    excercise.innerHTML = ""
    important.innerHTML = ""
    notImportant.innerHTML = ""
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
                <a href="#" class="btn btn-info border border-light" id="editBTNid${property}">Edit </a>
                <a href="#" class="btn btn-info border border-light" id="scheduleBTNid${property}"> Schedule </a>
                <a href="#" class="btn btn-info border border-light" id="deleteBTNid${property}"> Delete </a>
            </div>
        </div>
                </div>
    <!-- end Task description -->


</div>`


        switch (parseInt(property)) {
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
    document.getElementById(id).addEventListener("click", function() {
        console.log("works")
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



// $('#exampleModal').on('show.bs.modal', function (event) {
//     var button = $(event.relatedTarget) // Button that triggered the modal
//     var recipient = button.data('whatever') // Extract info from data-* attributes
//     // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
//     // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
//     var modal = $(this)
//     modal.find('.modal-title').text('New message to ' + recipient)
//     modal.find('.modal-body input').val(recipient)
//   })