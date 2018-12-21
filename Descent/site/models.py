from Descent import db, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


class User(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.VARCHAR(20), unique=True, nullable=False)
    password = db.Column(db.VARCHAR(80), nullable=False)

    def get_id(self):
        return self.user_id
