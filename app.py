import flask
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy


bp = flask.Blueprint(
    "bp",
    __name__,
    template_folder="./static/react",
)

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")


db = SQLAlchemy(app)
