import eventlet
eventlet.monkey_patch()
from Descent.game.game_code import world, dungeon_generator, systems
from Descent import socketio
from flask_login import current_user
from flask import request
import _thread
import time

class Game:
	def __init__(self):
		self.world = world.World()
		self.message_board = systems.MessageBoard()
		self.message_board.register(self.notify)
		self.systems = systems.Systems(self.world, self.message_board)
		self.generator  = dungeon_generator.Division(self.world)
		self.generator.division()
		socketio.on_event('connect_world', self.send_world_data)
		socketio.on_event("client_event", self.receive_events)        

	def notify(self, message):
		if message["type"] == "send_packet":
			socketio.emit("new_packet", message["data"])

	def remove_player(self, username):
		self.world.remove_player(username)

	def add_new_player(self, username):
		data = {
			"type": "send_packet",
			"data": {
				"type":"new_connection",
				"data": {
					"entity_id" : entity_id,
					"components": self.world.get_display_components(entity_id)
				}
			}
		}
		self.message_board.add_to_queue(data)

	def send_world_data(self):
		entity_id  = self.systems.add_player()
		self.world.add_new_player(current_user.username, entity_id)
		socketio.emit("get_world_data", {
				"world_data": self.world.get_world_as_json(),
				"component_data": self.world.get_components_as_json(),
				"player_id": self.world.players[current_user.username]
			}, room=clients[current_user.username].sid)

	def receive_events(self, data):
		data["sent_by"] = current_user.username
		self.message_board.add_to_queue(data)

	def update(self, dt):
		self.systems.update(dt)


class Server:
	def __init__(self):
		self.static_game = Game()
		self.running = True
		global clients
		clients = {}
		_thread.start_new_thread(self.threaded_update, ())
		socketio.on_event('connected', self.sync_users)
		socketio.on_event('disconnect', self.remove_connection)

	def remove_connection(self):
		print("Disconnected: " + current_user.username)
		self.static_game.remove_player(current_user.username)

	def sync_users(self):
		if current_user.is_authenticated:
			clients[current_user.username] = Socket(request.sid, current_user.username)
			socketio.emit('initial_user_info', {'username': current_user.username})

	def threaded_update(self):
		FPS = 30
		lastFrameTime = 0
		while self.running == True:
			currentTime = time.time()
			dt = currentTime - lastFrameTime
			lastFrameTime = currentTime
			#Code HERE
			self.static_game.update(dt)


			sleepTime = 1./FPS - (currentTime - lastFrameTime)
			if sleepTime > 0:
				time.sleep(sleepTime)

class Socket:
	def __init__(self, sid, username):
		self.sid = sid
		self.username = username