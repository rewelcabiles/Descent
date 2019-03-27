import eventlet
eventlet.monkey_patch()
from Descent.game import model_layer, game_controller
from Descent import socketio
from flask_login import current_user
from flask import request


class Socket:
	def __init__(self, sid, username):
		self.sid = sid
		self.username = username
		self.level = None

	def create_character(self):
		pass


class Server:
	def __init__(self):
		self.levels = {}
		global clients
		clients = {}

		model_layer.create_collections()
		self.game_controller = game_controller.GameHandler()

		socketio.on_event('connected', self.sync_users)
		socketio.on_event('disconnect', self.remove_connection)
		socketio.on_event('class_select', self.send_class_data)

	def send_class_data(self):
		socketio.emit('class_data', model_layer.get_class_data(), room=request.sid)

	def remove_connection(self):
		print("Disconnected: " + current_user.username)
		self.game_controller.remove_player(clients[current_user.username])
		del clients[current_user.username]

	def sync_users(self):
		if current_user.is_authenticated:
			clients[current_user.username] = Socket(request.sid, current_user.username)
			clients[current_user.username].level = self.game_controller.levels[315].level_id
			socketio.emit('initial_user_info', {
				'username': current_user.username},
				room=request.sid)



