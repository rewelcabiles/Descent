import eventlet
eventlet.monkey_patch()
from Descent.game import model_layer, game_controller
from Descent import socketio
from flask_login import current_user
from flask_socketio import emit


class Server:
	def __init__(self):
		self.levels = {}
		model_layer.create_collections()
		self.game_server = game_controller.GameServer()
		socketio.on_event('connected', self.sync_users)
		socketio.on_event('disconnect', self.remove_connection)
		socketio.on_event('class_select', self.send_class_data)

	def send_class_data(self):
		emit('class_data', model_layer.get_class_data())

	def remove_connection(self):
		print("Disconnected: " + current_user.username)
		self.game_server.gserver_messages.on_disconnect(current_user.username)

	def sync_users(self):
		if current_user.is_authenticated:
			emit('initial_user_info', {
				'username': current_user.username})



