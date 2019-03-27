from Descent import mongo
import json


def load_level(level_id, world):
	level = mongo.db.levels.find_one({"level_id": level_id})
	for component in level["data"]:
		pass


def get_class_data():
	class_archetypes = mongo.db.class_archetypes
	classes = []
	for char in class_archetypes.find():
		temp_class = {
			"name": char["name"],
			"image": char["components"]["image"]
		}
		classes.append(temp_class)
	return classes


def save_level(world, level_id):
	print("SAVING")
	level = mongo.db.levels
	data = {}
	for components in world:
		data[components] = []

		for entity_id in world[components]:
			data[components].append(entity_id)
			to_update = {
				str(entity_id): world[components][entity_id]
			}
			mongo.db.components.update({'name': components}, {'$push': {"entities": to_update}})

	general_data = {
		"level_id": level_id,
		"data": data
	}
	level.insert(general_data)


def create_component_collection():
	db_components = mongo.db.components
	with open('Descent/game/game_code/data/components.json') as component_files:
		components = json.load(component_files)

	for key in components:
		if db_components.count_documents({'name': key}, limit=1) == 0:
			data = {
				"name": key,
				"default_data": components[key]
			}
			db_components.insert(data)


def create_class_archetype_collection():
	class_archetype = mongo.db.class_archetypes
	with open('Descent/game/game_code/data/class_archetype.json') as archetype:
		archetype = json.load(archetype)

	for key in archetype:
		if class_archetype.count_documents({'name': key}, limit=1) == 0:
			data = {
				"name": key,
				"components": archetype[key]
			}
			class_archetype.insert(data)


def create_collections():
	create_class_archetype_collection()
	create_component_collection()
