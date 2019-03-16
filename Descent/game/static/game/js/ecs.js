function ECS_Systems (state, message_board) {
	//Properties
	
	var z_layer
	var state = state
	var world = {}
	var COMPS = {}
	var message_board = message_board
	var kibo = new Kibo()
	// Functions

	var notify = function(message){

	}

	var create_dynamic_mask = function(component_list) {
		let temp_mask = 0;
		for (components in component_list){
			temp_mask |= COMPS[components];
		}
		return temp_mask;
	}

	var has_components = function(entity_id, component_list){
		let temp_mask = create_dynamic_mask(component_list);
		if((world['mask'][entity_id] & temp_mask) == temp_mask){
			return true
		}
	}

	var set_data = function(worlds, components){
		world = worlds;
		COMPS = components
	}

	var update_z_layer = function(){
		let component_list = ["position", "image"];
		z_layer = []
		for (entity_id in world["mask"]){
			if(has_components(entity_id, component_list)){
				z_layer.push(entity_id)
			}
		}
		z_layer.sort(sortMe);
	}

	var sortMe = function(a, b){
	    return (world["position"][a]['x'] - world["position"][b]['x']) || (world["position"][a]['y'] - world["position"][b]['y']);
	}
	
	var camera_follow = function(world, camera){
		if (camera.follow_target_id != null){
			let cf_target_x = world["position"][camera.follow_target_id]["x"];
			let cf_target_y = world["position"][camera.follow_target_id]["y"];
			let cf_new_pos = cart_to_iso(cf_target_x, cf_target_y, 128)
			camera.camera_x = (cf_new_pos[0] * camera.scale) - camera.viewport_width/2;
			camera.camera_y = (cf_new_pos[1] * camera.scale) - camera.viewport_height/2;
		}
	}

	var render = function(canvas, camera) {
		//Components needed for this to render
		update_z_layer()
		let sprite_sizes_x = 128*camera.scale;
		let sprite_sizes_y = 128*camera.scale;
		let z_layer_length = z_layer.length;

		for (var i = 0; i < z_layer_length; i++){
			let entity_id = z_layer[i];
			let image_name = world["image"][entity_id]["file_name"]
			let position   = world["position"][entity_id]
			let img = state.asset_manager.get_asset(image_name);
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

	var handle_user_input = function(canvas, camera) {
		kibo.up(["any arrow"],function(){
			switch (kibo.lastKey()){
				case "left":
					camera.camera_x -= 1;		
					break
				case "right":
					camera.camera_x += 1;
					break
				case "up":
					camera.camera_y -= 1;
					break
				case "down":
					camera.camera_y += 1;
					break
			}
		});

		$(document.body).on('mousedown', function(e){
			let raw_pos = get_cursor(canvas, e)
			let pos = scale_mouse_clicks(raw_pos, camera);
			let cart_pos = get_tile_coordinates(iso_to_cart(pos[0], pos[1]), 128*camera.scale);
		});
	}
}

var Messenger = function(){
	var observers = []

	var add_to_queue = function(message){
		notify_observers(message)
		
	}

	var register = function(observer){
		observers.push(observer)
		console.log(observers)
	}

	var notify_observers = function(message){
		observers.forEach(function(observer){
			observer(message);
		});
	}
}