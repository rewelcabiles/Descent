#!/usr/bin/env python

from Descent import app
from flask_socketio import SocketIO

socketio = SocketIO(app)

if __name__ == '__main__':
        socketio.run(app)

