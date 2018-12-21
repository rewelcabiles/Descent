from flask import render_template, request, url_for, flash, redirect, Blueprint
from flask_login import current_user, login_required, login_user

game = Blueprint(
    'game',
    __name__,
    template_folder='templates/game/',
    static_folder="static/game")


@game.route("/", methods=["GET"])
def home():
    pass
