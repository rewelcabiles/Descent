var Camera = function(dimensions){
	this.camera_x = -400;
	this.camera_y = 0;
	this.scale = 0.5;
	this.viewport_width  = dimensions.width;
	this.viewport_height = dimensions.height;
	this.viewport_center = {"x":this.viewport_height / 2, "y":this.viewport_width / 2}
	this.follow_target_id = null;

	this.set_target = function(target){
		this.follow_target_id = target;
	}
}