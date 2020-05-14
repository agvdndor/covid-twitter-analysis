# Main server file
from flask import Flask, render_template, request, redirect, jsonify
app = Flask(__name__)
from server_utils import download_country_json
import json

from twitter.twitter_scraper import time_analysis


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


@app.route('/twitter_scraper')
def twitter_scraper():
    print("request received")
    query = request.args.get('query', default= '', type=str)
    begindate = request.args.get('begindate', default= '', type=str)
    enddate = request.args.get('enddate', default= '', type=str)
    locationUsed = request.args.get('locationUsed', default= False, type=bool)
    location = request.args.get('location', default= '', type=str)
    radius = request.args.get('radius', default= 50, type=int)
    lang =  request.args.get('lang', default= 'None', type=str)
    
    if lang == 'all':
        lang = None
        
    print('{} {} {} {} {} {}'.format(query, begindate, enddate, locationUsed, location, radius))


    if locationUsed:
        result_dict = time_analysis(query=query, lang=lang, location=location, radius=radius, begindate=begindate, enddate=enddate)
    else:
        result_dict = time_analysis(query=query, lang=lang, begindate=begindate, enddate=enddate)

    print(result_dict)
    return jsonify(result_dict)