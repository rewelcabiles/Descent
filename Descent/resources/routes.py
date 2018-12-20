from flask import Blueprint

resources = Blueprint(
    'resources',
    __name__,
    template_folder='templates/resource/',
    static_folder="static/resource")
