import heapq
class PriorityQueue:
	def __init__(self):
		self.elements = []
	
	def empty(self):
		return len(self.elements) == 0
	
	def put(self, item, priority):
		heapq.heappush(self.elements, (priority, item))
	
	def get(self):
		return heapq.heappop(self.elements)[1]

def heuristic(a, b):
	(x1, y1) = a
	(x2, y2) = b
	return abs(x1 - x2) + abs(y1 - y2)

def a_star_search(graph, start, goal):
	frontier = PriorityQueue()
	frontier.put(start, 0)
	came_from = {}
	cost_so_far = {}
	came_from[start] = None
	cost_so_far[start] = 0
	
	while not frontier.empty():
		current = frontier.get()
		
		if current == goal:
			break
		
		for next_node in graph.neighbors(current):
			new_cost = cost_so_far[current] + graph.cost(current, next_node)
			if next_node not in cost_so_far or new_cost < cost_so_far[next_node]:
				cost_so_far[next_node] = new_cost
				priority = new_cost + heuristic(goal, next_node)
				frontier.put(next_node, priority)
				came_from[next_node] = current
	current = goal
	path = []
	while current != start:
		path.append(current)
		current = came_from[current]
	path.append(start) # optional
	path.reverse() # optional
	return path

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