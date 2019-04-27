from Descent import mongo


class Factory():
	def __init__(self, world):
		
		self.world = world

	def create_tiles(self, tile):
		tile_id = self.world.create_entity(["mask", "position", "image", "tile"])
		self.world.WORLD["position"][tile_id]["x"] = tile[0]
		self.world.WORLD["position"][tile_id]["y"] = tile[1]
		if tile[2] == 1:
			self.world.WORLD["image"][tile_id]["file_name"] = "wall_01.png"
			self.world.WORLD["tile"][tile_id]["walkable"] = False
		if tile[2] == 0:
			self.world.WORLD["image"][tile_id]["file_name"] = "floor_stone_01.png"
		if tile[2] == 3:

			self.world.WORLD["image"][tile_id]["file_name"] = "door.png"
			self.world.WORLD["tile"][tile_id]["walkable"] = True

	def create_player(self, tile_id):
		player_id = self.world.create_entity(["mask", "position", "image", "actor"])
		self.world.WORLD["position"][player_id]["x"] = self.world.WORLD["position"][tile_id]["x"]
		self.world.WORLD["position"][player_id]["y"] = self.world.WORLD["position"][tile_id]["y"]
		self.world.WORLD["image"][player_id]["file_name"] = "character.png"
		return player_id

	def create_from_character_archetype(self, name):
		archetype = mongo.db.class_archetypes.find_one({"name": name})
		for component in archetype["components"]:
			pass
