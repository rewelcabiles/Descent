
var game_sockets = function(){

    console.log("Emmiting Connect Game")
	socket.emit('connect_game');

	socket.on('new_packet', function(data) {
        console.log("RECEIVED PACKET")
        console.log(data)
        if(data["type"] == "move_entity"){
            rpg.systems.move_entity(rpg.world.get_world(), data["entity_id"], data["pos"])
        }else if (data["type"] == "new_connection"){
            rpg.world.add_to_world(data["data"])
        }
    });
    
    socket.on('get_world_data', function(data) {
        rpg.world.set_data(JSON.parse(data["world_data"]), JSON.parse(data["component_data"]));
        rpg.received_data = true;
    });
}