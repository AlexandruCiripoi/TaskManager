/* ============ from engine ============ */
import { categories, stateText } from "./settings.js";
import { TaskList } from "./classes.js";

let taskListObject=new TaskList(); //Create a new Tasklist object
taskListObject.readFromLocalStorage(); //read data from local storage into it

let tableData = taskListObject.taskArray; //just use the array inside TaskList for our table data


/* make categoties, state and dates corrections text */
tableData=tableData.map(v=>{
    v.category=categories[v.category];
    v.dateStart = !v.dateStart ? "" : new Date(v.dateStart).toLocaleDateString();
    v.dateEnd = !v.dateEnd  ? "" : new Date(v.dateEnd).toLocaleDateString();
    v.currentState = stateText[v.currentState];
    return v});
/* ------------------------------------------ */

$(document).ready(function() {
    var table = $('#table').DataTable( {
        data: tableData,
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { data: "caption" },
            { data: "dateStart" },
            { data: "timeStart" },
            { data: "dateEnd" },
            { data: "timeEnd" },
            { data: "category" },
            { data: "currentState" } 
        ],
        "order": [[1, 'asc']]
    } 

    );
    // Add event listener for opening and closing details
    $('#table tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
            // addListiner(row.data())
        }
    } );
} );

function format ( d ) {
    // `d` is the original data object for the row
    let result = d.description;
    return result
}