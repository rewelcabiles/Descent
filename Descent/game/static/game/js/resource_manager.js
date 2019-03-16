
// Warning: This class only loads images for now and is hardcoded to do that
// 			Make it more modular for the future

var AssetManager = function(){
	var resource_folder = "game/resources";
	var resources = {};

	var preload_assets = function(){
		assets = ["wall_01.png", "floor_stone_01.png", "NONE.png", "door.png", "character.png"]
		
		for (items in assets){
			resources[assets[items]] = new Image();
			resources[assets[items]].src = "game/resources/images/"+assets[items];
		}
	}

	var get_asset = function(file_name){
		return resources[file_name];
	}
}