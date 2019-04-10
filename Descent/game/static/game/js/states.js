// MainMenuState.js
var state_mainmenu = function () {
    this.name = "state_mainmenu";
    this.ui_name = "ui_main_menu";
    //UI 

    socket.on("game_created", function(){
        Game.state_stack.pop()
        Game.state_stack.push(new state_game());
    });

    socket.on("cs_screen", function(){
        Game.state_stack.pop()
        Game.state_stack.push(new state_class_select())
    })

    //Canvas
    var canvas = getCanvas(),
        dimensions = getGameDimensions();
        
    //State Functions
    this.join_lobby = function(){
        let lobby_code = $("#mm_join_lobby_code").val()
        $( "#mm_join_lobby" ).dialog("close");
        socket.emit("join_lobby", lobby_code)
    }

    this.onEnter = function(){
        $("#uiLayer").append(Game.ui[this.ui_name]);
        $( "#mm_join_lobby" ).dialog({
          autoOpen: false,
          modal:true,
          buttons: {
            "Join Lobby": this.join_lobby,
            Cancel: function() {
              $( "#mm_join_lobby" ).dialog("close");
            }
          },
          show: {
            effect: "blind",
            duration: 500
          },
          hide: {
            effect: "blind",
            duration: 500
          }
        });
         
        $("#single_game").click(function(){
            socket.emit('start_game');
        });
        $("#create_lobby").click(function(){
            socket.emit('start_lobby');
        });
        $("#join_lobby").click(function(){
            $("#mm_join_lobby").dialog( "open" );
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
        self.lobby_id = data[1]
        $("#lobby_id").html("Lobby ID: "+self.lobby_id);
        data = data[0]
        let character_list = []
        for(index in data){
            let character = data[index]
            let char_name = character["name"][0].toUpperCase() + character["name"].slice(1);
            character_list.push(character);
            let new_button = "<button id='cs_"+character["name"]+"' class='ui-button ui-widget ui-corner-all mb-4'>"+char_name+"</button>"
            $("#cs_class_buttons").append(new_button);
            self.create_event(character)
        }
        $( "#cs_hero_stats" ).tabs().css({
           'min-height': '350px',
           'overflow': 'auto'
        });
        self.set_data(character_list[0])
    });

    socket.on('refresh_player_list', function(player_list){
        $("#cs_party_info").empty();
        for(player in player_list) {
            player = player_list[player]
            let new_member = `
            <div class="row p-2">
                <div class="col-2" id="cs_button_`+player["name"]+`">
                </div>
                <div class="col">
                    <h4 class="ml-4">`+player["name"]+`</h4>
                </div>
                <div class="col" id="cs_char_`+player["name"]+`">
                </div>
             </div>
            `
            $("#cs_party_info").append(new_member)
            if(player["status"] == 0 && player["name"] == username){
                ready_button = `<button id="cs_ready_`+player["name"]+`" class="btn btn-success">READY</button>`
                $("#cs_button_"+player["name"]).html(ready_button)
            }
            if(player["character"] == null){
                charname = `<h4 class="" id="cs_char_`+player["name"]+`"> --- </h4>`
            }else{
                charname = `<h4 class="" id="cs_char_`+player["name"]+`"> `+player["character"]+` </h4>`
            }
            if(player["status"] == 0){
                $("#cs_char_"+player["name"]).addClass("text-warning");
            }else if(player["status"] == 1){
                $("#cs_char_"+player["name"]).addClass("text-success");
            }
            $("#cs_char_"+player["name"]).html(charname)
        }
    })

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
            socket.emit("char_selected", character["name"])
        });
    }

    this.onEnter = function (){
        $("#uiLayer").append(Game.ui[this.ui_name]);
        socket.emit('request_classes');

    };
    this.onExit  = function (){
        Game.ui[this.ui_name].detach()
    };
    this.render  = function (){};
    this.update = function (){};
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

