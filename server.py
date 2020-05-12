# Main server file
from flask import Flask, render_template, request, redirect
app = Flask(__name__)
from server_utils import download_country_json
import json


@app.route('/')
def home():
    
    # this could be used to cache time series 
    #download_country_json()

    return render_template('index.html')


# This should not be necessary through the use of for_url but somehow, somewhere it breaks without
@app.route('/country_population_2020.json')
def country_population():
    with open('static/json/country_population_2020.json') as json_file:
        return json.load(json_file)

# This should not be necessary through the use of for_url but somehow, somewhere it breaks without
@app.route('/countries_borders.geojson')
def country_borders():
    with open('static/json/countries_borders.geojson') as json_file:
        return json.load(json_file)