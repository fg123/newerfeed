import csv
from newspaper import Article
import json
from urllib.request import urlopen
import requests
import re

from collections import Counter
commonenglish = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", \
"not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", \
"we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", \
"what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", \
"like", "time", "no", "just", "him", "know", "take", "person", "into", "year", "your", "good", "some", \
"could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", \
"also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", \
"new", "want", "because", "any", "these", "give", "day", "most", "us", "was", "is", "been", "had", "it's", "told",]

def frequency(article_text):
    words = article_text.split()
    words = list(filter(lambda x: x not in commonenglish, list(map(lambda x: x.lower(), words))))
    counts = Counter(words)
    return dict(counts.most_common(10))

sources = ["abc-news-au", "bbc-news", "bloomberg", "breitbart-news", "business-insider", "cnbc", "cnn", "the-new-york-times", "the-wall-street-journal"]


total_article=[]

for i in sources:
	response = requests.get("https://newsapi.org/v1/articles?source="+i+"&apiKey=ca4f45d8a33049c1a7a6ba97cfc8bd1a")
	j = json.loads(response.content.decode("utf-8"))
	#print(j['articles'][0])	
	for l in range(0, len(j['articles'])):
		website = Article(j['articles'][l]['url'])
		website.download()
		website.parse()
		website.nlp()
		temp = website.text
		temp2 = frequency((temp))
		url_temp = "Url:"+website.url
		total_text = []
		text = [url_temp]
		total = 0
		for l in temp2.keys():
			total += temp2[l]

		for i in temp2.keys():
			string = i + ". " + str(temp2[i]/total)
			text.append(string)

		total_text.append(text)

	total_article.append(total_text)

print(len(total_article))


with open('frequency.csv', 'w') as csvfile:
	filewriter = csv.writer(csvfile, delimiter=',',
	                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
	for i in range(0,len(total_article)):
		filewriter.writerow(total_article[i]) 