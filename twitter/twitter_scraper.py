from twitterscraper import query_tweets
from datetime import datetime
from pandas import DataFrame
import re
from googletrans import Translator

import nltk
nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer

import numpy as np
from matplotlib import pyplot as plt

sid = SentimentIntensityAnalyzer()

def delete_hashtags(tweet):
    return re.sub('#', '', tweet)

# return date from string
def valid_date(s):
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except ValueError:
        print("Not a valid date: {}".format(s))

def get_tweets(query='', lang=None, location=None, radius=50, begindate=None, enddate=None):

    if location is not None:
        query += ' near:{}'.format(location)
        query += ' within:{}km'.format(radius)
    if lang is not None:
        query += ' lang:{}'.format(lang)
   
    query += ' since:{}'.format(begindate)
    query += ' until:{}'.format(enddate)

    begindate = valid_date(begindate)
    enddate = valid_date(enddate)

    print(query)
    return query_tweets(query=query, limit=None, begindate=begindate, enddate=enddate, poolsize=1, lang=lang)

def sentiment_analysis(row):
    if 'translation' in row.keys():
        trans = row['translation']
    else:
        trans = row['text']
    sentiment = sid.polarity_scores(trans)

    row['negative'] = sentiment['neg']
    row['neutral'] = sentiment['neu']
    row['positive'] = sentiment['pos']

    return row


def time_analysis(query='', lang=None, location=None, radius=50, begindate=None, enddate=None, do_sentiment_analysis=True):
    tweets = get_tweets(query=query, lang=lang, location=location, radius=radius, begindate=begindate, enddate=enddate)
    tweets_df = DataFrame([[tweet.user_id, delete_hashtags(tweet.text), tweet.retweets, tweet.timestamp] for tweet in tweets], columns=['user_id', 'text', 'retweets', 'timestamp'])

    if lang != 'en' and sentiment_analysis == True:
        translator = Translator()
        tweets_text = tweets_df['text'].tolist()
        translations = translator.translate(tweets_text)
        translations = [x.text for x in translations]
        tweets_df['translation'] = translations

    
    if do_sentiment_analysis:
        tweets_df_with_sentiment = tweets_df.apply(sentiment_analysis, axis=1)

    tweets_df_per_period = tweets_df_with_sentiment.set_index(tweets_df_with_sentiment['timestamp'])[['negative', 'neutral', 'positive']].resample('W').sum()

    neg = np.array(tweets_df_per_period['negative'].to_list())
    neutr = np.array(tweets_df_per_period['neutral'].to_list())
    pos = np.array(tweets_df_per_period['positive'].to_list())

    neg_neutr = neg + neutr
    neg_neutr_pos = neg_neutr + pos

    neg = neg.tolist()
    neg_neutr = neg_neutr.tolist()
    neg_neutr_pos = neg_neutr_pos.tolist()

    dates = [x.strftime("%d %b") for x in tweets_df_per_period.index.tolist()]
    return {
        "dates": dates,
        "neg": neg,
        "neutr": neg_neutr,
        "pos": neg_neutr_pos
    }