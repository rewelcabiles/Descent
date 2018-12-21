from flask import Blueprint

resources = Blueprint(
    'resources',
    __name__,
    template_folder='templates/resources/',
    static_folder="static/resource")
