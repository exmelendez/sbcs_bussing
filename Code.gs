var ss = SpreadsheetApp.openById("1ArhJYxLHB_UwKMRsahybdB7hekImv3fge4VHY2L_Eic");
var rosterSheet = ss.getSheetByName("roster");
var logSheet = ss.getSheetByName("log");

function test(){}

function doGet() { 
  return HtmlService
  .createTemplateFromFile('index')
  .evaluate(); 
}

/* Text
**************************************/
function log(fieldText){
  
  var id = parseInt(fieldText, 10);
  var idArray = idPresent(id);
  
  if(idArray[0] != 0){
    addDataToSS (idArray[0], idArray[1]);
    return "ID found";
  }
  
  return "ID not found";
}

/* Searches the Google Sheet for
   the given barcode. Returns array w/
   with the id number in the 0 index 
   and the name in the 1st index If 
   not successful both index's hold 0.
**************************************/
function idPresent(id){
  var rosterIDs = rosterSheet.getRange(2, 1, rosterSheet.getLastRow(), rosterSheet.getLastColumn()).getValues();
  var idSearchResults = [];

  for (var i = 0; i < rosterIDs.length; i++){
    if (id === rosterIDs[i][0]){
      idSearchResults.push(rosterIDs[i][0]);
      idSearchResults.push(rosterIDs[i][1]);
      return idSearchResults;
    }
  }

  idSearchResults.push(0);
  idSearchResults.push(0);
  return idSearchResults;
}

/* Adds a row w/ specified data 
   to log spreadsheet.
**************************************/
function addDataToSS (id, name) {
  logSheet.appendRow([id,name, createTimeStamp("currentDate"), createTimeStamp("time")]);
}

//returns a string of the full current date by default or can be filtered by string keyword for a specific part of the string date.
function createTimeStamp(input){
  var date = Date();
  
  switch (input) {
    case "dayName":
        return date.charAt(0) + date.charAt(1) + date.charAt(2);
    case "month":
        return date.charAt(4) + date.charAt(5) + date.charAt(6);
    case "dayNum":
        return date.charAt(8) + date.charAt(9);
    case "year":
        return date.charAt(11) + date.charAt(12) + date.charAt(13) + date.charAt(14);
    case "time":
        return date.charAt(16) + date.charAt(17) + date.charAt(18) + date.charAt(19) + date.charAt(20) + date.charAt(21) + date.charAt(22) + date.charAt(23);
    case "currentDate":
        return date.charAt(4) + date.charAt(5) + date.charAt(6) + " " + date.charAt(8) + date.charAt(9) + " " + date.charAt(11) + date.charAt(12) + date.charAt(13) + date.charAt(14);
    default: 
        return date;
  }
}