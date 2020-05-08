let current_keyword = "";
let base_date = new Date("2020-1-22"); // start of timeseries data
let last_date = null; // end of timeseries data
let num_days;
let activeDate;

function getNewKeyword() {
    let source = document.getElementById("keyword");
    current_keyword = source.value;
}

function TwitterFilterChanged(){
    let value = document.getElementById("filter").value;
    if (value == "location") {
        document.getElementById("location-warning").style.display = "inline";
    } else {
        document.getElementById("location-warning").style.display = "none";
    }
}

// source: https://stackoverflow.com/a/543152
function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
}

function SetDateRange(){
    let country_data = coronaTimeseriesData["Afghanistan"];
    let newest = country_data[country_data.length -1];
    last_date = new Date(newest.date);
    
    num_days = datediff(base_date, last_date);
    range.max= num_days;
    range.value= num_days;
}

// this probably breaks with DST over a few years
function addDays(date, days) {
    let orig_millis = date.getTime();
    let day_to_millis = 24*60*60*1000;
    let result = new Date();
    result.setTime(orig_millis + days * day_to_millis);
    return result;
}

function getDateString(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) day = "0"+day;
    if (month < 10) month = "0"+month;

    return day + "/" + month + "/" + year;
}

function OnTimelineChanged(){
    if (last_date == null){
        // look up coronadata to get accuracte last date
        SetDateRange();
    }
    dateOffset = range.value;
    activeDate = addDays(base_date, dateOffset);
    
    dateField.innerHTML = getDateString(activeDate);
}

function RedrawMap(){
    AddCasesToJsonAndLoadInMap(current_geojson_data, dateOffset);
}

document.getElementById("keywordBtn").addEventListener("click", getNewKeyword);
let range = document.getElementById("dayRange");
range.oninput = OnTimelineChanged;  // update when dragging, not only when unclicking
document.getElementById("dayRange").onchange = RedrawMap;  // update when dragging, not only when unclicking
let dateField = document.getElementById("currentDateFilter");

// button slider controls
function skip(amount) {
    let min = range.min;
    let max = range.max;
    let value = parseInt(range.value);

    let newvalue = value + amount;
    if (newvalue < min) newvalue = min;
    else if (newvalue > max) newvalue = max;
    range.value = newvalue;
    OnTimelineChanged();
    RedrawMap();
}

document.getElementById("skip_back_7").onclick = () => skip(-7);
document.getElementById("skip_back_1").onclick = () => skip(-1);
document.getElementById("skip_front_1").onclick = () => skip(1);
document.getElementById("skip_front_7").onclick = () => skip(7);