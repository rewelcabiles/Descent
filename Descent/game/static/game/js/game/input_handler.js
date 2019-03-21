var InputHandler = function(){
	this.input_flags = {
		"mouse_down": false,
		"mouse_up": false
	}
	let kibo = new Kibo()
	self = this;

	this.notify = function(message){
		if(message["type"] == "keypress_arrows"){
			
		}
	}
	this.set_camera_flags = function(camera, key, state){
		camera.movement_flags[key] = state
	}

	this.tile_click = function(cart_pos){
		console.log(cart_pos);
		if(cart_pos[0] > 0 && cart_pos[1] > 0){
			socket.emit('client_event', {
				'type': 'tile_click',
				'position' : cart_pos
			});
		}
	}

	this.handle_user_input = function(canvas) {
		kibo.down(["any arrow"],function(){
			self.set_camera_flags(rpg.camera, kibo.lastKey(), true);
		});
		kibo.up(["any arrow"],function(){
			self.set_camera_flags(rpg.camera, kibo.lastKey(), false);
		});

		$(document.body).on('mousedown', function(e){
			var raw_pos = get_cursor(e)
			var pos = scale_mouse_clicks(raw_pos, rpg.camera);
			var cart_pos = get_tile_coordinates(iso_to_cart(pos[0], pos[1]), 128*rpg.camera.scale);
			console.log(cart_pos);
			self.tile_click(cart_pos)
		});
	}
}