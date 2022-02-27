from audioop import ratecv
import random
import urllib
import urllib.request
import json
import flask
from dataclasses import dataclass


from flask import Flask, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "postgresql://dtyeoojeryxznl:0b791239905e2b0212c0294b42956e9c7e4c61a02a6f2cd61a6e4e1464073499@ec2-34-233-157-189.compute-1.amazonaws.com:5432/d5g5ot7l2pm17p"

db = SQLAlchemy(app)


@dataclass
class MovieList:
    fight_club: str
    lebowski: str
    godfather: str


class Comment(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.String)
    user = db.Column(db.String)
    rating = db.Column(db.String)
    comment = db.Column(db.String)

    def __init__(self, movie_id, user, rating, comment):
        self.movie_id = movie_id
        self.user = user
        self.rating = rating
        self.comment = comment

    def __repr__(self) -> str:
        return "<Comment %r>" % self.user


@app.route("/", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        if doesUserExist(username) == True:
            return redirect(url_for("index", user=username))
        else:
            return flask.render_template("login.html", user_not_found=True)

    return flask.render_template("login.html", user_not_found=False)


@app.route("/signup", methods=["POST", "GET"])
def signup():
    if request.method == "POST":
        username = request.form["username"]
        if doesUserExist(username) == True:
            return redirect(url_for("signup.html", user_already_exists=True))
        else:
            isUserAdded = createAccount(username)
            if isUserAdded == False:
                return flask.render_template("signup.html", db_error=True)
            else:
                return flask.render_template(
                    "login.html", user_not_found=False, account_created=True
                )
    return flask.render_template("signup.html")


@app.route("/post/<string:id>/<string:username>", methods=["POST", "GET"])
def postComment(id, username):
    if request.method == "POST":
        user = username
        movie_ID = id
        new_rating = request.form["rating"]
        new_comment = request.form["comment"]

        new_rating_comment = Comment(
            rating=new_rating, user=user, movie_id=movie_ID, comment=new_comment
        )
        db.session.add(new_rating_comment)
        db.session.commit()

        if isCommentPosted(new_comment):
            return redirect(url_for("index", user=username, id=id))
        else:
            return flask.render_template(
                "index.html", user=username, comment_posted_success=False
            )


@app.route("/movies/user/<string:user>")
@app.route("/movies/user/<string:user>/id/<string:id>")
def index(user, id=-1):
    api_key = getApiKey()

    # movie_list = ["238", "550", "115"]

    if id == -1:
        movie_list = MovieList("550", "115", "238")

        selected_movie = random.randrange(3)

        if selected_movie == 0:
            movie_id = movie_list.fight_club
        elif selected_movie == 1:
            movie_id = movie_list.godfather
        else:
            movie_id = movie_list.lebowski
    else:
        movie_id = id

    trending_url = (
        "https://api.themoviedb.org/3/movie/" + movie_id + "?api_key=" + api_key
    )

    movie_json = makeApiCall(trending_url)

    Title = movie_json["original_title"]
    Overview = movie_json["tagline"]
    Poster_path = movie_json["poster_path"]

    wiki_api_url = (
        "https://en.wikipedia.org/w/api.php?action=query&generator=links&gpllimit=500&format=json&titles="
        + Title.lower().replace(" ", "_")
        + "&prop=info&inprop=url"
    )

    wiki_json = makeApiCall(wiki_api_url)

    wiki_url = ""
    values = wiki_json["query"]["pages"].values()

    for i in values:
        if Title in i["title"]:
            wiki_url = i["fullurl"]
            break

    poster_url = "https://www.themoviedb.org/t/p/w300_and_h450_bestv2" + Poster_path

    genres = ""

    for i in movie_json["genres"]:
        genres = genres + i["name"] + ", "

    comments = getAllComments(movie_id)

    return flask.render_template(
        "index.html",
        len=len(comments),
        movie_id=movie_id,
        username=user,
        title=Title,
        overview=Overview,
        genre=genres,
        poster=poster_url,
        wiki=wiki_url,
        comment=comments,
        comment_posted_success=None,
    )


def getApiKey():
    file = open("api_key", "r")
    api_key = file.read()
    api_key = api_key.splitlines(0)[0]  ##gets rid of line break
    file.close()

    return api_key


def makeApiCall(url):
    response = urllib.request.urlopen(url)
    data = response.read()
    text = data.decode("utf-8")
    json_response = json.loads(text)

    return json_response


def doesUserExist(username):
    user = Comment.query.filter_by(user=username).first()
    return user != None


def getAllComments(id):
    comments = Comment.query.filter_by(movie_id=id).all()
    return comments


def isCommentPosted(new_comment):
    comment = Comment.query.filter_by(comment=new_comment).first()
    return comment != None


def createAccount(username):

    new_user = Comment(None, username, None, None)
    db.session.add(new_user)
    db.session.commit()
    return doesUserExist(username)


app.run(debug=True)
