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
		iso_x = cart_x - cart_y;
		iso_y = (cart_x + cart_y) / 2;
		return [iso_x, iso_y]
	}

	this.iso_to_cart = function(iso_x, iso_y){
		cart_x = (2 * iso_y + iso_x) / 2;
		cart_y = (2 * iso_y - iso_x) / 2;
		return [cart_x, cart_y]
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
	
	this.camera_follow = function(world, camera){
		if (camera.follow_target_id != null){
			target_x = world["position"][camera.follow_target_id]["x"];
			target_y = world["position"][camera.follow_target_id]["y"];
			new_pos = this.cart_to_iso(target_x, target_y)
			camera.camera_x = new_pos[0]*128*camera.scale-camera.viewport_width/2;
			camera.camera_y = new_pos[1]*128*camera.scale-camera.viewport_height/2;

		}
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
			img_x = (position["x"]);
			img_y = (position["y"]);
			var iso_pos = this.cart_to_iso(img_x, img_y)
			canvas.drawImage(img,
				iso_pos[0] * sprite_sizes_x - camera.camera_x ,
				iso_pos[1] * sprite_sizes_y - camera.camera_y,
				sprite_sizes_x,
				sprite_sizes_y);
		}
		
	}

	this.handle_user_input = function(canvas, camera) {
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
		$(document.body).on('mousedown', function(e){
			var pos = getCursorPosition(canvas, e);
			var test = self.iso_to_cart(pos["x"], pos["y"]);
			console.log(test[0]+", "+test[1])
		});
	}

}
function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
    return {"x":x, "y":y}
}