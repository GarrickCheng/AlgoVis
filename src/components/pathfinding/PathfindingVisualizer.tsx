"use client";
import { useState, useEffect, useRef, useCallback, MouseEvent } from "react";
import { Play, Trash2, ZapOff, ChevronDown, Check, X, Clock, HardDrive, Wand2 } from "lucide-react";
import { Node, createGrid, PATH_ALGORITHMS } from "./pathfindingAlgorithms";
import { MazeType, MAZE_TYPES, getMazeWalls } from "./mazeGenerators";

const ROWS = 23;
const COLS = 51;
const START_ROW = 11;
const START_COL = 5;
const END_ROW = 11;
const END_COL = 45;

type MouseMode = 'wall' | 'erase' | 'moveStart' | 'moveEnd';

export default function PathfindingVisualizer() {
  const [algoIndex, setAlgoIndex] = useState(0);
  const [grid, setGrid] = useState<Node[][]>(() =>
    createGrid(ROWS, COLS, START_ROW, START_COL, END_ROW, END_COL)
  );
  const [startPos, setStartPos] = useState({ row: START_ROW, col: START_COL });
  const [endPos, setEndPos] = useState({ row: END_ROW, col: END_COL });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseMode, setMouseMode] = useState<MouseMode>('wall');
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [mazeType, setMazeType] = useState<MazeType>('recursive-division');
  const [lastMazeLabel, setLastMazeLabel] = useState<string | null>(null);
  const [stats, setStats] = useState({ visited: 0, pathLength: 0, timeMs: 0 });
  const animationTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const algo = PATH_ALGORITHMS[algoIndex];
  const busy = isRunning || isGenerating;

  const clearPath = useCallback(() => {
    animationTimeouts.current.forEach(t => clearTimeout(t));
    animationTimeouts.current = [];
    setIsRunning(false);
    setHasRun(false);
    setGrid(prev => prev.map(row => row.map(node => ({
      ...node,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      g: Infinity,
      h: 0,
      f: Infinity,
      previousNode: null,
    }))));
    setStats({ visited: 0, pathLength: 0, timeMs: 0 });
  }, []);

  const resetGrid = useCallback(() => {
    animationTimeouts.current.forEach(t => clearTimeout(t));
    animationTimeouts.current = [];
    setGrid(createGrid(ROWS, COLS, startPos.row, startPos.col, endPos.row, endPos.col));
    setHasRun(false);
    setIsRunning(false);
    setStats({ visited: 0, pathLength: 0, timeMs: 0 });
  }, [startPos, endPos]);

  const handleGenerate = useCallback(() => {
    animationTimeouts.current.forEach(t => clearTimeout(t));
    animationTimeouts.current = [];
    setIsRunning(false);
    setHasRun(false);
    setIsGenerating(true);
    setStats({ visited: 0, pathLength: 0, timeMs: 0 });

    const { walls, resolvedType } = getMazeWalls(
      mazeType, ROWS, COLS, startPos.row, startPos.col, endPos.row, endPos.col,
    );

    // Clear board instantly, then animate walls in
    const freshGrid = createGrid(ROWS, COLS, startPos.row, startPos.col, endPos.row, endPos.col);
    setGrid(freshGrid);

    const info = MAZE_TYPES.find(m => m.key === resolvedType);
    setLastMazeLabel(info ? info.label : null);

    // Batch walls together so animation is fast but visible (~800ms total)
    const BATCH = 4;
    const DELAY = 8; // ms per batch
    const numBatches = Math.ceil(walls.length / BATCH);

    for (let b = 0; b < numBatches; b++) {
      const batch = walls.slice(b * BATCH, (b + 1) * BATCH);
      const t = setTimeout(() => {
        setGrid(prev => {
          const next = prev.map(r => [...r]);
          batch.forEach(([r, c]) => {
            if (next[r]?.[c]) next[r][c] = { ...next[r][c], isWall: true };
          });
          return next;
        });
      }, b * DELAY);
      animationTimeouts.current.push(t);
    }

    const done = setTimeout(() => setIsGenerating(false), numBatches * DELAY + 50);
    animationTimeouts.current.push(done);
  }, [mazeType, startPos, endPos]);

  const handleMouseDown = useCallback((row: number, col: number, e: MouseEvent) => {
    e.preventDefault();
    setIsMouseDown(true);
    const node = grid[row][col];

    if (node.isStart) {
      setMouseMode('moveStart');
    } else if (node.isEnd) {
      setMouseMode('moveEnd');
    } else if (e.button === 2 || node.isWall) {
      setMouseMode('erase');
      setGrid(prev => {
        const newGrid = prev.map(r => [...r]);
        newGrid[row][col] = { ...newGrid[row][col], isWall: false };
        return newGrid;
      });
    } else {
      setMouseMode('wall');
      setGrid(prev => {
        const newGrid = prev.map(r => [...r]);
        newGrid[row][col] = { ...newGrid[row][col], isWall: true };
        return newGrid;
      });
    }
  }, [grid]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (!isMouseDown) return;

    if (mouseMode === 'moveStart') {
      setStartPos({ row, col });
      setGrid(prev => prev.map((r, ri) => r.map((node, ci) => ({
        ...node,
        isStart: ri === row && ci === col,
        isWall: (ri === row && ci === col) ? false : node.isWall,
      }))));
    } else if (mouseMode === 'moveEnd') {
      setEndPos({ row, col });
      setGrid(prev => prev.map((r, ri) => r.map((node, ci) => ({
        ...node,
        isEnd: ri === row && ci === col,
        isWall: (ri === row && ci === col) ? false : node.isWall,
      }))));
    } else if (mouseMode === 'wall') {
      setGrid(prev => {
        const newGrid = prev.map(r => [...r]);
        if (!newGrid[row][col].isStart && !newGrid[row][col].isEnd) {
          newGrid[row][col] = { ...newGrid[row][col], isWall: true };
        }
        return newGrid;
      });
    } else if (mouseMode === 'erase') {
      setGrid(prev => {
        const newGrid = prev.map(r => [...r]);
        newGrid[row][col] = { ...newGrid[row][col], isWall: false };
        return newGrid;
      });
    }
  }, [isMouseDown, mouseMode]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const visualize = useCallback(() => {
    if (isRunning) return;

    // Clear previous path visuals but preserve walls
    animationTimeouts.current.forEach(t => clearTimeout(t));
    animationTimeouts.current = [];

    // Fresh grid preserving walls and positions
    const freshGrid = grid.map(row => row.map(node => ({
      ...node,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      g: Infinity,
      h: 0,
      f: Infinity,
      previousNode: null,
    })));

    // Reset start/end positions in case they were moved
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        freshGrid[r][c].isStart = r === startPos.row && c === startPos.col;
        freshGrid[r][c].isEnd = r === endPos.row && c === endPos.col;
      }
    }

    const startNode = freshGrid[startPos.row][startPos.col];
    const endNode = freshGrid[endPos.row][endPos.col];

    const t0 = performance.now();
    const { visited, path } = algo.run(freshGrid, startNode, endNode);
    const t1 = performance.now();

    setStats({ visited: visited.length, pathLength: path.length, timeMs: Math.round(t1 - t0) });
    setIsRunning(true);
    setHasRun(true);

    // Apply fresh grid state first
    setGrid(freshGrid);

    const baseDelay = Math.max(3, 80 / speed);

    // Animate visited nodes
    visited.forEach((node, i) => {
      if (node.isStart || node.isEnd) return;
      const t = setTimeout(() => {
        setGrid(prev => {
          const newGrid = prev.map(r => [...r]);
          newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isVisited: true };
          return newGrid;
        });
      }, i * baseDelay);
      animationTimeouts.current.push(t);
    });

    // Animate path
    path.forEach((node, i) => {
      if (node.isStart || node.isEnd) return;
      const t = setTimeout(() => {
        setGrid(prev => {
          const newGrid = prev.map(r => [...r]);
          newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isPath: true };
          return newGrid;
        });
      }, visited.length * baseDelay + i * (baseDelay * 2));
      animationTimeouts.current.push(t);
    });

    const doneT = setTimeout(() => {
      setIsRunning(false);
    }, visited.length * baseDelay + path.length * baseDelay * 2 + 100);
    animationTimeouts.current.push(doneT);
  }, [grid, startPos, endPos, algo, isRunning, speed]);

  useEffect(() => {
    return () => {
      animationTimeouts.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const getCellBg = (node: Node): string => {
    if (node.isStart) return '#10b981';
    if (node.isEnd) return '#ef4444';
    if (node.isWall) return '#374151';
    if (node.isPath) return '#f59e0b';
    if (node.isVisited) return '#1e1e6a';
    return '#0d0d2b';
  };

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">
            Pathfinding <span className="gradient-text-purple">Algorithms</span>
          </h1>
          <p className="text-slate-500 text-sm">Click to draw walls. Drag the green/red nodes to move start/end. Hit Visualize.</p>
        </div>

        {/* Controls */}
        <div className="glass rounded-xl p-4 mb-4 flex flex-wrap items-center gap-4">
          {/* Algorithm */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Algorithm</label>
            <div className="relative">
              <select
                className="appearance-none bg-[#0d0d2b] border border-[#1e1e4a] text-white rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                value={algoIndex}
                onChange={e => { setAlgoIndex(Number(e.target.value)); if (hasRun) clearPath(); }}
                disabled={busy}
              >
                {PATH_ALGORITHMS.map((a, i) => (
                  <option key={a.key} value={i}>{a.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Speed */}
          <div className="flex flex-col gap-1 min-w-[120px]">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Speed: {speed}</label>
            <input
              type="range" min={1} max={10} value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="accent-purple-400 cursor-pointer"
              disabled={isRunning}
            />
          </div>

          {/* Maze generator */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 uppercase tracking-wider">
              Maze{lastMazeLabel && !isGenerating ? <span className="ml-1.5 text-slate-600 normal-case font-normal">— {lastMazeLabel}</span> : null}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="appearance-none bg-[#0d0d2b] border border-[#1e1e4a] text-white rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
                  value={mazeType}
                  onChange={e => setMazeType(e.target.value as MazeType)}
                  disabled={busy}
                >
                  {MAZE_TYPES.map(m => (
                    <option key={m.key} value={m.key}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button
                onClick={handleGenerate}
                disabled={busy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Wand2 size={14} className={isGenerating ? 'animate-spin' : ''} />
                {isGenerating ? 'Building…' : 'Generate'}
              </button>
            </div>
          </div>

          {/* Stats */}
          {hasRun && (
            <div className="flex gap-3 text-sm">
              <div className="bg-[#0d0d2b] rounded-lg px-3 py-1.5 border border-[#1e1e4a]">
                <span className="text-slate-500">Visited: </span>
                <span className="text-purple-400 font-mono font-medium">{stats.visited}</span>
              </div>
              <div className="bg-[#0d0d2b] rounded-lg px-3 py-1.5 border border-[#1e1e4a]">
                <span className="text-slate-500">Path: </span>
                <span className="text-amber-400 font-mono font-medium">{stats.pathLength > 0 ? stats.pathLength : 'None'}</span>
              </div>
              <div className="bg-[#0d0d2b] rounded-lg px-3 py-1.5 border border-[#1e1e4a]">
                <span className="text-slate-500">Time: </span>
                <span className="text-cyan-400 font-mono font-medium">{stats.timeMs}ms</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-end gap-2 ml-auto">
            <button
              onClick={clearPath}
              disabled={busy || !hasRun}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e4a] hover:border-slate-500 text-slate-400 hover:text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ZapOff size={14} /> Clear Path
            </button>
            <button
              onClick={resetGrid}
              disabled={busy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e4a] hover:border-slate-500 text-slate-400 hover:text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} /> Clear Board
            </button>
            <button
              onClick={visualize}
              disabled={busy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play size={14} /> Visualize
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-3 px-1">
          {[
            { color: '#10b981', label: 'Start' },
            { color: '#ef4444', label: 'End' },
            { color: '#374151', label: 'Wall' },
            { color: '#1e1e6a', label: 'Visited' },
            { color: '#f59e0b', label: 'Shortest Path' },
            { color: '#0d0d2b', label: 'Unvisited' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-3 h-3 rounded-sm border border-white/10" style={{ backgroundColor: color }} />
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          className="glass rounded-xl p-3 mb-4 overflow-auto select-none cursor-crosshair"
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
          onContextMenu={e => e.preventDefault()}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gap: '1px',
              backgroundColor: '#0f0f2a',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            {grid.map((row, ri) =>
              row.map((node, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  style={{
                    backgroundColor: getCellBg(node),
                    aspectRatio: '1',
                    transition: 'background-color 0.1s ease',
                    cursor: node.isStart || node.isEnd ? 'grab' : 'crosshair',
                  }}
                  onMouseDown={e => handleMouseDown(ri, ci, e)}
                  onMouseEnter={() => handleMouseEnter(ri, ci)}
                />
              ))
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 px-1">
          Left-click &amp; drag to draw walls · Right-click walls to erase · Drag green/red nodes to move start/end · Use <span className="text-amber-600">Generate</span> to auto-build a maze
        </p>

        {/* Algorithm Info */}
        <div className="glass rounded-xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">{algo.name}</h2>
                <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                  algo.guaranteesShortestPath
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {algo.guaranteesShortestPath ? <Check size={10} /> : <X size={10} />}
                  {algo.guaranteesShortestPath ? 'Shortest path' : 'No guarantee'}
                </div>
                {algo.usesHeuristic && (
                  <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    ✦ Heuristic
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{algo.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm min-w-[180px]">
              <div className="bg-[#0d0d2b] rounded-lg p-2.5 flex items-center gap-2">
                <Clock size={14} className="text-purple-400" />
                <div>
                  <div className="text-xs text-slate-500">Time</div>
                  <div className="text-white font-mono font-medium text-xs">{algo.complexity}</div>
                </div>
              </div>
              <div className="bg-[#0d0d2b] rounded-lg p-2.5 flex items-center gap-2">
                <HardDrive size={14} className="text-purple-400" />
                <div>
                  <div className="text-xs text-slate-500">Space</div>
                  <div className="text-white font-mono font-medium">{algo.space}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
