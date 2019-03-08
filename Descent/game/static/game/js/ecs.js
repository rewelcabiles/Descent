var ECS_Systems = function() {
	
	this.world = {}
	this.COMPS = {}


	this.create_dynamic_mask = function(component_list) {
		temp_mask = 0;
		for (components in component_list){
			temp_mask |= this.COMPS[components];
		}
		return temp_mask;
	}

	this.has_components = function(entity_id, component_list){
		temp_mask = this.create_dynamic_mask(component_list);
		if((this.world['mask'][entity_id] & temp_mask) == temp_mask){
			return true
		}
	}

	this.set_data = function(world, components){
		this.world = world;
		this.COMPS = components

	}

	this.render = function(canvas, camera) {
		//Components needed for this to render

		component_list = ["position", "image"];
		this.world
		sprite_sizes = 60;

		for (entity_id in this.world["mask"]){
			if(this.has_components(entity_id, component_list)){
				image_name = this.world["image"][entity_id]["file_name"]
				position   = this.world["position"][entity_id]
				img = new Image();
				img.src = "game/images/"+image_name;
				img_x = position["x"] * sprite_sizes - camera.camera_x;
				img_y = position["y"] * sprite_sizes - camera.camera_y;
				canvas.drawImage(img, img_x, img_y);
			}
		}

		
	}
}