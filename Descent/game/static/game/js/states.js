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

        var wrapper_menu  = document.createElement("div");
        wrapper_menu.className += "mm_menu_wrapper";

        var btn_group  = document.createElement("div");
        btn_group.className += "btn-group-vertical";

        var btn_startgame = document.createElement("button");
        btn_startgame.innerHTML  = "Start Game";
        btn_startgame.className = "btn btn-outline-danger";
        btn_startgame.width = "200px";

        var btn_loadgame = document.createElement("button");
        btn_loadgame.innerHTML  = "Load Game";
        btn_loadgame.className = "btn btn-outline-danger mt-4";
        btn_loadgame.width = "200px";

        btn_group.appendChild(btn_startgame);
        btn_group.appendChild(btn_loadgame);
        
        wrapper_menu.appendChild(btn_group);
        Game.uiLayer.appendChild(wrapper_menu);


    };

    this.onExit  = function(){
        // clear the keydown event
        window.onkeydown = null;
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
    this.update  = function (){};
    this.render  = function (){};
    this.onEnter = function (){};
    this.onExit  = function (){};

    // Optional but useful
    this.onPause = function (){};
    this.onResume= function (){};
};