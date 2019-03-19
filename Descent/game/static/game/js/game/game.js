var Game = function(){
	this.world = new world();
	this.messenger = new Messenger()
	this.asset_manager = new AssetManager()
    this.asset_manager.preload_assets()
    this.systems = new ECS_Systems(this.world, this.asset_manager, this.message_board);
    this.camera  = new Camera(dimensions);
}