var Camera = function(dimensions){
	this.camera_x = -600;
	this.camera_y = 500;
	this.scale = 0.60;
	this.viewport_width  = dimensions.width;
	this.viewport_height = dimensions.height;
	this.viewport_center = {"x":this.viewport_height / 2, "y":this.viewport_width / 2}
	this.follow_target = null;

	this.set_target = function(target){
		this.follow_target = target
	}

	this.update = function(){
		if (this.follow_target != null){
			this.camera_x = this.follow_target["x"] + this.viewport_center[x]
			this.camera_y = this.follow_target["y"] + this.viewport_center[y]
		}
	}
}