# Main server file
from flask import Flask, render_template, request, redirect, jsonify
app = Flask(__name__)
from server_utils import download_country_json
import json

from twitter.twitter_scraper import time_analysis


@app.route('/')
def home():
    
    # uncomment to cache time series per day (also change source of data in static/js/main.js)
    #download_country_json()

    return render_template('index.html')


# Make population data publically available as well as internally (instead of for_url use)
@app.route('/country_population_2020.json')
def country_population():
    with open('static/json/country_population_2020.json') as json_file:
        return json.load(json_file)

# Make country data publically available as well as internally (instead of for_url use)
@app.route('/countries_borders.geojson')
def country_borders():
    with open('static/json/countries_borders.geojson') as json_file:
        return json.load(json_file)

'''
query twitter based on search criteria and count weekly negative, neutral and positive tweets
returns:
    - dict
        - dates
        - neg
        - neutr
        - pos
'''
@app.route('/twitter_scraper')
def twitter_scraper():
    print("request received")
    query = request.args.get('query', default= '', type=str)
    begindate = request.args.get('begindate', default= '', type=str)
    enddate = request.args.get('enddate', default= '', type=str)
    locationUsed = True if request.args.get('locationUsed') == 'true' else False
    location = request.args.get('location', default= '', type=str)
    radius = request.args.get('radius', default= 50, type=int)
    lang =  request.args.get('lang', default= 'None', type=str)
    
    if lang == 'all':
        lang = None

    # for debugging purposes   
    #print('{} {} {} {} {} {}'.format(query, begindate, enddate, locationUsed, location, radius))

    # analyze twitter behavior
    if locationUsed:
        result_dict = time_analysis(query=query, lang=lang, location=location, radius=radius, begindate=begindate, enddate=enddate)
    else:
        result_dict = time_analysis(query=query, lang=lang, begindate=begindate, enddate=enddate)

    return jsonify(result_dict)