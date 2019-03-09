import json
import random




class World():

	def __init__(self):
		#Loads the files that contains all components
		with open ('Descent/game/game_code/data/components.json') as component_files:
		   self.components = json.load(component_files)
		self.WORLD = {}
		self.COMPS = {}
		self.COMPS['none'] = 1 << 0
		iterator = 1
		for key in self.components:
			self.WORLD[key] = {}
			self.COMPS[key] = 1 << iterator
			iterator += 1
		
		self.entity_id_max = 9000

	def assign_entity_id(self):
		while True:
			entity_id = random.randint(1, self.entity_id_max)
			if entity_id not in list(self.WORLD['mask'].keys()):
				self.WORLD['mask'][entity_id] = self.COMPS['none']
				return entity_id

	def create_component(self, component, entity_id):
		self.WORLD[component][entity_id] = self.components[component].copy()

	def create_entity(self, component_list):
		entity_id   = self.assign_entity_id()
		for component in component_list:
			self.create_component(component, entity_id)
		self.WORLD["mask"][entity_id] = self.create_dynamic_mask(component_list)
		return entity_id

	def create_dynamic_mask(self, component_list):
		temp_mask = 0
		for comps in component_list:
			temp_mask |= self.COMPS[comps]
		return temp_mask		

	def has_components(self, ent_id, component_list):
		temp_mask = self.create_dynamic_mask(component_list)
		if((self.WORLD['mask'][ent_id] & temp_mask) == temp_mask):
			return True

	def get_object_type(self, ent_id):
		inv_mask = self.create_dynamic_mask(['inventory'])
		wep_mask = self.create_dynamic_mask(['weapon'])
		dor_mask = self.create_dynamic_mask(['transition'])
		isr_mask = self.create_dynamic_mask(['isroom'])
		if((self.WORLD['mask'][ent_id] & inv_mask) == inv_mask):
			return "is_inventory"
		if((self.WORLD['mask'][ent_id] & wep_mask) == wep_mask):
			return "is_weapon"
		if((self.WORLD['mask'][ent_id] & dor_mask) == dor_mask):
			return "is_door"
		if((self.WORLD['mask'][ent_id] & isr_mask) == isr_mask):
			return "is_room"
		else:
			return "Missing type"

	def destroy_entity(self, entity_id):
		for components in self.WORLD.keys():
			if entity_id in self.WORLD[components].keys():
				del self.WORLD[components][entity_id]

	def get_world_as_json(self):
		return json.dumps(self.WORLD)

	def get_components_as_json(self):
		return json.dumps(self.COMPS)