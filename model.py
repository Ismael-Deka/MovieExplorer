import json
from app import db


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
