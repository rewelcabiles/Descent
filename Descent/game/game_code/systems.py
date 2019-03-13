import random

class Systems():
	def __init__(self, world):
		self.world = world

	def add_player(self):
		spawn_points = []
		for entity_id in self.world.WORLD["mask"].keys():
			if self.world.has_components(entity_id, ["tile"]):
				if self.world.WORLD["tile"][entity_id]["walkable"] == True:
					spawn_points.append(entity_id)
		return self.world.factory.create_player(random.choice(spawn_points))
