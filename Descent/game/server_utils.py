from Descent.game.game_code import world, dungeon_generator, systems
from Descent import socketio
from flask_login import current_user

class Connection:
    def __init__(self, game, user=None):
        self.user = user
        self.game = game


class Game:
    def __init__(self):
        self.world = world.World()
        self.message_board = systems.MessageBoard()
        self.systems = systems.Systems(self.world, self.message_board)
        self.generator  = dungeon_generator.Division(self.world)
        self.generator.division()
        self.player_id = self.systems.add_player()
        socketio.on_event('mm_new_game', self.send_world_data)

    def send_world_data(self):
        socketio.emit("get_world_data", {
            "world_data": self.world.get_world_as_json(),
            "component_data": self.world.get_components_as_json(),
            "player_id": current_user.username
            })

    def update(self):
        pass




class Server:
    def __init__(self):
        self.connection_list = {}
        self.static_game = Game()
        socketio.on_event('sync users', self.sync_users)

    def new_connection(self, user):
        connection = Connection(self.static_game, user)
        self.connection_list[str(user.username)] = connection

    def get_connection(self, username):
        return self.connection_list[str(username)]

    def sync_users(self, packet):
        if current_user.is_authenticated:
            print("SYNCING")
            self.new_connection(current_user)
            socketio.emit('initial_user_info', {
                'username': current_user.username, 
                'id':current_user.username})

    