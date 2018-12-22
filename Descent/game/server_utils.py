
class User:
    def __init__(self, user=None):
        self.user = user


class Server:
    def __init__(self):
        self.connection_list = []

    def new_connection(self, user):
        new_user = User(user)
        self.connection_list.append(new_user)
