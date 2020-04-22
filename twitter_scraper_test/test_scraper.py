from twitterscraper import query_tweets
from datetime import datetime
from pandas import DataFrame

# advanced query
location =  None

radius = None

terms = [['brood'], ['homemade', 'zelfgemaakt']]



# limit (should always be None for our case)
limit = None

## begin and end date are very import to us
begindate = '2020-04-01'
enddate = datetime.today().strftime('%Y-%m-%d')

lang = None

query = ''
for id1, and_group in enumerate(terms):
    if id1 == 0:
        query += '('
    else:
        query += ' AND ('
    query += ' OR '.join(and_group)
    query += ')'

if location:
    query += ' near:{}'.format(location)
if radius:
    query += ' within:{}'.format(radius)
if lang:
    query += ' lang:{}'.format(lang)
if begindate:
    query += ' since:{}'.format(begindate)
if enddate:
    query += ' until:{}'.format(enddate)

print(query)

def valid_date(s):
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except ValueError:
        msg = "Not a valid date: '{0}'.".format(s)
        raise argparse.ArgumentTypeError(msg)

begindate = valid_date(begindate)
enddate = valid_date(enddate)

tweets = query_tweets(query= query, limit=limit, begindate=begindate, enddate=enddate, poolsize=20, lang=lang)
print(tweets)