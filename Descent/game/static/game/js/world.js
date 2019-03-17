var world = function(){

	let WORLD = {}
	let COMPS = {}
	
	var	self = this;

	this.create_dynamic_mask = function(component_list) {
		temp_mask = 0;
		for (components in component_list){
			temp_mask |= this.COMPS[components];
		}
		return temp_mask;
	}

	this.get_world = function(){
		return this.WORLD;
	}

	this.get_component = function(component, entity_id){
		return this.WORLD[component][entity_id];
	}

	this.has_components = function(entity_id, component_list){
		temp_mask = this.create_dynamic_mask(component_list);
		if((this.WORLD['mask'][entity_id] & temp_mask) == temp_mask){
			return true
		}
	}

	this.set_data = function(worlds, components){
		this.WORLD = worlds;
		this.COMPS = components;
	}

	this.update_z_layer = function(){
		let component_list = ["position", "image"];
		this.z_layer = []
		for (entity_id in this.WORLD["mask"]){
			if(this.has_components(entity_id, component_list)){
				position = this.WORLD["position"][entity_id];
				this.z_layer.push(entity_id)
			}
		}
		this.z_layer.sort(this.sortMe);
	}
	this.sortMe = function(a, b){
	    return (self.WORLD["position"][a]['x'] - self.WORLD["position"][b]['x']) || (self.WORLD["position"][a]['y'] - self.WORLD["position"][b]['y']);
	}
}