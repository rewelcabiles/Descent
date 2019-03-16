var Camera = function(dimensions){
	var camera_x = -400,
		camera_y = 0,
		scale = 0.4,
		viewport_width  = dimensions.width,
		viewport_height = dimensions.height,
		viewport_center = {"x":viewport_height / 2, "y":viewport_width / 2},
		follow_target_id = null;

	var set_target = function(target) {
		follow_target_id = target;
	}

	var notify = function(message){
		if(message["type"] == "change_camera_target"){
			set_target(message["data"]);
		}
	}
}