var ECS_Systems = function (world, asset_manager, message_board) {
	//Properties
	
	this.world = world

	var asset_manager = asset_manager
	var message_board = message_board
	var kibo = new Kibo()

	var self = this
	// Functions

	this.notify = function(message){

	}
	
	this.camera_follow = function(world, camera){
		if (camera.follow_target_id != null){
			target_x = this.world.get_component("position",camera.follow_target_id)["x"];
			target_y = this.world.get_component("position", camera.follow_target_id)["y"];
			new_pos = cart_to_iso(target_x, target_y, 128)
			camera.camera_x = (new_pos[0] * camera.scale) - camera.viewport_width/2;
			camera.camera_y = (new_pos[1] * camera.scale) - camera.viewport_height/2;
		}
	}

	this.render = function(canvas, camera) {
		//Components needed for this to render
		this.world.update_z_layer()
		let sprite_sizes_x = 128*camera.scale;
		let sprite_sizes_y = 128*camera.scale;
		let z_layer_length = this.world.z_layer.length;

		for (var i = 0; i < z_layer_length; i++){
			let entity_id = this.world.z_layer[i];
			let image_name = this.world.get_component("image", entity_id)["file_name"];
			let position   = this.world.get_component("position", entity_id);
			let img = asset_manager.get_asset(image_name);
			let img_x = (position["x"]);
			let img_y = (position["y"]);
			let iso_pos = cart_to_iso(img_x, img_y, sprite_sizes_y);
			canvas.drawImage(img,
				(iso_pos[0]) - camera.camera_x,
				(iso_pos[1]) - camera.camera_y,
				sprite_sizes_x,
				sprite_sizes_y);
		}
		
	}

	this.handle_user_input = function(canvas, camera) {
		kibo.down(["any arrow"],function(){
			switch (kibo.lastKey()){
				case "left":
					camera.camera_x -= 10;		
					break
				case "right":
					camera.camera_x += 10;
					break
				case "up":
					camera.camera_y -= 10;
					break
				case "down":
					camera.camera_y += 10;
					break
			}
		});

		$(document.body).on('mousedown', function(e){
			console.log(self.world)
			var raw_pos = get_cursor(canvas, e)
			var pos = scale_mouse_clicks(raw_pos, camera);
			var cart_pos = get_tile_coordinates(iso_to_cart(pos[0], pos[1]), 128*camera.scale);
			console.log(cart_pos);
		});
	}
}

