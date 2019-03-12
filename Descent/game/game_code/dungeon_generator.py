#!/usr/bin/env python
import random
import copy
import collections
import time
import _pickle as cPickle
import Descent.game.game_code.factory as factory

rooms = [
    [
        [1, 1, 3, 1, 1],
        [1, 2, 2, 2, 1],
        [3, 2, 2, 2, 3],
        [1, 2, 2, 2, 1],
        [1, 1, 3, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1],
        [1, 2, 2, 2, 1],
        [1, 2, 2, 2, 1],
        [1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1],
        [1, 2, 2, 1],
        [1, 2, 2, 1],
        [1, 1, 1, 1]
    ]
]

class Division():
    def __init__(self, world):
        self.world = world
        self.factory = factory.Factory()


    def create_blank_map(self, max_x, max_y):
        temp_map = []
        for x in range(max_x):
            for y in range(max_y):
                temp_map.append((x, y, 0))
        return temp_map

    def add_perimiter(self, map_):
        max_x = [x for x, y, v in map_]
        max_x.sort()
        max_y = [y for x, y, v in map_]
        max_y.sort()
        for x, y, v in map_:
            if y == 0:
                map_[map_.index((x, y, v))] = (x, y, 1)
            elif x == 0:
                map_[map_.index((x, y, v))] = (x, y, 1)
            elif x == max_x[-1]:
                map_[map_.index((x, y, v))] = (x, y, 1)                

            elif y == max_y[-1]:
                map_[map_.index((x, y, v))] = (x, y, 1)
        return map_

    def divide(self, map_points):
        sub1 = []
        sub2 = []
        x_size = [x for x, y, v in map_points]
        x_size.sort()
        y_size = [y for x, y, v in map_points]
        y_size.sort()

        if y_size[-1] - y_size[0] < x_size[-1] - x_size[0]:
            rand_x = int((x_size[0] + x_size[-1]) / 2) #+ random.choice([-2, -1, 0, 1, 2])
            rand_y = random.choice(y_size)
            for x, y, v in map_points:
                if x > rand_x:
                    sub1.append((x,y,v))
                if x < rand_x:
                    sub2.append((x,y,v))
                if x == rand_x:
                    self.new_map[self.new_map.index((x, y, v))] = (x, y, 1)
            self.new_map[self.new_map.index((rand_x, rand_y, 1))] = (rand_x, rand_y, 3)
        else:
            rand_x = random.choice(x_size)
            rand_y = int((y_size[0] + y_size[-1]) / 2) #+ random.choice([-2, -1, 0, 1, 2])
            for x, y, v in map_points:
                if y > rand_y:
                    sub1.append((x,y,v))
                if y < rand_y:
                    sub2.append((x,y,v))
                if y == rand_y:
                    self.new_map[self.new_map.index((x, y, v))] = (x, y, 1)
            self.new_map[self.new_map.index((rand_x, rand_y, 1))] = (rand_x, rand_y, 3)
        return [sub1, sub2]

    def division(self):
        rooms_needed = 14
        current_rooms = 0
        self.new_map = self.create_blank_map(28, 24)
        remain_stack = [self.new_map]
        node = random.choice(remain_stack)
        while current_rooms < rooms_needed:
            node = random.choice(remain_stack)
            #node = remain_stack[0]
            new_nodes = self.divide(node)
            current_rooms += 1
            for new_node in new_nodes:
                if len(new_node) > 24:
                    remain_stack.append(new_node)
            remain_stack.remove(node)
        for tiles in self.new_map:
            self.factory.create_tiles_2(self.world, tiles)


def rotate_matrix_clockwise(original):
    new = list(zip(*original[::-1]))
    return new

rotated_room_points = []
for room in rooms:
    i = 0
    while i < 3:
        room_points = []
        for y in range(len(room)):
            for x in range(len(room[y])):
                room_points.append((x, y, room[y][x]))
        rotated_room_points.append(room_points)
        room = rotate_matrix_clockwise(room)
        i += 1


