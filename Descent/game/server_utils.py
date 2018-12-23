

class User:
    def __init__(self, user=None):
        self.user = user


class State:
    def __init__(self, name):
        self.name = name

    def update(self):
        pass


class StateList:
    def __init__(self):
        self.state_list=[]

    def pop(self):
        return self.state_list.pop()

    def push(self, state):
        self.state_list.append(state)

    def top(self):
        return self.state_list[-1]


class Game:
    def __init__(self):
        self.State


class Server:
    def __init__(self):
        self.connection_list = []

    def new_connection(self, user):
        new_user = User(user)
        self.connection_list.append(new_user)
