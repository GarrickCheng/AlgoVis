export type MazeType = 'recursive-division' | 'scatter' | 'snake';

export interface MazeInfo {
  key: MazeType;
  label: string;
  icon: string;
  description: string;
}

export const MAZE_TYPES: MazeInfo[] = [
  {
    key: 'recursive-division',
    label: 'Recursive Division',
    icon: '',
    description: 'Carves winding corridors via randomized DFS. Every cell is reachable — path always guaranteed.',
  },
  {
    key: 'scatter',
    label: 'Random Scatter',
    icon: '',
    description: 'Randomly places walls inside a sealed border. Retries until a path is guaranteed.',
  },
  {
    key: 'snake',
    label: 'Snake',
    icon: '',
    description: 'Full-height vertical walls alternate hanging from the top and rising from the bottom, forcing a zigzag path.',
  },
];

// Interior-only safe check — no border cells, 1-cell buffer around start/end.
function isSafe(
  r: number, c: number,
  rows: number, cols: number,
  sRow: number, sCol: number,
  eRow: number, eCol: number,
): boolean {
  if (r <= 0 || r >= rows - 1 || c <= 0 || c >= cols - 1) return false;
  if (Math.abs(r - sRow) <= 1 && Math.abs(c - sCol) <= 1) return false;
  if (Math.abs(r - eRow) <= 1 && Math.abs(c - eCol) <= 1) return false;
  return true;
}

// Edge-inclusive safe check — border cells allowed, still clears buffer around start/end.
function edgeSafe(
  r: number, c: number,
  rows: number, cols: number,
  sRow: number, sCol: number,
  eRow: number, eCol: number,
): boolean {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
  if (Math.abs(r - sRow) <= 1 && Math.abs(c - sCol) <= 1) return false;
  if (Math.abs(r - eRow) <= 1 && Math.abs(c - eCol) <= 1) return false;
  return true;
}

// Full outer border. Call first so the frame animates before the interior fills in.
function addBorder(
  walls: [number, number][],
  rows: number, cols: number,
  sRow: number, sCol: number,
  eRow: number, eCol: number,
) {
  for (let c = 0; c < cols; c++) {
    if (edgeSafe(0,        c, rows, cols, sRow, sCol, eRow, eCol)) walls.push([0, c]);
    if (edgeSafe(rows - 1, c, rows, cols, sRow, sCol, eRow, eCol)) walls.push([rows - 1, c]);
  }
  for (let r = 1; r < rows - 1; r++) {
    if (edgeSafe(r, 0,        rows, cols, sRow, sCol, eRow, eCol)) walls.push([r, 0]);
    if (edgeSafe(r, cols - 1, rows, cols, sRow, sCol, eRow, eCol)) walls.push([r, cols - 1]);
  }
}

// BFS connectivity check. wallSet must include ALL walls (border + interior).
function hasPath(
  wallSet: Set<string>,
  rows: number, cols: number,
  sRow: number, sCol: number,
  eRow: number, eCol: number,
): boolean {
  const visited = new Set<string>();
  const queue: [number, number][] = [[sRow, sCol]];
  visited.add(`${sRow},${sCol}`);
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === eRow && c === eCol) return true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      const key = `${nr},${nc}`;
      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        !visited.has(key) &&
        !wallSet.has(key)
      ) {
        visited.add(key);
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}

