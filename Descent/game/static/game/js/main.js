var socket = io.connect('http://' + document.domain + ':' + location.port);
var username = ""
var user_id = null

socket.on('connect', function() {
    socket.emit('connected');
});

socket.on('initial_user_info', function(data) {
    username = data["username"];
});



var Game = {
    // Canvas to draw on
    canvas_width:   $(document).width(),
    canvas_height:  $(document).height(),
    canvasElement:  null,
    canvas :        null,

    // The game loop
    FPS: 30,
    timer:null,
    timerID: null, // interval
    ui:{},

    state_stack: new StateStack(),

    set_ui: function(){
        let children = $("#uiLayer").children();
        for (var i=0; i<children.length; i++) {
          let child_id = children[i].id;
          this.ui[child_id] = $("#"+child_id)
          $("#"+child_id).detach();
        }
    },

    update: function () {
        this.state_stack.update();
        this.state_stack.render();
    },


    startGame: function() {
        this.state_stack.push(new state_mainmenu());
        this.timerID = setInterval(this.update.bind(this),this.timer);

    },

    pauseGame:function (){
        clearInterval(this.timerID);
    },

    resumeGame: function (){
        this.timerID = setInterval(this.update.bind(this),this.timer);
    },

    /**
     * Initialize the canvas to the page
     */
    setupCanvas: function (wrapper) {
        this.canvasElement = document.createElement("canvas");
        this.canvasElement.width = this.canvas_width;
        this.canvasElement.height = this.canvas_height;
        this.canvasElement.id = "main_canvas";
        this.canvas = this.canvasElement.getContext("2d");

        wrapper.appendChild(this.canvasElement);
    },

    init: function () {
        this.set_ui()
        this.setupCanvas(document.getElementById("main_window"));
        this.timer = 1000/this.FPS;
        
        this.startGame();
    },
}


window.onload = function () {
    window.getGameInstance = function () {
        return Game.state_stack;
    };

    window.getCanvas = function (){
        return Game.canvas;
    };

    window.getGameDimensions = function() {
        return {
            width: Game.canvas_width,
            height: Game.canvas_height
        };
    };

    window.pauseGame = function (){
        Game.state_stack.pause();
        Game.pauseGame();
    };

    window.resumeGame = function () {
        Game.resumeGame();
        Game.state_stack.resume();
    };

    window.getCanvasElement = function (){
        return Game.canvasElement;
    };

    Game.init();
};

var main_loop = function () {

    // update all values
    Game.update()

    // draw on the canvas.
    
};

var timer = setInterval(function (){
        main_loop();
},1000/30);