import random
from flask_socketio import join_room
from flask_login import current_user
from Descent.game import model_layer
from Descent import socketio


class LobbyHandler:
	def __init__(self, server):
		self.server = server
		self.lobbies = {}
		socketio.on_event('start_lobby', self.on_create_lobby)
		socketio.on_event('join_lobby', self.on_join_lobby)
		socketio.on_event('char_selected', self.on_character_select)
		socketio.on_event('player_ready', self.on_player_ready)

	def disconnect_player(self, player):
		lobby_id = player.lobby.lobby_id
		player.lobby = None
		self.lobbies[lobby_id].remove_player(player.username)
		self.refresh_player_list(lobby_id)

	def on_player_ready(self, data):
		player = self.server.get_user(current_user.username)
		if data == 1:
			if player.lobby.selected_character:
				player.lobby.status = 1
		elif data == 0:
			player.lobby.status = 0
		self.lobbies[player.lobby.lobby_id].check_if_game_start()
		self.refresh_player_list(player.lobby.lobby_id)

	def on_character_select(self, character):
		player = self.server.get_user(current_user.username)
		player.lobby.selected_character = character
		self.refresh_player_list(player.lobby.lobby_id)

	def on_join_lobby(self, lobby_id):
		print(current_user.username + "is joining lobby id: " + str(lobby_id))
		lobby_id = int(lobby_id)
		lobby = self.lobbies[lobby_id]
		player = self.server.get_user(current_user.username)
		lobby.add_player(player)
		join_room(lobby_id)
		self.move_to_lobby(player)

	def on_create_lobby(self):  # Creates A Lobby
		print("Creating Lobby")
		while True:
			lobby_id = random.randint(1, 2000)
			if lobby_id not in self.lobbies.keys():
				break
		self.lobbies[lobby_id] = Lobby(lobby_id)
		self.on_join_lobby(lobby_id)
		self.lobbies[lobby_id].lobby_leader = self.server.get_user(current_user.username)

	def move_to_lobby(self, player):
		socketio.emit('cs_screen', room=player.sid)
		socketio.emit('class_data', [model_layer.get_class_data(), player.lobby.lobby_id], room=player.sid)
		self.refresh_player_list(player.lobby.lobby_id)

	def refresh_player_list(self, lobby_id):
		lobby = self.lobbies[lobby_id]
		player_list = []
		for player in [*lobby.players.values()]:
			player_list.append({
				"name": player.username,
				"character": player.lobby.selected_character,
				"status": player.lobby.status
			})
		socketio.emit('refresh_player_list', player_list, room=lobby_id)


class Lobby:
	def __init__(self, lobby_id):
		self.players = {}
		self.lobby_id = lobby_id
		self.lobby_leader = None
		self.status = "none"

	def check_if_game_start(self):
		return any(player.lobby.status == 1 for player in self.players.values())

	def add_player(self, player):
		player.lobby = Lobby_Data(self.lobby_id)
		self.players[player.username] = player

	def remove_player(self, player):
		del self.players[player]


class Lobby_Data:
	def __init__(self, lid):
		self.lobby_id = lid
		self.selected_character = None
		self.status = 0  # 0 = Selecting, 1 = Locked in
