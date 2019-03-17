function iso_to_cart(iso_x, iso_y){
	cart_x = (2 * iso_y + iso_x) / 2;
	cart_y = (2 * iso_y - iso_x) / 2;
	return [cart_x, cart_y]
}
// function cart_to_iso(cart_x, cart_y){
// 	iso_x = cart_x - cart_y;
// 	iso_y = (cart_x + cart_y) / 2;
// 	return [iso_x, iso_y]
// }
function cart_to_iso(cart_x, cart_y, tile_size){
	iso_x = (cart_x*(tile_size/2)) - (cart_y*(tile_size/2)) - (tile_size/2);
	iso_y = (cart_x*(tile_size/2) + cart_y*(tile_size/2)) / 2;
	return [iso_x, iso_y]
}

function get_tile_coordinates(points, tile_size){
	temp_x = Math.floor(points[0] / (tile_size));
	temp_y = Math.floor(points[1] / (tile_size));
	return [temp_x, temp_y];
}
function get_cursor(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return [x, y]
}
function scale_mouse_clicks(pos, camera){
	return [(pos[0]+camera.camera_x), (pos[1]+camera.camera_y)];
}

var Messenger = function(){
	this.observers = []

	this.add_to_queue = function(message){
		this.notify_observers(message)
	}

	this.register = function(observer){
		this.observers.push(observer)
	}

	this.notify_observers = function(message){
		this.observers.forEach(function(observer){
			observer(message);
		});
	}
}