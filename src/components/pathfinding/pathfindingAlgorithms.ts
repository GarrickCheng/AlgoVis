export interface Node {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  g: number;
  h: number;
  f: number;
  previousNode: Node | null;
}

export function createNode(
  row: number,
  col: number,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Node {
  return {
    row, col,
    isWall: false,
    isStart: row === startRow && col === startCol,
    isEnd: row === endRow && col === endCol,
    isVisited: false,
    isPath: false,
    distance: Infinity,
    g: Infinity,
    h: 0,
    f: Infinity,
    previousNode: null,
  };
}

export function createGrid(
  rows: number,
  cols: number,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Node[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) =>
      createNode(r, c, startRow, startCol, endRow, endCol)
    )
  );
}

function getNeighbors(node: Node, grid: Node[][]): Node[] {
  const { row, col } = node;
  const rows = grid.length;
  const cols = grid[0].length;
  const neighbors: Node[] = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(n => !n.isWall);
}

function getPath(endNode: Node): Node[] {
  const path: Node[] = [];
  let current: Node | null = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
}

export function manhattan(a: Node, b: Node): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// ---- A* ----
export function astar(
  grid: Node[][],
  startNode: Node,
  endNode: Node
): { visited: Node[]; path: Node[] } {
  const visited: Node[] = [];
  const openSet: Node[] = [];

  startNode.g = 0;
  startNode.h = manhattan(startNode, endNode);
  startNode.f = startNode.h;
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f || a.h - b.h);
    const current = openSet.shift()!;

    if (current.isVisited) continue;
    if (current.isWall) continue;

    current.isVisited = true;
    visited.push(current);

    if (current === endNode) {
      return { visited, path: getPath(endNode) };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      if (neighbor.isVisited) continue;
      const tentativeG = current.g + 1;
      if (tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.h = manhattan(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previousNode = current;
        if (!openSet.includes(neighbor)) openSet.push(neighbor);
      }
    }
  }

  return { visited, path: [] };
}

// ---- Dijkstra ----
export function dijkstra(
  grid: Node[][],
  startNode: Node,
  endNode: Node
): { visited: Node[]; path: Node[] } {
  const visited: Node[] = [];
  const unvisited: Node[] = [];

  startNode.distance = 0;

  for (const row of grid) {
    for (const node of row) {
      unvisited.push(node);
    }
  }

  while (unvisited.length > 0) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const current = unvisited.shift()!;

    if (current.isWall) continue;
    if (current.distance === Infinity) break;

    current.isVisited = true;
    visited.push(current);

    if (current === endNode) {
      return { visited, path: getPath(endNode) };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      if (!neighbor.isVisited && current.distance + 1 < neighbor.distance) {
        neighbor.distance = current.distance + 1;
        neighbor.previousNode = current;
      }
    }
  }

  return { visited, path: [] };
}

// ---- BFS ----
export function bfs(
  grid: Node[][],
  startNode: Node,
  endNode: Node
): { visited: Node[]; path: Node[] } {
  const visited: Node[] = [];
  const queue: Node[] = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);

    if (current === endNode) {
      return { visited, path: getPath(endNode) };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = current;
        queue.push(neighbor);
      }
    }
  }

  return { visited, path: [] };
}

// ---- DFS ----
export function dfs(
  grid: Node[][],
  startNode: Node,
  endNode: Node
): { visited: Node[]; path: Node[] } {
  const visited: Node[] = [];
  const stack: Node[] = [startNode];

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current.isVisited || current.isWall) continue;
    current.isVisited = true;
    visited.push(current);

    if (current === endNode) {
      return { visited, path: getPath(endNode) };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      if (!neighbor.isVisited) {
        neighbor.previousNode = current;
        stack.push(neighbor);
      }
    }
  }

  return { visited, path: [] };
}

export interface PathAlgorithmInfo {
  name: string;
  key: string;
  guaranteesShortestPath: boolean;
  usesHeuristic: boolean;
  description: string;
  complexity: string;
  space: string;
  run: (grid: Node[][], start: Node, end: Node) => { visited: Node[]; path: Node[] };
}

export const PATH_ALGORITHMS: PathAlgorithmInfo[] = [
  {
    name: "A* Search",
    key: "astar",
    guaranteesShortestPath: true,
    usesHeuristic: true,
    description: "A* finds the shortest path by combining the actual cost from the start (g) with an estimated cost to the goal (h). It prioritizes nodes with the lowest f = g + h, making it both complete and optimal. The heuristic guides the search toward the goal, making A* significantly faster than uninformed algorithms on typical grids.",
    complexity: "O((V + E) log V)",
    space: "O(V)",
    run: astar,
  },
  {
    name: "Dijkstra's",
    key: "dijkstra",
    guaranteesShortestPath: true,
    usesHeuristic: false,
    description: "Dijkstra's algorithm explores nodes in order of their distance from the start, expanding outward in waves. It guarantees the shortest path in weighted graphs, but without a heuristic it explores more nodes than A*. On an unweighted grid, it behaves similarly to BFS but is the foundation for many real world routing algorithms.",
    complexity: "O((V + E) log V)",
    space: "O(V)",
    run: dijkstra,
  },
  {
    name: "Breadth-First Search",
    key: "bfs",
    guaranteesShortestPath: true,
    usesHeuristic: false,
    description: "BFS explores all nodes at the current depth before moving deeper, expanding level by level. On an unweighted grid, this guarantees the shortest path. It's simple, predictable, and forms the basis for many graph algorithms but it may explore a large number of nodes before reaching the goal.",
    complexity: "O(V + E)",
    space: "O(V)",
    run: bfs,
  },
  {
    name: "Depth-First Search",
    key: "dfs",
    guaranteesShortestPath: false,
    usesHeuristic: false,
    description: "DFS dives as deep as possible along each branch before backtracking. It uses minimal memory (a stack) and can find a path quickly but it does not guarantee the shortest one. Watch how it carves through the grid in a very different pattern than BFS. Great for maze generation and topological sorting.",
    complexity: "O(V + E)",
    space: "O(V)",
    run: dfs,
  },
];
