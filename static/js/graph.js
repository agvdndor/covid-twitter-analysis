var neg = []

var neg_neutr = []

var neg_neutr_pos =  []

var first_twitter_date = null;
var last_twitter_date = null;


var twitterChart = new CanvasJS.Chart("twitterChartContainer", {
    animationEnabled: true,
    title:{
        text: "Twitter interest of keyword"
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
        name: "Negative + Neutral + Positive",
        color: 'green',
        dataPoints: neg
     },
    {
        type: "splineArea", 
        showInLegend: true,
        color: 'orange',
        name: "Negative + Neutral",
        dataPoints: neg_neutr
     },
    {
        type: "splineArea", 
        showInLegend: true,
        color: 'red',
        name: "Negative",     
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

let name_to_index_map_twitter = {
    'negative': 0,
    'negative + neutral': 1,
    'negative + neutral + positive': 2,
}

function updateTwitterData(data){
    // clear current data
    for (let i = 0; i < twitterChart.data.length; i++){
        while(twitterChart.data[i].dataPoints.length > 0) { // clear old contents
            twitterChart.data[i].dataPoints.pop();
        }
    }
    dates = data['dates'];
    first_twitter_date = new Date(dates[0]);
    last_twitter_date = new Date(dates[dates.length - 1]);
    for(let i = 0; i < data['dates'].length; i++){
        date = new Date(data['dates'][i])
        neg_val = data['neg'][i]
        neg_neutr_val = data['neutr'][i]
        neg_neutr_pos_val = data['pos'][i]

        twitterChart.data[2].dataPoints.push({x: date, y: neg_val})
        twitterChart.data[1].dataPoints.push({x: date, y: neg_neutr_val})
        twitterChart.data[0].dataPoints.push({x: date, y: neg_neutr_pos_val})
    }

 
    twitterChart.render()
    updateGraph(coronaChart, getCoronaData());  // also update corona chart to match the twitter chart date limits
}


let name_to_index_map = {
    'confirmed': 0,
    'recovered': 1,
    'deaths': 2,
}

function getCoronaData() {
    if (selectedCountry == null) return [];
    let types = ['confirmed', 'deaths', 'recovered'];
    let data = {};
    types.forEach(type => data[type]= []);
    
    let country_data = coronaTimeseriesData[selectedCountry];
    let size = country_data.length;

    for (let i=0;i<size; i++) {
        let entry = country_data[i];

        let date = new Date(entry.date);
        if ((first_twitter_date == null && last_twitter_date == null) || (date >= first_twitter_date && date <= last_twitter_date)){
            types.forEach(type => data[type].push({x: date, y: entry[type]}));
        }
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


