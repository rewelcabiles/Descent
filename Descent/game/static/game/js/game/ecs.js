var ECS_Systems = function () {
	//Properties

	
	// Functions
	this.notify = function(message){}

	this.move_entity = function(world, entity_id, new_pos){
		world["position"][entity_id]["x"] = new_pos["x"]
		world["position"][entity_id]["y"] = new_pos["y"]
		console.log("MOVING ENTITY TO: ")
		console.log(new_pos)
	}
}

