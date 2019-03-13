#!/usr/bin/env python
import random


class Division():
    def __init__(self, world):
        self.world = world

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
            self.world.factory.create_tiles(tiles)


