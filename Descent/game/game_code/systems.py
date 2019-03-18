import random, heapq
from Descent.game.game_code.path_finding import a_star_search

class MessageBoard():
	def __init__(self):
		self.message_queue = []
		self.observers = []
		
	def add_to_queue(self, message):
		self.message_queue.append(message)
		self.notify_observers(message)

	def register(self, observer):
		self.observers.append(observer)
		return observer 

	def notify_observers(self, message):
		for observer in self.observers:
			observer(message)


class Systems():
	def __init__(self, world, message_board):
		self.world = world
		self.message_board = message_board
		self.message_board.register(self.notified)

	def notified(self, message):
		if message['type'] == 'tile_click':
			entity_id = self.world.players[message["sent_by"]]
			start_pos = self.world.get_component("position", entity_id)
			start_pos = (start_pos['x'], start_pos['y'])
			end_pos   = (message["position"][0], message["position"][1])
			path = a_star_search(self.world.grid,start_pos, end_pos)
			print(start_pos)
			print(end_pos)
			print(path)

	def path_find(self, location_01, location_02):
		pass

	def add_player(self):
		spawn_points = []
		for entity_id in self.world.WORLD["mask"].keys():
			if self.world.has_components(entity_id, ["tile"]):
				if self.world.WORLD["tile"][entity_id]["walkable"] == True:
					spawn_points.append(entity_id)
		return self.world.factory.create_player(random.choice(spawn_points))



