#!/usr/bin/env python
import random
import copy
import collections
import time
import _pickle as cPickle

rooms = [
    [
        [1, 1, 1, 1],
        [1, 2, 2, 1],
        [1, 2, 2, 1],
        [1, 1, 1, 1]
    ],
    [
        [1, 1, 1],
        [1, 2, 1],
        [1, 1, 1]
    ],
    [
        [1, 1, 1, 1],
        [1, 2, 1, 1],
        [1, 2, 2, 1],
        [1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1],
        [1, 2, 2, 1],
        [1, 1, 1, 1]
    ]
]


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
end = time.perf_counter()


class Dungeon():
    def __init__(self):
        self.id = None
        self.floors = []
        self.floor_num = 0


class Tile():
    def __init__(self, cell_name, room_id=0, value=0, weight=9999):
        self.room_id = room_id
        self.value = value
        self.weight = weight
        self.cell_name = cell_name


class Generator():
    def __init__(self):
        pass

    def create_map(self):
        print("===========================")
        print("== Using StackOF answer  ==")
        mapstart = time.perf_counter()
        current_map = self.create_floor()
        self.dijkstras_algorithm(current_map)
        mapend = time.perf_counter()
        print("V  ) Total Dungeon Creation Time Elapsed: "+str(mapend-mapstart))

    def create_floor(self):
        start = time.perf_counter()
        # Define Floor Parameters
        max_x, max_y = 48, 48
        rooms = []
        # Create Empty Floor Map
        current_map = [[0] * max_x for _ in range(max_y)]
        cell_name = 100

        for y in range(len(current_map)):
            for x in range(len(current_map[y])):
                current_map[y][x] = {
                    "room_id": 0,
                    "value": 0,
                    "weight": 0,
                    "cell_name": cell_name
                }
                cell_name += 1
        timer03 = []
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
                    stack = []
                    while len(index_used) < len(rotated_room_points):
                        start3 = time.perf_counter()
                        #buffer_map = copy.deepcopy(current_map)
                        #buffer_map = cPickle.loads(cPickle.dumps(current_map, -1))
                        buffer_map = [x[:] for x in current_map] # 
                        end3 = time.perf_counter()
                        timer03.append(end3 - start3)
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

        end = time.perf_counter()
        print("I  ) Time Elapsed for copying to buffer_map: " + str(sum(timer03)))
        print("II ) Time Elapsed for empty map algorithm: " + str(end - start))
        return current_map

    def dijkstras_algorithm(self, current_map):
        start = time.perf_counter()
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

        current = unvisited[random.choice(range(len(unvisited)))]
        shortest_distance = {name: 999999 for name in unvisited}
        shortest_distance[current] = 0
        path = {}
        visited = []
        while unvisited:
            min_node = None
            for node in unvisited:
                if min_node is None:
                    min_node = node
                elif shortest_distance[node] < shortest_distance[min_node]:
                    min_node = node

            if min_node is None:
                break
            unvisited.remove(min_node)
            visited.append(min_node)
            for neighbor in g.edges[min_node]:
                dist = shortest_distance[min_node] + g.weight[(min_node, neighbor)]
                if (shortest_distance[neighbor] is None or
                        dist < shortest_distance[neighbor]):
                    shortest_distance[neighbor] = dist
                    path[neighbor] = min_node
        end = time.perf_counter()
        print("IV ) Elapsed Time for Dijkstras Algorithm: " + str(end - start))
        for row in current_map:
            print(row)
        # print(visited)



class Graph:

    def __init__(self):
        self.edges = collections.defaultdict(list)
        self.weight = {}

    def add_edge(self, from_node, to_node):
        if to_node["room_id"] == from_node["room_id"]:
            weight = 0
        else:
            weight = to_node["weight"]

        self.edges[from_node["cell_name"]].append(to_node["cell_name"])
        self.edges[to_node["cell_name"]].append(from_node["cell_name"])
        self.weight[(from_node["cell_name"], to_node["cell_name"])] = weight
        self.weight[(to_node["cell_name"], from_node["cell_name"])] = weight


g = Generator()
g.create_map()
