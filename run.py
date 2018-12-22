#!/usr/bin/env python

from Descent import app, socketio
from flask_socketio import SocketIO

if __name__ == '__main__':
        socketio.run(app)

