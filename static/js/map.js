let map = L.map('mapid').setView([50.6352401,3.9593289], 5);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11', // 'mapbox/satellite-v9' (different options available)
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoiam9uYXN2ZHYiLCJhIjoiY2s4enZnb2twMGV6aDNtcHI5d3I2ZXM5NCJ9.P8DrzaqAPYTuEHJDY6dVOA'
}).addTo(map);

let coronaFocus = document.getElementById("corona-filter").value;
let use_absolute_numbers = document.getElementById("check-absolute-numbers").checked;

// color scheme: https://colorbrewer2.org/?type=sequential&scheme=YlOrRd&n=9
let colorscheme = ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'];
// for recovered cases, use positive colors: https://colorbrewer2.org/?type=sequential&scheme=YlGn&n=9
let recovered_colorscheme = ['#ffffe5','#f7fcb9','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#006837','#004529']
let _grades_relative = {
    'confirmed': [0, 50, 100, 200, 300, 400, 500, 600, 700],
    'deaths': [0, 10, 20, 40, 50, 60, 70, 80, 90],
    'recovered': [0, 50, 100, 200, 250, 300, 400, 500, 600],
}
let _grades_absolute = {
    'confirmed': [0, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000],
    'deaths': [0, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
    'recovered': [0, 1000, 2000, 4000, 10000, 20000, 40000, 100000, 200000],
}

function getGrades(){
    if (use_absolute_numbers) return _grades_absolute;
    return _grades_relative;
}


function getColor(d) {
    if (d === -1)
        return '#ffffff';
    let _grades = getGrades();
    if (coronaFocus == "recovered") {
        for (let i = 8; i >= 1; i--)
            if (d > _grades[coronaFocus][i]) return recovered_colorscheme[i];
    } else {
        for (let i = 8; i >= 1; i--)
            if (d > _grades[coronaFocus][i]) return colorscheme[i];
    }
    return colorscheme[0];
}

function style(feature) {    
    let confirmed = feature.properties.confirmed;
    return {
        fillColor: getColor(confirmed),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

let geojson = null;
let current_geojson_data;

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function handleFeatureClick(e){
    zoomToFeature(e);
    selectedCountry = e.target.feature.properties.countryname;
    
    if (selectedCountry in corona_country_translation){
        selectedCountry = corona_country_translation[selectedCountry];
    }

    let title = coronaChart.title.options.text;
    if (title.includes(':')){
        title = title.slice(0, title.indexOf(':'));
    }
    title += ": " + selectedCountry;
    coronaChart.title.options.text = title;
    
    updateGraph(coronaChart, getCoronaData());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: handleFeatureClick
    });
}

let corona_country_translation = {
"The Bahamas" :"Bahamas",
"Ivory Coast":"Cote d'Ivoire",
"Cyprus No Mans Area":"Cyprus",
"Democratic Republic of the Congo":"Congo (Kinshasa)",
"Republic of Congo":"Congo (Brazzaville)",
"Northern Cyprus":"Cyprus",
"Czech Republic":"Czechia",
"Guinea Bissau":"Guinea-Bissau",
"Isle of Man":"United Kingdom",
"South Korea" :"Korea, South",
"Macedonia" :"North Macedonia",
"Myanmar" :"Burma",
"Puerto Rico":"US",
"Republic of Serbia" :"Serbia",
"Taiwan" :"Taiwan*",
"United Republic of Tanzania":"Tanzania",
"United States Minor Outlying Islands" :"US",
"United States of America":"US",
"US Naval Base Guantanamo Bay" :"US"
}

function LoadGeoJson(json) {
    let newgeojson = L.geoJson(json, {
        style: style,
        onEachFeature: onEachFeature
    })
    if (geojson != null) geojson.removeFrom(map);
    // add before removing previous, to not have weird transitions
    newgeojson.addTo(map);
    geojson = newgeojson;
}

function AddCasesToJson(json, date_offset) {
    if (json == null){
        json = borderData;
    }
    if (date_offset == null) {
        let country_data = coronaTimeseriesData["Afghanistan"];
        date_offset = country_data.length -1;
    }

    json['features'].forEach((country) => {
        let key = country['properties']['ADMIN'];
        let cases = "N/A";

        if (key in corona_country_translation){
            key = corona_country_translation[key];
        }
        if (key in coronaTimeseriesData) {
            let country_corona_data = coronaTimeseriesData[key];
            let useful = country_corona_data[date_offset];
            if (populationData == null){
                cases = useful[coronaFocus];
            } else{
                if (key in populationData){
                    cases = useful[coronaFocus];
                    if (!use_absolute_numbers){
                        // per 100 000 inhabitants
                        cases = cases * 100000 / populationData[key];
                        cases = Math.round(cases);
                    } 
                }else {
                    console.log(key + " could not be matched with population data");
                }
            }
            
        }
        country['properties']['countryname'] = country['properties']['ADMIN']
        country['properties']['confirmed'] = cases;
    });
    return json
}

function AddCasesToJsonAndLoadInMap(json, date_offset) {
    if (json == null) json = borderData;
    json = AddCasesToJson(json, date_offset);
    current_geojson_data = json;
    LoadGeoJson(json);
    return json;
}

function fetchCoronaData() {
    return fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(json => coronaTimeseriesData=json)
}

function getPopulationData() {
    return fetch("static/json/country_population_2020.json")
    .then(data => data.json())
    .then(json => populationData = json)
}

function getCountryBorders() {
    return fetch("static/json/countries_borders.geojson")
        .then(data => data.json())
        .then(json => borderData = json)
}

function getAllData(){
    return Promise.all([fetchCoronaData(), getPopulationData(), getCountryBorders()])
}

getAllData()
.then(() => AddCasesToJsonAndLoadInMap(borderData))
// update UI elements as soon as possible
.then(() => OnTimelineChanged());

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class"info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    let title = "";
    if (coronaFocus == 'confirmed')
        title = "Confirmed virus cases";
    else if (coronaFocus == 'recovered')
        title = "Confirmed recovered cases";
    else
        title = "Confirmed deaths";
    
    let note = "";
    if (!use_absolute_numbers) note = "(per 100k inhabitants)";

    this._div.innerHTML = '<h4>' + title + ' ' + note + '</h4>' +  (props ?
        '<b>' + props.ADMIN + '</b><br />' + props.confirmed + ' cases'
        : 'Hover over a country');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = getGrades()[coronaFocus],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);