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

app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "postgresql://zqqntapzbixydu:32206c2e30f69fa017327dc53c27798f78f4dbef2804b19bbda5004d4aa1ed88@ec2-3-212-45-192.compute-1.amazonaws.com:5432/devsdleosdarcp"


db = SQLAlchemy(app)
