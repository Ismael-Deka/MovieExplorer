from audioop import ratecv
import urllib
import urllib.request
import json
import flask
from dataclasses import dataclass
from flask_sqlalchemy import SQLAlchemy
from model import Comment
from app import db


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
    commentList = []
    for i in comments:
        commentList.append(
            {"id": i.id, "user": i.user, "rating": i.rating, "comment": i.comment}
        )

    return commentList


def getAllUserComments(currentuser):
    comments = Comment.query.filter_by(user=currentuser).all()
    commentList = []
    for i in comments:
        commentList.append(
            {"id": i.id, "user": i.user, "rating": i.rating, "comment": i.comment}
        )

    return commentList


def isCommentPosted(new_comment):
    comment = Comment.query.filter_by(comment=new_comment).first()
    return comment != None


def createAccount(username):

    new_user = Comment(None, username, None, None)
    db.session.add(new_user)
    db.session.commit()
    return doesUserExist(username)


def deleteComment(comment_id):
    rows_deleted = Comment.query.filter_by(id=comment_id).delete()
    db.session.commit()
    return rows_deleted
