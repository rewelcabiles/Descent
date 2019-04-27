var RenderSystem = function(){
	
	let dimensions = getGameDimensions(),
		backgroundColor = "#000"

	this.render = function() {
		boiler_plate()		
		//Components needed for this to render
		rpg.world.update_z_layer()
		let sprite_sizes_x = 128*rpg.camera.scale;
		let sprite_sizes_y = 128*rpg.camera.scale;
		let z_layer_length = rpg.world.z_layer.length;

		for (var i = 0; i < z_layer_length; i++){
			let entity_id = rpg.world.z_layer[i];
			let image_name = rpg.world.get_component("image", entity_id)["file_name"];
			let position   = rpg.world.get_component("position", entity_id);
			let img = rpg.asset_manager.get_asset(image_name);
			let img_x = (position["x"]);
			let img_y = (position["y"]);
			let iso_pos = cart_to_iso(img_x, img_y, sprite_sizes_y);
			rpg.canvas.drawImage(img,
				(iso_pos[0]) - rpg.camera.camera_x,
				(iso_pos[1]) - rpg.camera.camera_y,
				sprite_sizes_x,
				sprite_sizes_y);
		}
		debug_text()
	}



	let boiler_plate = function(){
		rpg.canvas.clearRect(0,0,dimensions.width,dimensions.height)
        rpg.canvas.beginPath();
        rpg.canvas.fillStyle = backgroundColor;
        rpg.canvas.fillColor = backgroundColor;
        rpg.canvas.fillRect(0,0,dimensions.width,dimensions.height);
	}

	let debug_text = function(){
		rpg.canvas.fillStyle = "rgb(255, 255, 255)"
		rpg.canvas.font = "15px Arial";
		rpg.canvas.fillText("Camera Velocity X: "+rpg.camera.camera_velocity_x, 0, 60); 
		rpg.canvas.font = "15px Arial";
		rpg.canvas.fillText("Camera Velocity Y: "+rpg.camera.camera_velocity_y, 0,100); 
		rpg.canvas.font = "15px Arial";
		rpg.canvas.fillText("Camera Position X: "+rpg.camera.camera_x, 0,140); 
		rpg.canvas.font = "15px Arial";
		rpg.canvas.fillText("Camera Position Y: "+rpg.camera.camera_y, 0,180); 
		rpg.canvas.font = "15px Arial";
		rpg.canvas.fillText("Entities In World: "+Object.keys(rpg.world.WORLD["mask"]).length, 0,200); 
	}
}