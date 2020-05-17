# BDS PROJECT 2020 - GROUP 29

## Overview
- [General Idea](#general-idea)
- [Setup](#setup)
- [Use](#use)
- [Example](#example)
- [Acknowledgement](#acknowledgement)

## General Idea
The COVID-19 pandemic is shaking up our daily lives and has resulted in a series of odd trends. Suddenly people started hoarding toilet paper, shaving their heads bald and collectively baking their own bread. This has lead to empty toilet paper racks and an increased (online) sale of electric hair clippers and bread machines. Due to limited real life social interaction, social media plays an even bigger role in the spreading and adaptation of these trends than usual. Consequently, noticing them early could enable unique business/humanitarian opportunities.

This tool allows a user to provide one or more keywords (such as "bread machine") and a location (e.g. "Belgium") and returns the evolution of twitter's interest in that keyword based on number of tweets/retweets involving that keyword during a certain time window. In addition, an existing COVID-19 Data API is used to also identify the evolution of number of contaminated/dead/recovered patients during that time window for that location. The necessary visualizations for both enable a user to correlate the interest in certain products/terms to the stage of the crisis that a location is in. Future business (and in parallel humanitarian) opportunities can then be discovered for locations that are currently behind on the curve.

## Setup
Running the server locally requires
- python3 (explicitly tested for python3.6.9)
- pip

### Clone the repository
```
# clone
git clone https://github.ugent.be/agvdndor/bds-project-2020.git

# change directory
cd bds-project-2020/
```

### Setting up de environment
```
# install virtualenv
pip install virtualenv

# create the environment
virtualenv -p python3 venv

# activate the environment
# Linux/Mac
source venv/bin/activate
# Windows
venv\Scripts\activate

# install dependencies
pip install -r requirements.txt
```

### Start flask server
```
# indicate flask app source file
export FLASK_APP=server.py

# run flask
python -m flask run
```

## Use

## Example

## Acknowledgement
