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
        dataPoints: [
            { x: new Date(2016, 2), y: 30000 },
            { x: new Date(2016, 3), y: 35000 },
            { x: new Date(2016, 4), y: 30000 },
            { x: new Date(2016, 5), y: 30400 },
            { x: new Date(2016, 6), y: 20900 },
            { x: new Date(2016, 7), y: 31000 },
            { x: new Date(2016, 8), y: 30200 },
            { x: new Date(2016, 9), y: 30000 },
            { x: new Date(2016, 10), y: 33000 },
            { x: new Date(2016, 11), y: 38000 },
            { x: new Date(2017, 0),  y: 38900 },
            { x: new Date(2017, 1),  y: 39000 }
        ]
     },
    {
        type: "splineArea", 
        showInLegend: true,
        name: "Negative",
        yValueFormatString: "$#,##0",
        dataPoints: [
            { x: new Date(2016, 2), y: 20100 },
            { x: new Date(2016, 3), y: 16000 },
            { x: new Date(2016, 4), y: 14000 },
            { x: new Date(2016, 5), y: 18000 },
            { x: new Date(2016, 6), y: 18000 },
            { x: new Date(2016, 7), y: 21000 },
            { x: new Date(2016, 8), y: 22000 },
            { x: new Date(2016, 9), y: 25000 },
            { x: new Date(2016, 10), y: 23000 },
            { x: new Date(2016, 11), y: 25000 },
            { x: new Date(2017, 0), y: 26000 },
            { x: new Date(2017, 1), y: 25000 }
        ]
     },
    {
        type: "splineArea", 
        showInLegend: true,
        name: "Neutral",
        yValueFormatString: "$#,##0",     
        dataPoints: [
            { x: new Date(2016, 2), y: 10100 },
            { x: new Date(2016, 3), y: 6000 },
            { x: new Date(2016, 4), y: 3400 },
            { x: new Date(2016, 5), y: 4000 },
            { x: new Date(2016, 6), y: 9000 },
            { x: new Date(2016, 7), y: 3900 },
            { x: new Date(2016, 8), y: 4200 },
            { x: new Date(2016, 9), y: 5000 },
            { x: new Date(2016, 10), y: 14300 },
            { x: new Date(2016, 11), y: 12300 },
            { x: new Date(2017, 0), y: 8300 },
            { x: new Date(2017, 1), y: 6300 }
        ]
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


