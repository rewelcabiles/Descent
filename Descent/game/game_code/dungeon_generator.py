#!/usr/bin/env python
import random


class Division():
    def __init__(self, world):
        self.world = world

    def create_blank_map(self, max_x, max_y):
        temp_map = []
        self.grid = SquareGrid(max_x, max_y)
        for x in range(max_x):
            for y in range(max_y):
                temp_map.append((x, y, 0))
        return temp_map


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
            new_nodes = self.divide(node)
            current_rooms += 1
            for new_node in new_nodes:
                if len(new_node) > 24:
                    remain_stack.append(new_node)
            remain_stack.remove(node)
        for tiles in self.new_map:
            if tiles[2] == 1:
                self.grid.walls.append((tiles[0], tiles[1]))
            self.world.factory.create_tiles(tiles)
        self.world.set_grid(self.grid)

class SquareGrid:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.walls = []
        self.weights = {}
        
    def in_bounds(self, id):
        (x, y) = id
        return 0 <= x < self.width and 0 <= y < self.height
    
    def passable(self, id):
        return id not in self.walls
    
    def neighbors(self, id):
        (x, y) = id
        results = [(x+1, y), (x, y-1), (x-1, y), (x, y+1)]
        if (x + y) % 2 == 0: results.reverse() # aesthetics
        results = filter(self.in_bounds, results)
        results = filter(self.passable, results)
        return results

    def cost(self, from_node, to_node):
        return self.weights.get(to_node, 1)
    
        
