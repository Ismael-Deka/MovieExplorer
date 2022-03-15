from audioop import ratecv
import imp
import random
import re
import urllib
import urllib.request
import json
import flask
from dataclasses import dataclass
import os
from flask import Flask, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import db_utils

from model import Comment
from app import db, bp, app


@dataclass
class MovieList:
    fight_club: str
    lebowski: str
    godfather: str


@bp.route("/")
@bp.route("/movie")
@bp.route("/signup")
@bp.route("/account")
def index():
    # NB: DO NOT add an "index.html" file in your normal templates folder
    # Flask will stop serving this React page correctly
    return flask.render_template("index.html")


app.register_blueprint(bp)


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        username = request.json["username"]
        if db_utils.doesUserExist(username) == True:
            return flask.jsonify({"user": username})
        else:
            return flask.jsonify({"user": ""})

    return flask.jsonify({"user": ""})


@app.route("/signup", methods=["POST", "GET"])
def signup():
    if request.method == "POST":
        username = request.json["username"]
        if db_utils.doesUserExist(username) == True:
            return flask.jsonify(
                {"user_already_exists": True, "account_created": False}
            )
        else:
            isUserAdded = db_utils.createAccount(username)
            if isUserAdded == False:
                return flask.jsonify(
                    {"user_already_exists": False, "account_created": False}
                )
            else:
                return flask.jsonify(
                    {"user_already_exists": False, "account_created": True}
                )


@app.route("/post/<string:id>/<string:username>", methods=["POST", "GET"])
def postComment(id, username):
    if request.method == "POST":
        user = username
        movie_ID = id
        new_rating = request.json["rating"]
        new_comment = request.json["comment"]

        new_rating_comment = Comment(
            rating=new_rating, user=user, movie_id=movie_ID, comment=new_comment
        )
        db.session.add(new_rating_comment)
        db.session.commit()

        if db_utils.isCommentPosted(new_comment):
            return flask.jsonify({"comment_posted_success": True})
        else:
            return flask.jsonify({"comment_posted_success": False})


@app.route("/fetch_comments/<string:user>")
def fetchComment(user):
    userComments = db_utils.getAllUserComments(user)
    return flask.jsonify({"comments": userComments})


@app.route("/delete_comment", methods=["POST", "GET"])
def deleteCommentById():

    id = request.json["comment_id"]
    rows = db_utils.deleteComment(id)
    return flask.jsonify({"row_deleted": rows})


@app.route("/movie/fetch_movie/<string:user>")
@app.route("/movie/fetch_movie/<string:user>/id/<string:id>")
@app.route("/movie/fetch_movie")
def fetchMovie(user="", id=-1):

    api_key = os.getenv("API_KEY")

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

    movie_json = db_utils.makeApiCall(trending_url)

    Title = movie_json["original_title"]
    Overview = movie_json["tagline"]
    Poster_path = movie_json["poster_path"]

    wiki_api_url = (
        "https://en.wikipedia.org/w/api.php?action=query&generator=links&gpllimit=500&format=json&titles="
        + Title.lower().replace(" ", "_")
        + "&prop=info&inprop=url"
    )

    wiki_json = db_utils.makeApiCall(wiki_api_url)

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

    comments = db_utils.getAllComments(movie_id)
    print(comments)

    return flask.jsonify(
        {
            "len": len(comments),
            "movie_id": movie_id,
            "title": Title,
            "overview": Overview,
            "genre": genres,
            "poster": poster_url,
            "wiki": wiki_url,
            "comments": comments,
            "comment_posted_success": None,
        }
    )


app.run(
    host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", "8080")), debug=True
)
