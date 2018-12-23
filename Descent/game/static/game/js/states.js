// MainMenuState.js
var MainMenuState = function () {
    this.name = "MainMenuState";

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
        canvas.font = "24pt Courier";
        canvas.fillText("Main Menu", 120, 100);
    };
};