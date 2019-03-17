from flask import render_template, Blueprint
from flask_login import current_user, login_required
from Descent import socketio
from Descent.game.server_utils import Server
from Descent.users.models import User

server = Server()
game = Blueprint(
    'game',
    __name__,
    template_folder='templates/game/',
    static_folder="static/game")



@game.route("/", methods=["GET"])
@login_required
def Descent():
    return render_template('game.html')
