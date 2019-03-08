from Descent.game.game_code import world, dungeon_generator
import time

class Connection:
    def __init__(self, game, user=None):
        self.user = user
        self.game = game


class Game:
    def __init__(self):
        self.world = world.World()
        self.generator  = dungeon_generator.Generator(self.world)
        self.generator.create_map()

    def send_initial_data(self):
        pass

    def update(self):
        pass


class Server:
    def __init__(self):
        self.connection_list = {}

    def new_connection(self, user):
        connection = Connection(Game(), user)
        self.connection_list[str(user.user_id)] = connection

    def get_connection(self, user_id):
        return self.connection_list[str(user_id)]