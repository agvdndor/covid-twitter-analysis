var neg = []

var neg_neutr = []

var neg_neutr_pos =  []

function updateTwitterData(arg_neg,arg_neg_neutr,arg_neg_neutr_pos){
    neg = arg_neg
    neg_neutr = arg_neg_neutr
    neg_neutr_pos = arg_neg_neutr_pos
}

var twitterChart = new CanvasJS.Chart("twitterChartContainer", {
    animationEnabled: true,
    title:{
        text: "Twitter interest of <keyword>"
    },
    backgroundColor: "#FFDBC0",
    axisY :{
        includeZero: false,
    },
    toolTip: {
        shared: true
    },
    legend: {
        fontSize: 13
    },
    data: [{
        type: "splineArea",
        showInLegend: true,
        name: "Positive",
        yValueFormatString: "$#,##0",
        xValueFormatString: "MMM YYYY",
        dataPoints: neg
     },
    {
        type: "splineArea", 
        showInLegend: true,
        name: "Negative",
        yValueFormatString: "$#,##0",
        dataPoints: neg_neutr
     },
    {
        type: "splineArea", 
        showInLegend: true,
        name: "Neutral",
        yValueFormatString: "$#,##0",     
        dataPoints: neg_neutr_pos
     }]
});

let coronaChart = new CanvasJS.Chart("coronaChartContainer", {
    animationEnabled: true,
    title:{
        text: "Corona cases timeline"
    },
    backgroundColor: "#FFDBC0",
    axisY :{
        includeZero: true,
    },
    toolTip: {
        shared: true
    },
    legend: {
        fontSize: 13
    },
    data: [{
        type: "splineArea",
        showInLegend: true,
        color: "#4F81FF",  // sets legend color
        name: "Confirmed cases",
        xValueFormatString: "DD MM YYYY",
        dataPoints: []
     },{
        type: "splineArea",
        showInLegend: true,
        color: "#A3CF61",  // sets legend color
        name: "Recoveries",
        xValueFormatString: "DD MM YYYY",
        dataPoints: []
     },{
        type: "splineArea",
        showInLegend: true,
        name: "Deaths",
        color: "#EF6770",  // sets legend color
        xValueFormatString: "DD MM YYYY",
        dataPoints: []
     },
    ]
});

let name_to_index_map = {
    'confirmed': 0,
    'recovered': 1,
    'deaths': 2,
}

function getCoronaData() {
    let types = ['confirmed', 'deaths', 'recovered'];
    let data = {};
    types.forEach(type => data[type]= []);
    
    let country_data = coronaTimeseriesData[selectedCountry];
    let size = country_data.length;
    for (let i=0;i<size; i++) {
        let entry = country_data[i];

        let date = entry.date;
        types.forEach(type => data[type].push({x: new Date(date), y: entry[type]}));
    }
    return data;
}

function updateGraph(chart, data){
    for (let key in data){
        let new_data = data[key];
        let idx = name_to_index_map[key];

        while(chart.data[idx].dataPoints.length > 0) { // clear old contents
            chart.data[idx].dataPoints.pop();
        }

        let size = new_data.length;
        for (let i=0;i<size; i++) {
            let datapoint = new_data[i];
            chart.data[idx].dataPoints.push(datapoint);
        }
    }
    
    chart.render(); // should be update(), but doesn't seem to exist..
}

window.onload = function () {
    twitterChart.render();
    coronaChart.render();
}


