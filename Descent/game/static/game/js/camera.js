var Camera = function(dimensions){

	this.camera_x = 0;
	this.camera_y = 0;
	this.camera_velocity_x = 0;
	this.camera_velocity_y = 0;
	this.camera_acceleration = 2
	this.camera_velocity_max = 10;

	this.scale = 0.6;

	this.viewport_width  = dimensions.width;
	this.viewport_height = dimensions.height;

	this.movement_flags={
		"up"   : false,
		"down" : false,
		"left" : false,
		"right": false
	}

	
	this.follow_target_id = null;
	self = this;

	this.update = function(world){
		this.apply_movement_flags();
		this.camera_follow(world);
		this.apply_movement_physics();
	}

	this.apply_movement_physics = function(){
		this.camera_x += this.camera_velocity_x;
		this.camera_y += this.camera_velocity_y;
	}

	this.apply_movement_flags = function(){
		if (this.movement_flags["up"] == true){
			if (Math.abs(this.camera_velocity_y) < this.camera_velocity_max){
				this.camera_velocity_y -= this.camera_acceleration;
			}
		}else if(this.camera_velocity_y < 0){
			this.camera_velocity_y += this.camera_acceleration;
		}
		if (this.movement_flags["down"]){
			if (Math.abs(this.camera_velocity_y) < this.camera_velocity_max){
				this.camera_velocity_y += this.camera_acceleration;
			}
		}else if(this.camera_velocity_y > 0){
			this.camera_velocity_y -= this.camera_acceleration;
		}
		if (this.movement_flags["left"]){
			if (Math.abs(this.camera_velocity_x) < this.camera_velocity_max){
				this.camera_velocity_x -= this.camera_acceleration;
			}
		}else if(this.camera_velocity_x < 0){
			this.camera_velocity_x += this.camera_acceleration;
		}
		if (this.movement_flags["right"]){
			if (Math.abs(this.camera_velocity_x) < this.camera_velocity_max){
				this.camera_velocity_x += this.camera_acceleration;
			}
		}else if(this.camera_velocity_x > 0){
			this.camera_velocity_x -= this.camera_acceleration;
		}
	}

	this.camera_follow = function(world){
		if (this.follow_target_id != null){
			target_x = world["position"][this.follow_target_id]["x"];
			target_y = world["position"][this.follow_target_id]["y"];
			new_pos = cart_to_iso(target_x, target_y, 128)
			this.camera_x = (new_pos[0] * this.scale) - this.viewport_width/2;
			this.camera_y = (new_pos[1] * this.scale) - this.viewport_height/2;
		}
	}

	this.set_target = function(target) {
		this.follow_target_id = target;
	}

	this.notify = function(message){
		if(message["type"] == "change_camera_target"){
			self.set_target(message["data"]);
		}
	}
}