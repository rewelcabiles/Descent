var GameSystem = function(){
	this.canvas = getCanvas()
	
    this.received_data = false;


	this.asset_manager = new AssetManager()
    this.asset_manager.preload_assets()

	this.world = new world();
	this.messenger = new Messenger()
    this.systems = new ECS_Systems(this.world, this.asset_manager, this.message_board);
    this.camera  = new Camera();
    this.renderer = new RenderSystem(this.world, this.messenger)
    this.inputs = new InputHandler()

    this.inputs.handle_user_input(this.canvas)
    this.messenger.register(this.camera.notify)
    this.messenger.register(this.systems.notify)
}