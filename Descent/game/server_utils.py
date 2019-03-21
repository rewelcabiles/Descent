import eventlet
eventlet.monkey_patch()
from Descent.game.game_code import world, dungeon_generator, systems
from Descent.game import model_layer
from Descent import socketio
from flask_login import current_user
from flask import request
import _thread
import time
import random

class Game:
	def __init__(self, level_id):
		self.level_id = level_id
		self.world = world.World()
		self.message_board = systems.MessageBoard()
		self.message_board.register(self.notify)
		self.systems = systems.Systems(self.world, self.message_board)
		self.generator  = dungeon_generator.Division(self.world)
		self.generator.division()
		socketio.on_event('connect_world', self.send_world_data)
		socketio.on_event("client_event", self.receive_events)        

	def notify(self, message):
		socketio.emit("new_packet", message)

	def remove_player(self, username):
		self.world.remove_player(username)

	def add_new_player(self, username, entity_id):
		data = {
			"type":"new_connection",
			"data": {
				"entity_id" : entity_id,
				"components": self.world.get_display_components(entity_id)
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
		self.add_new_player(current_user.username, entity_id)

	def receive_events(self, data):
		data["sent_by"] = current_user.username
		self.message_board.add_to_queue(data)

	def update(self, dt):
		self.systems.update(dt)


class Server:
	def __init__(self):
		model_layer.create_component_collection()
		self.levels = {}
		self.running = True
		self.create_level()
		global clients
		clients = {}
		_thread.start_new_thread(self.threaded_update, ())
		socketio.on_event('connected', self.sync_users)
		socketio.on_event('disconnect', self.remove_connection)
		
	def create_level(self):
		while True:
			level_id = random.randint(1, 2000)
			if level_id not in self.levels.keys():
				break
		self.levels[level_id] = Game(level_id)
		model_layer.save_level(self.levels[level_id].world.WORLD, level_id);
		



	def remove_connection(self):
		print("Disconnected: " + current_user.username)
		del clients[current_user.username]
		self.static_game.remove_player(current_user.username)

	def sync_users(self):
		if current_user.is_authenticated:
			clients[current_user.username] = Socket(request.sid, current_user.username)
			socketio.emit('initial_user_info', 
				{'username': current_user.username}, 
				room=clients[current_user.username].sid)

	def threaded_update(self):
		FPS = 30
		lastFrameTime = 0
		while self.running == True:
			currentTime = time.time()
			dt = currentTime - lastFrameTime
			lastFrameTime = currentTime

			# CODE HERE
			for area in self.levels.values():
				area.update(dt)

			sleepTime = 1./FPS - (currentTime - lastFrameTime)
			if sleepTime > 0:
				time.sleep(sleepTime)

class Socket:
	def __init__(self, sid, username):
		self.sid = sid
		self.username = username
		self.level = None

	def create_character(self):
		pass