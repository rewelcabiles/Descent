
var EmptyState = function() {
    var name = "EmptyState"; // Just to identify the State
    var update  = function (){};
    var render  = function (){};
    var onEnter = function (){};
    var onExit  = function (){};

    // Optional but useful
    var onPause = function (){};
    var onResume= function (){};
};

var StateList = function (){
        var states = [];
        var pop = function () {
                return states.pop();
        };
        var push = function (state) {
                states.push(state);
        };
        var top = function (){
                return states[states.length-1];
        }
};

var StateStack = function () {
    var states = new StateList();
    states.push(new EmptyState());
    var update = function (){
            var state = states.top();
            if (state){
                    state.update();
            }
    };
    var render = function (){
            var state = states.top();
            if (state){
                    state.render();
            }
    };
    var push = function (state) {
            states.push(state);
            state.onEnter();
    };
    var pop = function () {
            var state = states.top();
            state.onExit();
            return states.pop();
    };

    var pause = function (){
            var state = states.top();
            if (state.onPause){
                    state.onPause();
            }
    };

    var resume = function (){
            var state = states.top();
            if (state.onResume){
                    state.onResume();
            }
    };
};