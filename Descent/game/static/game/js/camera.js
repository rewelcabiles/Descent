var Camera = function(dimensions){
	this.camera_x = -400;
	this.camera_y = 0;
	this.scale = 0.4;
	this.viewport_width  = dimensions.width;
	this.viewport_height = dimensions.height;
	this.viewport_center = {"x":this.viewport_height / 2, "y":this.viewport_width / 2}
	this.follow_target_id = null;
	self = this;
	this.set_target = function(target) {
		this.follow_target_id = target;
	}

	this.notify = function(message){
		if(message["type"] == "change_camera_target"){
			self.set_target(message["data"]);
		}
	}
}