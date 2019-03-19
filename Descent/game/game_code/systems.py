import random
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
		self.pathing_system = Pathing_System()
	def notified(self, message):
		if message['type'] == 'tile_click':
			self.pathing(message)
			
	def update(self, dt):
		self.pathing_system.run_jobs(self.world)

	def pathing(self, message):
		entity_id = self.world.players[message["sent_by"]]
		start_pos = self.world.get_component("position", entity_id)
		start_pos = (start_pos['x'], start_pos['y'])
		end_pos   = (message["position"][0], message["position"][1])
		path = a_star_search(self.world.grid, start_pos, end_pos)
		self.pathing_system.add_to_jobs(Pathing_Job(entity_id, path, 50))
		

	def add_player(self):
		spawn_points = []
		for entity_id in self.world.WORLD["mask"].keys():
			if self.world.has_components(entity_id, ["tile"]):
				if self.world.WORLD["tile"][entity_id]["walkable"] == True:
					spawn_points.append(entity_id)
		return self.world.factory.create_player(random.choice(spawn_points))

class Pathing_System:
	def __init__(self):
		self.pathing_jobs = []

	def add_to_jobs(self, job):
		self.pathing_jobs.append(job)

	def run_jobs(self, world):
		for job in self.pathing_jobs:
			if job.ct == job.mt:
				next_path = job.path.pop(0)
				world.WORLD["position"][job.entity_id]["x"] = next_path[0]
				world.WORLD["position"][job.entity_id]["y"] = next_path[1]
				print(world.WORLD["position"][job.entity_id])
				job.ct = 0

				if len(job.path) == 0:
					self.pathing_jobs.remove(job)
					continue
			else:
				job.ct += 1

class Pathing_Job:
	def __init__(self, entity_id, path, mt):
		self.entity_id = entity_id
		self.path = path
		self.mt = mt # Max Time
		self.ct = 0  # Current Time



