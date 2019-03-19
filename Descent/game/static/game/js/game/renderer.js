var RenderSystem = function(world, message_board){
	
	this.world = world
	this.message_board = message_board

	this.asset_manager = new AssetManager()
	this.asset_manager.preload_assets()

	this.render = function(canvas, camera) {
		//Components needed for this to render
		this.world.update_z_layer()
		let sprite_sizes_x = 128*camera.scale;
		let sprite_sizes_y = 128*camera.scale;
		let z_layer_length = this.world.z_layer.length;

		for (var i = 0; i < z_layer_length; i++){
			let entity_id = this.world.z_layer[i];
			let image_name = this.world.get_component("image", entity_id)["file_name"];
			let position   = this.world.get_component("position", entity_id);
			let img = asset_manager.get_asset(image_name);
			let img_x = (position["x"]);
			let img_y = (position["y"]);
			let iso_pos = cart_to_iso(img_x, img_y, sprite_sizes_y);
			canvas.drawImage(img,
				(iso_pos[0]) - camera.camera_x,
				(iso_pos[1]) - camera.camera_y,
				sprite_sizes_x,
				sprite_sizes_y);
		}
		canvas.fillStyle = "rgb(255, 255, 255)"
		canvas.font = "15px Arial";
		canvas.fillText("Camera Velocity X: "+camera.camera_velocity_x, 0, 60); 
		canvas.font = "15px Arial";
		canvas.fillText("Camera Velocity Y: "+camera.camera_velocity_y, 0,100); 
		canvas.font = "15px Arial";
		canvas.fillText("Camera Position X: "+camera.camera_x, 0,140); 
		canvas.font = "15px Arial";
		canvas.fillText("Camera Position Y: "+camera.camera_y, 0,180); 
	}
}