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
        user = User.query.filter_by(user_id=current_user.get_id()).first()
        server.new_connection(user)
        socketio.emit('initial_user_info', {'username': user.username, 'id':user.user_id})


@game.route("/", methods=["GET"])
def Descent():
    return render_template('game.html')
