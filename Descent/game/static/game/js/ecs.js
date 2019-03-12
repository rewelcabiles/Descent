var ECS_Systems = function(state) {
	
	this.state = state
	this.world = {}
	this.COMPS = {}
	textColor = "rgb(255,255,255)";
	self = this
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

	this.cart_to_iso = function(cart_x, cart_y){
		iso_x = cart_x/2 - cart_y/2;
		iso_y = (cart_x/2 + cart_y/2) / 2;
		return [iso_x, iso_y]
	}

	this.update_z_layer = function(){
		component_list = ["position", "image"];
		this.z_layer = []
		for (entity_id in this.world["mask"]){
			if(this.has_components(entity_id, component_list)){
				position = this.world["position"][entity_id];
				this.z_layer.push(entity_id)
			}
		}
		this.z_layer.sort(this.sortMe);
	}

	this.sortMe = function(a, b){
	    return (self.world["position"][a]['x'] - self.world["position"][b]['x']) || (self.world["position"][a]['y'] - self.world["position"][b]['y']);
	}
	

	this.render = function(canvas, camera) {
		//Components needed for this to render
		this.update_z_layer()
		sprite_sizes_x = 128*camera.scale;
		sprite_sizes_y = 128*camera.scale;
		z_layer_length = this.z_layer.length;
		for (var i = 0; i < z_layer_length; i++){
			entity_id = this.z_layer[i];
			image_name = this.world["image"][entity_id]["file_name"]
			position   = this.world["position"][entity_id]
			img = this.state.asset_manager.get_asset(image_name);
			img_x = (position["x"] * sprite_sizes_x) - camera.camera_x;
			img_y = (position["y"] * sprite_sizes_y) - camera.camera_y;
			var iso_pos = this.cart_to_iso(img_x, img_y)
			canvas.drawImage(img, iso_pos[0], iso_pos[1], sprite_sizes_x, sprite_sizes_y);
		}
		
	}

	this.handle_user_input = function(camera) {
		$(document.body).on('keydown', function(e){
			switch (e.which){
				case 37:
					camera.camera_x -= 1;
					break
				case 39:
					camera.camera_x += 1;
					break
				case 38:
					camera.camera_y -= 1;
					break
				case 40:
					camera.camera_y += 1;
					break
			}
		});
	}
}