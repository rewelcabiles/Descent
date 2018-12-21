from flask import render_template, request, url_for, flash, redirect, Blueprint
from flask_login import current_user, login_required, login_user

site = Blueprint(
    'site',
    __name__,
    template_folder='templates/site/',
    static_folder="static/site")


@site.route("/", methods=["GET"])
def home():
    return render_template("home.html")
