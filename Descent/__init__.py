from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_pymongo import PyMongo
import os

with open('Descent/dbacc.ini') as f:
    lines = f.readlines()
lines = [x.strip() for x in lines] 


app = Flask(__name__)
socketio = SocketIO(app)

app.config['MONGO_DBNAME'] = 'flask-rpg'
app.config["MONGO_URI"] = 'mongodb://localhost:27017/flask-rpg'
app.config["SECRET_KEY"] = 'f5418130a27f18abe557d61201c31d60'

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'

#db.create_all()

from Descent.users.routes import users
from Descent.site.routes import site
from Descent.game.routes import game
from Descent.resources.routes import resources


app.register_blueprint(users, url_prefix="/account")
app.register_blueprint(game, url_prefix="/Descent")
app.register_blueprint(site, url_prefix="/")
app.register_blueprint(resources)
