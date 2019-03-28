// MainMenuState.js
var state_mainmenu = function () {
    this.name = "state_mainmenu";
    this.ui_name = "ui_main_menu";
    //UI 

    socket.on("game_created", function(){
        Game.state_stack.pop()
        Game.state_stack.push(new state_game());
    });

    //Canvas
    var canvas = getCanvas(),
        dimensions = getGameDimensions();
        
    //State Functions
    this.onEnter = function(){
        $("#uiLayer").append(Game.ui[this.ui_name]);
        $("#single_game").click(function(){
            //socket.emit("start_game");
            Game.state_stack.pop()
            Game.state_stack.push(new state_class_select())
        });
    };  

    this.onExit  = function(){
        window.onkeydown = null;
        Game.ui[this.ui_name].slideUp('fast', function(){
            $("#ui_main_menu").detach();
        });
    };

    this.update = function (){};

    this.render = function (){        // redraw
        canvas.fillRect(0,0,dimensions.width,dimensions.height);
    };
};


var state_class_select = function(){
    this.name = "state_class_select";
    this.ui_name = "ui_class_select";
    self=this;

    socket.on('class_data', function(data){
        console.log(data)
        let character_list = []
        for(index in data){
            let character = data[index]
            let char_name = character["name"][0].toUpperCase() + character["name"].slice(1);
            character_list.push(character);
            let new_button = "<button id='cs_"+character["name"]+"' class='btn btn-outline-danger mb-4'>"+char_name+"</button>"
            $("#cs_mid").append(new_button);
            self.create_event(character)
        }
        self.set_data(character_list[0])
    });

    this.set_data = function(character){
        let stats = character["stats"]
        $('#cs_name').html(character["name"].toUpperCase());
        $('#cs_con').html("Con: "+stats["con"]);
        $('#cs_agi').html("Agi: "+stats["agi"]);
        $('#cs_int').html("Int: "+stats["int"]);
        $('#cs_str').html("Str: "+stats["str"]);
        $('#cs_mana').html("Mana: "+10);
        $('#cs_health').html("Health: "+10);
        $('#char_por').attr("src", "game/resources/images/"+character["image"])
    }

    this.create_event = function(character){
        $("#cs_"+character["name"]).click(function(){
            self.set_data(character)
        });
    }

    this.update = function (){
        
    };

    this.onEnter = function (){
        $("#uiLayer").append(Game.ui[this.ui_name]);
        socket.emit('class_select');

    };
    this.render  = function (){};
    this.onExit  = function (){
        Game.ui[this.ui_name].detach()
    };
    this.onPause = function (){};
    this.onResume= function (){};
}


var state_game = function() {
    this.name = "state_game";

    this.update = function (){
        if(rpg.received_data == true){
            rpg.renderer.render();
            rpg.camera.update();
        }
    };

    this.onEnter = function (){
        $('#main_canvas').fadeIn('fast');
        rpg = new GameSystem()
        var socket_handler = new game_sockets()
    };
    this.render  = function (){};
    this.onExit  = function (){};
    this.onPause = function (){};
    this.onResume= function (){};
};

