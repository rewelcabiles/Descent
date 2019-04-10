import eventlet
eventlet.monkey_patch()
from Descent.game import model_layer, game_controller, lobby_controller
from Descent import socketio
from flask_login import current_user
from flask_socketio import emit
from flask import request


class Server:
	def __init__(self):
		self.users = {}
		model_layer.create_collections()
		self.game_handler = game_controller.GameServer(self)
		self.lobby_handler = lobby_controller.LobbyHandler(self)
		socketio.on_event('connected', self.sync_users)
		socketio.on_event('disconnect', self.remove_connection)
		socketio.on_event('class_select', self.send_class_data)

	def send_class_data(self, data):
		for users in data["lobby"]:
			print(data["lobby"])
			socketio.emit('cs_screen', data, room=self.users[users])
			socketio.emit('class_data', model_layer.get_class_data(), room=self.users[users])

	def remove_connection(self):
		player = self.users[current_user.username]
		self.lobby_handler.disconnect_player(player)
		print("Disconnected: " + current_user.username)

	def sync_users(self):
		if current_user.is_authenticated:
			self.users[current_user.username] = Socket(request.sid, current_user.username)
			emit('initial_user_info', {
				'username': current_user.username})


class Socket:
	def __init__(self, sid, username):
		self.sid = sid
		self.username = username
		self.game_id = None
		self.level = None
		self.lobby = None
