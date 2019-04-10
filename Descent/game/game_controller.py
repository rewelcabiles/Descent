from Descent.game.game_code import world, dungeon_generator, systems
from Descent import socketio
from flask_login import current_user
from flask import request
import random
import time
import _thread
from flask_socketio import join_room


class Socket:
	def __init__(self, sid, username):
		self.sid = sid
		self.username = username
		self.game_id = None
		self.level = None
		self.lobby = None
		self.character = None


class GameServer:
	def __init__(self, server):
		self.server = server
		self.games = {}
		self.clients = {}
		self.running = True
		_thread.start_new_thread(self.threaded_update, ())
		socketio.on_event("connect_game", self.on_connect_game)
		socketio.on_event("client_event", self.on_player_event)
		socketio.on_event('start_game', self.on_new_game)

	def on_disconnect(self, socket):
		pass

	def on_new_game(self):
		print("Server: New Game Event")
		game_id = self.create_new_game()
		new_socket = Socket(request.sid, current_user.username)
		new_socket.game_id = game_id
		self.clients[current_user.username] = new_socket
		join_room(game_id)
		socketio.emit("game_created", room=game_id)

	def on_player_event(self, data):
		socket = self.clients[current_user.username]
		self.games[socket.game_id].on_client_event(data, socket)

	def on_connect_game(self):
		socket = self.clients[current_user.username]
		self.games[socket.game_id].on_connect(socket)

	def create_new_game(self):
		while True:
			game_id = random.randint(1, 2000)
			if game_id not in self.games.keys():
				break
		print("New Game Created, ID: ", game_id)
		self.games[game_id] = Game(game_id)
		return game_id

	def threaded_update(self):
		FPS = 30
		lastFrameTime = 0
		while self.running is True:
			currentTime = time.time()
			dt = currentTime - lastFrameTime
			lastFrameTime = currentTime

			# CODE HERE
			for game in self.games.values():
				game.update_levels(dt)

			sleepTime = 1. / FPS - (currentTime - lastFrameTime)
			if sleepTime > 0:
				time.sleep(sleepTime)


class Game:
	def __init__(self, game_id):
		self.levels = {}
		self.game_id = game_id
		self.players = {}
		self.generator = dungeon_generator.Division()
		self.create_random_level()

	def on_connect(self, socket):
		print("Client Connected to Game. Game_ID: ", self.game_id)
		level_id = random.choice(list(self.levels.keys()))
		join_room(level_id)
		self.players[socket.username] = socket
		self.players[socket.username].level = level_id
		self.levels[level_id].add_new_player(socket.username, socket.sid)

	def on_client_event(self, data, socket):
		level_id = self.players[socket.username].level
		self.levels[level_id].receive_events(data)

	def create_random_level(self):
		while True:
			level_id = random.randint(1, 2000)
			if level_id not in self.levels.keys():
				break
		new_game = Level(level_id)
		self.generator.randomize_world(new_game.world)
		self.levels[level_id] = new_game

	def update_levels(self, dt):
		for level in self.levels.values():
			level.update(dt)

	def remove_player(self, socket):
		self.levels[socket.level].remove_player(socket.username)


class Level:
	def __init__(self, level_id):
		self.level_id = level_id
		self.players = {}
		self.world = world.World()
		self.message_board = systems.MessageBoard()
		self.message_board.register(self.notify)
		self.systems = systems.Systems(self.world, self.message_board)

	def notify(self, message):
		socketio.emit("new_packet", message, room=self.level_id)

	def remove_player(self, username):
		self.world.remove_player(username)

	def add_new_player(self, username, sid):
		entity_id = self.systems.add_player()
		self.players[current_user.username] = entity_id
		socketio.emit("get_world_data", {
			"world_data": self.world.get_world_as_json(),
			"component_data": self.world.get_components_as_json(),
			"player_id": self.players[current_user.username]
			}, room=sid)
		data = {
			"type": "new_connection",
			"data": {
				"entity_id": entity_id,
				"components": self.world.get_display_components(entity_id)
			}
		}
		self.message_board.add_to_queue(data)

	def receive_events(self, data):
		data["entity_id"] = self.players[current_user.username]
		self.message_board.add_to_queue(data)

	def update(self, dt):
		self.systems.update(dt)

