const button = document.querySelector("button");


//var siteHost = 'http://localhost:3001/sites/';  
//var examHostpwr = 'http://localhost:3001/pwr/';
//var examHostbwr = 'http://localhost:3001/bwr/';  

import { getOne } from './site-flags.js';
import { getBWRExam } from './bwr-ka-catalog.js'
import { getPWRExam } from './pwr-ka-catalog.js'



button.addEventListener('click', ()=> {

    //var examQuery = '';

    // Get the selected site flags:
    var siteSelected = document.querySelector("select");
    console.log(siteSelected.options[siteSelected.selectedIndex]);

    //let queryUrl = siteHost + siteSelected.options[siteSelected.selectedIndex].value;
    //console.log(queryUrl);

    // Call module function to get site data:

    var response = getOne(siteSelected.options[siteSelected.selectedIndex].value);
    console.log(response)
    console.log(response.PlantName)


    // Store the site flags based on whether the site is a BWR or a PWR:
    var siteName = response.PlantName;
    var siteRxType = response.ReactorType;

    if (siteRxType === "B") {//  If it is a BWR, store the correct flags and call the BWR exam topic generator function
        var markIIIflag = response.MarkIIIflag;
        var containmentType = response.ContainmentType;
        var multiUnitFlag = response.MultiUnit;
        var hpci = response.hpciFlag;
        var designType = response.DesignType;
        
        if (siteName === "Dresden" || siteName === 'Nine Mile Point 1') {
            var isoCondenser = 1;
        }
        else {
            var isoCondenser = 0;
        }
        
        var rhrFlag = response.rhrLPCI;
        //examQuery = 'http://localhost:3001/bwr/' + parseInt(designType) + '/isocondenser/'+parseInt(isoCondenser)+'/multi/'+parseInt(multiUnitFlag)+'/containment/'+containmentType;

        // Select BWR exam topics:
        var examQuery = getBWRExam(parseInt(designType),parseInt(isoCondenser),parseInt(multiUnitFlag),containmentType);

    }
    else { // store the correct PWR flags and call the PWR exam topic generator function

        var iceCondenser = response.IceCondenser;
        var designType = response.DesignType;
        var multiUnitFlag = response.MultiUnit;
        // examQuery = 'http://localhost:3001/pwr/' + designType + '/icecondflag/'+parseInt(iceCondenser)+'/multi/'+parseInt(multiUnitFlag);
        examQuery = getPWRExam(designType,parseInt(iceCondenser),parseInt(multiUnitFlag));
    }


    // If the response is good, let's update the page with the results:
    console.log(examQuery);

    /// create a Table with the returned job results from the query:

    // check if a table exists on the page already (for multiple searches):
    let tableCheck = document.querySelector("table");
    if (tableCheck !== null) {  // if a table exists, delete it.
        var parentTable = tableCheck.parentElement;
        parentTable.removeChild(tableCheck);
    };

    function createTable() {

        var topicTitles = examQuery.titles;
        var topicImportance = examQuery.importance;
        var topicCategory = examQuery.kaCats;
        var topicSystems = examQuery.systems;

        // Set up the array of headers for the table columns:
        var headers = ["Question Number", "Topic Title", "Topic Importance","Topic Category","Topic System"];
        var table = document.createElement("TABLE");  //make a table element for the page

        // add a class to the table for dynamic styling:          

        table.setAttribute("class", "jobs_table");

        if (topicTitles.length > 0) {//  If there are  results, display them in a table.

            for(var i = 0; i < topicTitles.length; i++) { // For each job, insert a row with the desired information
                var row = table.insertRow(i);
                row.classList.add("table_row"); // add a class to the table row
                row.insertCell(0).innerHTML = parseInt(i+1);
                row.insertCell(1).innerHTML = topicTitles[i];
                row.insertCell(2).innerHTML = topicImportance[i];
                row.insertCell(3).innerHTML = topicCategory[i];
                row.insertCell(4).innerHTML = topicSystems[i];                    
            }
        }
        else {  // if no jobs are returned, dispaly a no jobs returned message to alert the user.
            var row = table.insertRow(i);
            row.insertCell(0).innerHTML = "No jobs returned for this search.";
            row.insertCell(1).innerHTML = "";
            row.insertCell(2).innerHTML = "";
            row.insertCell(3).innerHTML = "";
            row.insertCell(4).innerHTML = "";


        }
    
        var header = table.createTHead();
        var headerRow = header.insertRow(0);
        header.classList.add("table_header");
        for(var i = 0; i < headers.length; i++) {
            headerRow.insertCell(i).innerHTML = headers[i];
        }
    
        document.body.appendChild(table);

        

    };
    
    createTable();

});



