import random
import urllib
import urllib.request
import json
import flask
import os
app = flask.Flask(__name__)

@app.route('/')
def index():
    file = open("api_key","r")
    api_key = file.read()
    api_key = api_key.splitlines(0)[0] ##gets rid of line break
    file.close()

    movie_list = ["9323", "550", "115"]

    movie_id = random.randrange(3)

    trending_url = "https://api.themoviedb.org/3/movie/"+movie_list[movie_id]+"?api_key="+api_key

    response = urllib.request.urlopen(trending_url)
    data = response.read()
    text = data.decode('utf-8')

    movie_json = json.loads(text)

    Title = movie_json['original_title']
    Overview = movie_json['overview']
    Poster_path = movie_json['poster_path']

    poster_url = "https://www.themoviedb.org/t/p/w300_and_h450_bestv2"+Poster_path



    genres = ""

    for i in movie_json['genres']:
        genres = genres +i['name']+","
        
    return flask.render_template("index.html", title = Title, overview = Overview, genre = genres, poster = poster_url )
app.run(
     debug=True
)
