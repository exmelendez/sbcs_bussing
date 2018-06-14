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
  var timeOfDay = AMPM();
  
  if(idArray[0] != 0){
    if (alreadyLogged(idArray[0], timeOfDay)){
      return idArray[1] + " already logged for " + timeOfDay + " attendance today."
    } else {
        addDataToSS (idArray[0], idArray[1]);
        return idArray[1] + " logged.";
    }
  }
  return "ID # " + id + " not found";
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

function alreadyLogged(id, timeOfDay){
  
  var currentDate = createTimeStamp("currentDate");
  var attendanceLog = logSheet.getRange(2, 1, logSheet.getLastRow(), logSheet.getLastColumn()).getValues();
  
  for (var i = 0; i < attendanceLog.length; i++){
    var ssTimeObject = attendanceLog[i][3].toString();
    var ssDateObject = attendanceLog[i][2].toString();
    var hourStr = ssTimeObject.charAt(16) + ssTimeObject.charAt(17);
    var logTimeOfDay = AMPMExtract(hourStr);
    var logDate = "";
    
    for (var j = 4; j < 15; j++){
        logDate += ssDateObject.charAt(j);
    }
    
    if (attendanceLog[i][0] === id && logDate === currentDate && logTimeOfDay === timeOfDay){
      return true;
    }
  }
  return false;
}

/* Adds a row w/ specified data 
   to log spreadsheet.
**************************************/
function addDataToSS (id, name) {
  logSheet.appendRow([id,name, createTimeStamp("currentDate"), createTimeStamp("time")]);
}

/* Returns "AM", "PM" or "Invalid Hour"
   based on the current hour.
**************************************/
function AMPM(){
  var currentHourStr = createTimeStamp("hourTime");
  var currentHourNum = parseInt(currentHourStr, 10);
  
  if (currentHourNum < 7){
    return "Invalid Hour";
  } else if (currentHourNum > 6 && currentHourNum < 11) {
    //returns "AM" between the hours of 6am to 10am
    return "AM";
  } else if (currentHourNum > 10 && currentHourNum < 18) {
    //returns "PM" between the hours of 11am to 5pm
    return "PM";
  } else if (currentHourNum > 17) {
    return "Invalid Hour";
  }
}

/* Returns "AM", "PM" or "Invalid Hour"
   based on given parameter hour.
**************************************/
function AMPMExtract(time){
  var currentHourNum = parseInt(time, 10);
  
  if (currentHourNum < 7){
    return "Invalid Hour";
  } else if (currentHourNum > 6 && currentHourNum < 11) {
    //returns "AM" between the hours of 6am to 10am
    return "AM";
  } else if (currentHourNum > 10 && currentHourNum < 18) {
    //returns "PM" between the hours of 11am to 5pm
    return "PM";
  } else if (currentHourNum > 17) {
    return "Invalid Hour";
  }
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
    case "hourTime":
        return date.charAt(16) + date.charAt(17);
    case "currentDate":
        return date.charAt(4) + date.charAt(5) + date.charAt(6) + " " + date.charAt(8) + date.charAt(9) + " " + date.charAt(11) + date.charAt(12) + date.charAt(13) + date.charAt(14);
    default: 
        return date;
  }
}