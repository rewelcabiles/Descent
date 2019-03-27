from Descent.game.game_code import world, dungeon_generator, systems
from Descent import socketio
from flask_login import current_user
from flask import request
import random
import time
import _thread


class GameHandler:
	def __init__(self):
		self.levels = {}
		self.running = True
		self.create_level()
		_thread.start_new_thread(self.threaded_update, ())

	def create_level(self):
		while True:
			level_id = random.randint(1, 2000)
			if level_id not in self.levels.keys():
				break
		self.levels[315] = Game(315)

	def threaded_update(self):
		FPS = 30
		lastFrameTime = 0
		while self.running is True:
			currentTime = time.time()
			dt = currentTime - lastFrameTime
			lastFrameTime = currentTime

			# CODE HERE
			for area in self.levels.values():
				area.update(dt)

			sleepTime = 1./FPS - (currentTime - lastFrameTime)
			if sleepTime > 0:
				time.sleep(sleepTime)

	def remove_player(self, socket):
		self.levels[socket.level].remove_player(socket.username)


class Game:
	def __init__(self, level_id):
		self.level_id = level_id
		self.world = world.World()
		self.message_board = systems.MessageBoard()
		self.message_board.register(self.notify)
		self.systems = systems.Systems(self.world, self.message_board)
		self.generator = dungeon_generator.Division(self.world)
		self.generator.division()
		socketio.on_event('connect_world', self.send_world_data)
		socketio.on_event("client_event", self.receive_events)

	def notify(self, message):
		socketio.emit("new_packet", message)

	def remove_player(self, username):
		self.world.remove_player(username)

	def add_new_player(self, username, entity_id):
		data = {
			"type": "new_connection",
			"data": {
				"entity_id": entity_id,
				"components": self.world.get_display_components(entity_id)
			}
		}
		self.message_board.add_to_queue(data)

	def send_world_data(self):
		entity_id = self.systems.add_player()
		self.world.add_new_player(current_user.username, entity_id)
		socketio.emit("get_world_data", {
			"world_data": self.world.get_world_as_json(),
			"component_data": self.world.get_components_as_json(),
			"player_id": self.world.players[current_user.username]
			}, room=request.sid)
		self.add_new_player(current_user.username, entity_id)

	def receive_events(self, data):
		print("NEW EVENT")
		data["sent_by"] = current_user.username
		self.message_board.add_to_queue(data)

	def update(self, dt):
		self.systems.update(dt)
