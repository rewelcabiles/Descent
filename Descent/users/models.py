from Descent import mongo, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(username):
	user = mongo.db.users.find_one({"username": username})
	if not user:
		return None
	return User(user['username'])



class User():

	def __init__(self, username):
		self.username = username

	def is_authenticated(self):
		return True

	def is_active(self):
		return True

	def is_anonymous(self):
		return False

	def get_id(self):
		return self.username

