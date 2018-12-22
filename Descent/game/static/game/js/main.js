var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function() {
    
});


var Game = {
    // Canvas to draw on
    canvas_width:   640,
    canvas_height:  480,
    canvasElement:  null,
    canvas :        null,



    // The game loop
    FPS: 30,
    timer:null,
    timerID: null, // interval


    gameMode: new StateStack(),

    update: function () {
        this.gameMode.update();
        this.gameMode.render();
    },


    startGame: function() {
        this.gameMode.push(new MainMenuState());
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
        this.canvas = this.canvasElement.getContext("2d");

        wrapper.appendChild(this.canvasElement);
    },

    init: function () {
        this.setupCanvas(document.getElementById("main_window"));
        this.timer = 1000/this.FPS;
        this.startGame();
    },
}


window.onload = function () {
    window.getGameInstance = function () {
        return Game.gameMode;
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
        Game.gameMode.pause();
        Game.pauseGame();
    };

    window.resumeGame = function () {
        Game.resumeGame();
        Game.gameMode.resume();
    };

    window.getCanvasElement = function (){
        return Game.canvasElement;
    };

    Game.init();
};

var main_loop = function () {

    // update all values
    //Game.update()

    // draw on the canvas.
    
};

var timer = setInterval(function (){
        main_loop();
},1000/30);