var InputHandler = function(){
	this.input_flags = {
		"mouse_down": false,
		"mouse_up": false
	}

	this.notify = function(message){
		if(message["type"] == "keypress_arrows"){
			
		}
	}
	this.set_camera_flags = function(camera, key, state){
		camera.movement_flags[key] = state
	}
}