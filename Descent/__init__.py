from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import os

sql_uri = 'mysql+pymysql://root:@localhost/descent'

app = Flask(__name__)
app.config["SECRET_KEY"] = 'f5418130a27f18abe557d61201c31d60'
app.config['SQLALCHEMY_DATABASE_URI'] = sql_uri
app.config['UPLOAD_FOLDER'] = '/uploads'
os.makedirs(os.path.join(app.instance_path, 'uploads'), exist_ok=True)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

db.create_all()

from Descent.users.routes import users
from Descent.resources.routes import resources

app.register_blueprint(users, url_prefix="/")
app.register_blueprint(resources)
