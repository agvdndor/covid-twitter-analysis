let current_keyword = "";
let base_date = new Date("2020-01-22"); // start of timeseries data

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

document.getElementById("keywordBtn").addEventListener("click", getNewKeyword);
