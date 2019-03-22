from Descent import mongo
from Descent.game.game_code import world as w
import json



def create_character():
	character = mongo.db.characters
	character.insert({
		"username":username,
		})

def load_level(level_id):
	level = mongo.db.levels.find_one({"level_id":level_id})
	world0 = w.World()
	world = world0.WORLD
	for component in level["data"]:
		db_comp = mongo.db.components.find_one({"name":component})
		for db_entities in db_comp["entities"]:
			if db_entities["level"] == level_id:
				world[component][db_entities["entity_id"]] = db_entities["data"]
	return world0


def save_level(world, level_id):
	print("SAVING")
	level = mongo.db.levels
	data = {}
	for components in world:
		data[components] = []
		
		for entity_id in world[components]:
			data[components].append(entity_id)
			to_update ={
				"level": level_id,
				"entity_id" : entity_id,
				"data" : world[components][entity_id]
			}
			mongo.db.components.update({'name':components}, {'$push': {"entities": to_update}})

	general_data = {
		"level_id" : level_id,
		"data": data
	}
	level.insert(general_data)

def create_component_collection():
	db_components = mongo.db.components
	with open ('Descent/game/game_code/data/components.json') as component_files:
		components = json.load(component_files)

	for key in components:
		if db_components.count_documents({ 'name': key }, limit = 1) == 0:
			data = {
				"name": key,
				"default_data": components[key],
				"entities": []
			}
			db_components.insert(data)

