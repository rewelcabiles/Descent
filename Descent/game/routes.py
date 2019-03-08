from flask import render_template, Blueprint
from flask_login import current_user
from Descent import socketio
from Descent.game.server_utils import Server
from Descent.users.models import User

server = Server()
game = Blueprint(
    'game',
    __name__,
    template_folder='templates/game/',
    static_folder="static/game")


@socketio.on('sync users')
def sync_users(packet):
    if not current_user.is_anonymous:
        server.new_connection(current_user)
        socketio.emit('initial_user_info', {
        	'username': current_user.username, 
        	'id':current_user.user_id})


@socketio.on('mm_new_game')
def send_world_data():
	print("mm_new_game")
	connection = server.get_connection(current_user.get_id())
	socketio.emit("get_world_data", {
		"world_data": connection.game.world.get_world_as_json(),
		"component_data": connection.game.world.get_components_as_json()
		})

@game.route("/", methods=["GET"])
def Descent():
    return render_template('game.html')
