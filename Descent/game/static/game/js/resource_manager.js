
// Warning: This class only loads images for now and is hardcoded to do that
// 			Make it more modular for the future

var AssetManager = function(){
	this.resource_folder = "game/resources";
	this.resources = {};

	this.preload_assets = function(){
		assets = ["wall_01.png", "floor_stone_01.png", "NONE.png", "door.png", "door_right.png", "character.png", "warrior.png"]
		
		for (items in assets){
			this.resources[assets[items]] = new Image();
			this.resources[assets[items]].src = "game/resources/images/"+assets[items];
		}
	}

	this.get_asset = function(file_name){
		return this.resources[file_name];
	}
}