import os.path as osp
from time import time
import wget

def download_country_json():
    source_url = "https://pomber.github.io/covid19/timeseries.json"

    # check if file already exists and if it is older than 1 hour
    file_path  = osp.join('.', 'static', 'json', 'timeseries.json')
    if osp.isfile(file_path):
        # check if it is older than an hour
        file_age = osp.getmtime(file_path)
        if time() - file_age < 3600:
            print('using cached time series...')
            return
    

    # download file
    wget.download(source_url, file_path)

