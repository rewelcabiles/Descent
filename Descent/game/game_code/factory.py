class Factory():
	def __init__(self):
		pass

	def create_tiles(self, world, tile, x, y):
		tile_id = world.create_entity(["mask", "position", "image"])
		world.WORLD["position"][tile_id]["x"] = x
		world.WORLD["position"][tile_id]["y"] = y

		if tile['value'] == 1:
			world.WORLD["image"][tile_id]["file_name"] = "wall_01.png"
		if tile['value'] == 2:
			world.WORLD["image"][tile_id]["file_name"] = "floor_stone_01.png"