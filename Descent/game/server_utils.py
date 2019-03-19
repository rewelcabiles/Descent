from Descent.game.game_code import world, dungeon_generator, systems
from Descent import socketio
from flask_login import current_user
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
			print("SENDING PACKET")
			print(message["data"])
			socketio.emit("new_packet", message["data"])

	def remove_player(self, username):
		self.world.remove_player(username)

	def add_new_player(self, username):
		self.world.add_new_player(username, self.systems.add_player())

	def send_world_data(self):
		socketio.emit("get_world_data", {
			"world_data": self.world.get_world_as_json(),
			"component_data": self.world.get_components_as_json(),
			"player_id": current_user.username
			})

	def receive_events(self, data):
		data["sent_by"] = current_user.username
		self.message_board.add_to_queue(data)

	def update(self, dt):
		self.systems.update(dt)


class Server:
	def __init__(self):
		self.static_game = Game()
		self.running = True
		_thread.start_new_thread(self.threaded_update, ())
		socketio.on_event('connected', self.sync_users)
		socketio.on_event('disconnect', self.remove_connection)

	def remove_connection(self):
		print("Disconnected: " + current_user.username)
		self.static_game.remove_player(current_user.username)

	def new_connection(self):
		print("New Connection: " + current_user.username)
		self.static_game.add_new_player(current_user.username)

	def sync_users(self):
		if current_user.is_authenticated:
			self.new_connection()
			socketio.emit('initial_user_info', {
				'username': current_user.username, 
				'id':current_user.username})

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