// ---- Perfect Maze (Randomized DFS / Recursive Backtracking) ----
// Works on a "room grid": cells at (odd row, odd col) are rooms; cells between
// them are passages. DFS carves corridors by visiting every room exactly once,
// forming a spanning tree — so EVERY pair of rooms has exactly one path.
// Connectivity is mathematically guaranteed; no isSafe gap-punching can break it.
function generateRecursiveDivision(
  rows: number, cols: number,
  sRow: number, sCol: number,
  eRow: number, eCol: number,
): [number, number][] {
  const open = new Set<string>(); // cells that are corridors (not walls)
  const visited = new Set<string>();

  function carve(r: number, c: number) {
    visited.add(`${r},${c}`);
    open.add(`${r},${c}`);

    // Directions in 2-cell steps to reach the next room
    const dirs: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]];
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 1 && nr <= rows - 2 &&
        nc >= 1 && nc <= cols - 2 &&
        !visited.has(`${nr},${nc}`)
      ) {
        open.add(`${(r + nr) / 2},${(c + nc) / 2}`); // carve the wall between rooms
        carve(nr, nc);
      }
    }
  }

  // Snap the start position to the nearest odd-row, odd-col room cell
  const r0 = sRow % 2 === 0 ? Math.min(sRow + 1, rows - 2) : sRow;
  const c0 = sCol % 2 === 0 ? Math.min(sCol + 1, cols - 2) : sCol;
  carve(r0, c0);

  // Build walls: border first, then all non-open interior cells (shuffled for animation)
  const borderWalls: [number, number][] = [];
  addBorder(borderWalls, rows, cols, sRow, sCol, eRow, eCol);

  const interior: [number, number][] = [];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (!open.has(`${r},${c}`)) interior.push([r, c]);
    }
  }
  // Shuffle so walls animate in randomly rather than row-by-row
  for (let i = interior.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [interior[i], interior[j]] = [interior[j], interior[i]];
  }

  return [...borderWalls, ...interior];
}

// ---- Random Scatter ----
// Border first, then ~30% random interior walls.
// Retries up to 10x; the path check uses the full wall set (border + interior).
function generateScatter(
  rows: number, cols: number,
  sRow: number, sCol: number,
  eRow: number, eCol: number,
): [number, number][] {
  // Pre-build the border walls array once (reused in every attempt).
  const borderWalls: [number, number][] = [];
  addBorder(borderWalls, rows, cols, sRow, sCol, eRow, eCol);
  const borderSet = new Set(borderWalls.map(([r, c]) => `${r},${c}`));

  for (let attempt = 0; attempt < 10; attempt++) {
    const interior: [number, number][] = [];

    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (Math.random() < 0.30 && isSafe(r, c, rows, cols, sRow, sCol, eRow, eCol)) {
          interior.push([r, c]);
        }
      }
    }

    // Shuffle so walls appear randomly across the grid rather than left-to-right
    for (let i = interior.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [interior[i], interior[j]] = [interior[j], interior[i]];
    }

    // Connectivity check must account for the border walls too
    const combined = new Set([...borderSet, ...interior.map(([r, c]) => `${r},${c}`)]);
    if (hasPath(combined, rows, cols, sRow, sCol, eRow, eCol)) {
      return [...borderWalls, ...interior];
    }
  }

  return [...borderWalls]; // fallback: sealed border, no interior walls
}

// ---- Snake ----
// Border first, then alternating full-height vertical walls hanging from the top or
// rising from the bottom. The gaps at each end force a zigzag path.
function generateSnake(
  rows: number, cols: number,
  sRow: number, sCol: number,
  eRow: number, eCol: number,
): [number, number][] {
  const walls: [number, number][] = [];
  // wallH is how many rows each vertical wall spans (measured from the sealing edge)
  const wallH = Math.floor((rows - 2) * 0.70);

  const safe = (r: number, c: number) =>
    edgeSafe(r, c, rows, cols, sRow, sCol, eRow, eCol);

  addBorder(walls, rows, cols, sRow, sCol, eRow, eCol);

  // Interior vertical wall cells (rows 1..wallH or rows-2..rows-1-wallH)
  let fromTop = true;
  for (let c = sCol + 3; c <= eCol - 3; c += 4) {
    if (fromTop) {
      for (let r = 1; r <= wallH; r++) {
        if (safe(r, c)) walls.push([r, c]);
      }
    } else {
      for (let r = rows - 2; r >= rows - 1 - wallH; r--) {
        if (safe(r, c)) walls.push([r, c]);
      }
    }
    fromTop = !fromTop;
  }

  return walls;
}

export function getMazeWalls(
  type: MazeType,
  rows: number, cols: number,
  sRow: number, sCol: number,
  eRow: number, eCol: number,
): { walls: [number, number][]; resolvedType: MazeType } {
  let walls: [number, number][] = [];

  switch (type) {
    case 'recursive-division':
      walls = generateRecursiveDivision(rows, cols, sRow, sCol, eRow, eCol);
      break;
    case 'scatter':
      walls = generateScatter(rows, cols, sRow, sCol, eRow, eCol);
      break;
    case 'snake':
      walls = generateSnake(rows, cols, sRow, sCol, eRow, eCol);
      break;
  }

  return { walls, resolvedType: type };
}
