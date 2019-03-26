// MainMenuState.js
var state_mainmenu = function () {
    this.name = "state_mainmenu";

    //UI 

    $("#single_game").click(function(){
        Game.state_stack.pop()
        Game.state_stack.push(new state_game());
    });

    //Canvas
    var canvas = getCanvas(),
        dimensions = getGameDimensions();
        
    //State Functions
    this.onEnter = function(){
        $("#uiLayer").append($("#ui_main_menu"));
    };

    this.onExit  = function(){
        window.onkeydown = null;
        $("#ui_main_menu").slideUp('fast', function(){
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

    this.update = function (){
        
    };

    this.onEnter = function (){
        
    };
    this.render  = function (){};
    this.onExit  = function (){};
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

