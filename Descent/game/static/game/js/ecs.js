var ECS_Systems = function (world, asset_manager, message_board) {
	//Properties
	// THINGS TO DO, CLEAN UP AND ORGANIZE CLIENT SIDE CODE
	this.world = world
	this.inputs = new InputHandler()
	var asset_manager = asset_manager
	var message_board = message_board
	var kibo = new Kibo()
	var self = this
	
	// Functions
	this.notify = function(message){

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
		canvas.fillStyle = "rgb(255, 255, 255)"
		canvas.font = "15px Arial";
		canvas.fillText("Camera Velocity X: "+camera.camera_velocity_x, 0, 60); 
		canvas.font = "15px Arial";
		canvas.fillText("Camera Velocity Y: "+camera.camera_velocity_y, 0,100); 
		canvas.font = "15px Arial";
		canvas.fillText("Camera Position X: "+camera.camera_x, 0,140); 
		canvas.font = "15px Arial";
		canvas.fillText("Camera Position Y: "+camera.camera_y, 0,180); 
	}

	this.move_entity = function(world, entity_id, new_pos){
		world["position"][entity_id]["x"] = new_pos["x"]
		world["position"][entity_id]["y"] = new_pos["y"]
		console.log("MOVING ENTITY TO: ")
		console.log(new_pos)
	}

	this.handle_user_input = function(canvas, camera) {
		kibo.down(["any arrow"],function(){
			self.inputs.set_camera_flags(camera, kibo.lastKey(), true);
		});
		kibo.up(["any arrow"],function(){
			self.inputs.set_camera_flags(camera, kibo.lastKey(), false);
		});

		$(document.body).on('mousedown', function(e){
			var raw_pos = get_cursor(canvas, e)
			var pos = scale_mouse_clicks(raw_pos, camera);
			var cart_pos = get_tile_coordinates(iso_to_cart(pos[0], pos[1]), 128*camera.scale);
			console.log(cart_pos);
			socket.emit('client_event', {
				'type': 'tile_click',
				'position' : cart_pos
			});
		});
	}
}