class Generator():
    def __init__(self, world):
        self.world = world
        self.factory = factory.Factory()

    def create_map(self):
        mapstart = time.perf_counter()
        current_map = self.create_floor()
        current_map = self.dijkstras_algorithm(current_map)

        for y in range(len(current_map)):
            for x in range(len(current_map[y])):
                self.factory.create_tiles(self.world, current_map[y][x], x, y)
        
        

    def create_floor(self):
        max_x, max_y = 32, 19
        current_map = [[0] * max_x for _ in range(max_y)]

        cell_name = 100
        for y in range(len(current_map)):
            for x in range(len(current_map[y])):
                current_map[y][x] = {
                    "room_id": 0,
                    "value": 0,
                    "weight": 999999,
                    "cell_name": cell_name
                }
                cell_name += 1

        rooms = []
        for m_x in range(max_x):
            for m_y in range(max_y):
                if current_map[m_y][m_x]["value"] == 0:
                    while True:
                        # r_id = Id of the room
                        r_id = random.randint(100, 999)
                        if r_id not in rooms:
                            rooms.append(r_id)
                            break

                    index_used = []
                    while len(index_used) < len(rotated_room_points):
                        buffer_map = [x[:] for x in current_map] # 
                        while True:
                            index = random.choice(range(len(rotated_room_points)))
                            if index not in index_used:
                                current_room = rotated_room_points[index]
                                index_used.append(index)
                                break

                        valid_room = True
                        for x, y, value in current_room:
                            if not m_x + x >= max_x and not m_y + y >= max_y:
                                if buffer_map[m_y + y][m_x + x]['value'] == 0:
                                    buffer_map[m_y + y][m_x + x]["room_id"] = r_id
                                    buffer_map[m_y + y][m_x + x]["value"] = value
                                    if value == 1:
                                        buffer_map[m_y + y][m_x + x]["weight"] = r_id+900
                                    else:
                                        buffer_map[m_y + y][m_x + x]["weight"] = r_id
                                else:
                                    valid_room = False
                                    break
                            else:
                                valid_room = False
                                break
                        if valid_room:
                            current_map = new_map = [x[:] for x in buffer_map]
                            break

        return current_map

    def dijkstras_algorithm(self, current_map):
        g = Graph()
        unvisited = []
        cell_dict = {}
        for y in range(len(current_map)):
            for x in range(len(current_map[y])):
                item = current_map[y][x]
                unvisited.append(item["cell_name"])
                cell_dict[item["cell_name"]] = item
                # Up
                if y != 0:
                    neighbor = current_map[y - 1][x]
                    g.add_edge(item, neighbor)
                # Right
                if x != len(current_map[y]) - 1:
                    neighbor = current_map[y][x + 1]
                    g.add_edge(item, neighbor)
                # Down
                if y != len(current_map) - 1:
                    neighbor = current_map[y + 1][x]
                    g.add_edge(item, neighbor)
                # Left
                if x != 0:
                    neighbor = current_map[y][x - 1]
                    g.add_edge(item, neighbor)

        while True:
            current = unvisited[random.choice(range(len(unvisited)))]
            if cell_dict[current]["value"] == 2:
                break

        shortest_distance = {name: 999999 for name in unvisited}
        shortest_distance[current] = 0
        path = {}
        visited = []
        vist = []
        while unvisited:
            min_node = None
            for node in unvisited:
                if min_node is None:
                    min_node = node
                elif shortest_distance[node] < shortest_distance[min_node]:
                    min_node = node
            for neighbor in g.edges[min_node]:
                dist = shortest_distance[min_node] + g.weight[(min_node, neighbor)]
                if (shortest_distance[neighbor] is None or
                        dist < shortest_distance[neighbor]):
                    shortest_distance[neighbor] = dist
                    path[neighbor] = min_node
                    vist.append(min_node)
            unvisited.remove(min_node)

        start = 0
        goal = 0
        
        while (start - goal) * 1 < 20:
            start= random.randint(0, len(vist))
            


        while True:
            goal = random.randint(20, len(vist))
            goal = vist[goal]
            if cell_dict[vist[goal]]["value"] == 2:
                break
        while True:
            start = random.randint(20, len(vist))
            start = vist[start]
            if cell_dict[vist[start]]["value"] == 2:
                break
        

        while goal != start:
            try:
                visited.insert(0, goal)
                goal = path[goal]
            except KeyError:
                print("Path Not Found")
                break

        print(visited)
            
            
        for nodes in visited:
            pass
            cell_dict[nodes]["value"] = 100
            #print(cell_dict[nodes]["room_id"])

        return current_map


class Graph:

    def __init__(self):
        self.edges = collections.defaultdict(list)
        self.weight = {}

    def add_edge(self, from_node, to_node):
        
        weight = to_node["weight"]

        self.edges[from_node["cell_name"]].append(to_node["cell_name"])
        self.edges[to_node["cell_name"]].append(from_node["cell_name"])
        self.weight[(from_node["cell_name"], to_node["cell_name"])] = weight
        self.weight[(to_node["cell_name"], from_node["cell_name"])] = weight


# g = Generator()
# g.create_map()
