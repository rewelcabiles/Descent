from Descent.game.game_code import world, dungeon_generator, systems
from Descent import socketio
from flask_login import current_user


class Game:
    def __init__(self):
        self.world = world.World()
        self.message_board = systems.MessageBoard()
        self.systems = systems.Systems(self.world, self.message_board)
        self.generator  = dungeon_generator.Division(self.world)
        self.generator.division()
        socketio.on_event('connect_world', self.send_world_data)
        socketio.on_event("client_event", self.receive_events)        

    def remove_player(self, username):
        self.world.remove_player(username)

    def add_new_player(self, username):
        self.world.add_new_player(username, self.systems.add_player())

    def send_world_data(self):
        socketio.emit("get_world_data", {
            "world_data": self.world.get_world_as_json(),
            "component_data": self.world.get_components_as_json(),
            "player_id": current_user.username
            })

    def receive_events(self, data):
        data["sent_by"] = current_user.username
        self.message_board.add_to_queue(data)




class Server:
    def __init__(self):
        self.static_game = Game()
        socketio.on_event('connected', self.sync_users)
        socketio.on_event('disconnect', self.remove_connection)

    def remove_connection(self):
        self.static_game.remove_player(current_user.username)

    def new_connection(self):
        self.static_game.add_new_player(current_user.username)

    def sync_users(self):
        if current_user.is_authenticated:
            self.new_connection()
            socketio.emit('initial_user_info', {
                'username': current_user.username, 
                'id':current_user.username})
