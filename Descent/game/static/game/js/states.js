// MainMenuState.js
var state_mainmenu = function () {
    this.name = "state_mainmenu";

    var canvas = getCanvas(),
        dimensions = getGameDimensions(),
        backgroundColor = "#000",
        textColor = "rgb(0,0,0)", // Starts with black
        colorsArray = [], // our fade values
        colorIndex = 0;

    this.onEnter = function(){
        var i = 1,l=100,values = [];
        for(;i<=l;i++){
            values.push(Math.round(Math.sin(Math.PI*i/100)*255));
        }
        colorsArray = values;

        this.ui_state_layer  = document.createElement("div");
        this.ui_state_layer.className += "mm_menu_wrapper";

        var btn_group  = document.createElement("div");
        btn_group.className += "btn-group-vertical";

        var btn_startgame = document.createElement("button");
        btn_startgame.innerHTML  = "Start Game";
        btn_startgame.className = "btn btn-outline-danger";
        btn_startgame.width = "200px";
        btn_startgame.id = "mm_start_game";
        btn_startgame.onclick = function(){
            console.log("START GAME");
            Game.state_stack.pop()
            Game.state_stack.push(new state_game());

        };
        console.log("mm loaded");
        var btn_loadgame = document.createElement("button");
        btn_loadgame.innerHTML  = "Load Game";
        btn_loadgame.className = "btn btn-outline-danger mt-4";
        btn_loadgame.width = "200px";

        btn_group.appendChild(btn_startgame);
        btn_group.appendChild(btn_loadgame);
        
        this.ui_state_layer.appendChild(btn_group);
        Game.uiLayer.appendChild(this.ui_state_layer);


    };

    this.onExit  = function(){
        // clear the keydown event
        window.onkeydown = null;
        canvas.clearRect(0,0,dimensions.width,dimensions.height)
        canvas.beginPath();
        canvas.fillStyle = backgroundColor;
        canvas.fillColor = backgroundColor;
        canvas.fillRect(0,0,dimensions.width,dimensions.height);
        this.ui_state_layer.parentNode.removeChild(this.ui_state_layer)
    };

    this.update = function (){
        // update values
        if (colorIndex == colorsArray.length){
            colorIndex = 0;
        }
        textColor = "rgb("+colorsArray[colorIndex]+","+colorsArray[colorIndex]+","+colorsArray[colorIndex]+")";
        colorIndex++;
    };

    this.render = function (){
        // redraw
        canvas.clearRect(0,0,dimensions.width,dimensions.height)
        canvas.beginPath();
        canvas.fillStyle = backgroundColor;
        canvas.fillColor = backgroundColor;
        canvas.fillRect(0,0,dimensions.width,dimensions.height);
        canvas.fillStyle = textColor;
        canvas.font = "60pt Courier";
        canvas.fillText("Descent", (dimensions.width/2)-(canvas.measureText("Descent").width/2), 100);
        canvas.font = "24pt Courier";
        canvas.fillText("Welcome "+username, (dimensions.width/2)-(canvas.measureText("Welcome "+username).width/2), 150);


        //canvas.fillText("Start Game", (dimensions.width/2)-(canvas.measureText("Start Game").width/2), 250);
        //canvas.fillText("Load Game", (dimensions.width/2)-(canvas.measureText("Load Game").width/2), 300);

    };
};

var state_game = function() {
    this.name = "state_game"; // Just to identify the State
    this.world = {};

    var received_data = false;
    var self = this;
    var canvas = getCanvas(),
        dimensions = getGameDimensions(),
        backgroundColor = "#000"
    self = this
    this.asset_manager = new AssetManager()
    this.asset_manager.preload_assets()
    this.message_board = new Messenger()
    this.systems = new ECS_Systems(this.asset_manager, this.message_board);
    this.camera  = new Camera(dimensions);
    this.message_board.register(this.camera.notify)
    this.message_board.register(this.systems.notify)
    this.systems.handle_user_input(getCanvasElement(), this.camera);
    this.update  = function (){
        if(received_data == true){
            canvas.clearRect(0,0,dimensions.width,dimensions.height)
            canvas.beginPath();
            canvas.fillStyle = backgroundColor;
            canvas.fillColor = backgroundColor;
            canvas.fillRect(0,0,dimensions.width,dimensions.height);
            this.systems.render(canvas, this.camera);    
            
            this.systems.camera_follow(this.world, this.camera);
        }
    };

    this.onEnter = function (){
        socket.emit('mm_new_game');
        socket.on('get_world_data', function(data) {
            self.world = JSON.parse(data["world_data"]);
            self.systems.set_data(self.world, JSON.parse(data["component_data"]));
            self.player_id = data["player_id"];
            // self.message_board.add_to_queue({
            //     "type" : "change_camera_target",
            //     "data" : data["player_id"]
            // });
            received_data = true;
        });
    };

    this.render  = function (){};
    this.onExit  = function (){};
    this.onPause = function (){};
    this.onResume= function (){};
};

