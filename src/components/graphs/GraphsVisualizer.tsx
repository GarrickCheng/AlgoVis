"use client";
import { useRef, useEffect, useCallback, useState } from "react";
import { Play, Pause, RotateCcw, Search, Plus, Trash2, Shuffle, X, ChevronDown } from "lucide-react";

// ════════════════════════════════════════════════════════════════════════════
// BST
// ════════════════════════════════════════════════════════════════════════════

interface BSTNode { val: number; left: BSTNode | null; right: BSTNode | null; id: number }
let _uid = 0;
const mk = (v: number): BSTNode => ({ val: v, left: null, right: null, id: _uid++ });

function bstInsert(root: BSTNode | null, v: number): { root: BSTNode; path: number[] } {
  const path: number[] = [];
  function ins(n: BSTNode | null): BSTNode {
    if (!n) return mk(v);
    path.push(n.id);
    if (v < n.val) return { ...n, left: ins(n.left) };
    if (v > n.val) return { ...n, right: ins(n.right) };
    return n;
  }
  return { root: ins(root)!, path };
}

function bstSearch(root: BSTNode | null, v: number): { found: boolean; path: number[] } {
  const path: number[] = [];
  let n = root;
  while (n) {
    path.push(n.id);
    if (v === n.val) return { found: true, path };
    n = v < n.val ? n.left : n.right;
  }
  return { found: false, path };
}

function bstDeleteNode(root: BSTNode | null, v: number): { root: BSTNode | null; path: number[] } {
  const path: number[] = [];
  function del(n: BSTNode | null): BSTNode | null {
    if (!n) return null;
    path.push(n.id);
    if (v < n.val) return { ...n, left: del(n.left) };
    if (v > n.val) return { ...n, right: del(n.right) };
    if (!n.left) return n.right;
    if (!n.right) return n.left;
    let s = n.right; while (s.left) s = s.left;
    return { ...n, val: s.val, right: del(n.right) };
  }
  return { root: del(root), path };
}

function bstDepth(n: BSTNode | null): number {
  if (!n) return 0;
  return 1 + Math.max(bstDepth(n.left), bstDepth(n.right));
}

function collectNodes(n: BSTNode | null): BSTNode[] {
  if (!n) return [];
  return [n, ...collectNodes(n.left), ...collectNodes(n.right)];
}

function collectEdges(n: BSTNode | null): [number, number][] {
  if (!n) return [];
  const e: [number, number][] = [];
  if (n.left)  { e.push([n.id, n.left.id]);  e.push(...collectEdges(n.left)); }
  if (n.right) { e.push([n.id, n.right.id]); e.push(...collectEdges(n.right)); }
  return e;
}

function calcPos(n: BSTNode | null, d: number, l: number, r: number, m: Map<number, { x: number; y: number }>) {
  if (!n) return;
  m.set(n.id, { x: (l + r) / 2, y: d });
  calcPos(n.left,  d + 1, l, (l + r) / 2, m);
  calcPos(n.right, d + 1, (l + r) / 2, r, m);
}

// ════════════════════════════════════════════════════════════════════════════
// Graph
// ════════════════════════════════════════════════════════════════════════════

type NId = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J';
const NIDS: NId[] = ['A','B','C','D','E','F','G','H','I','J'];

const GNODES: Record<NId, { x: number; y: number }> = {
  A: { x: 0.50, y: 0.10 }, B: { x: 0.22, y: 0.32 }, C: { x: 0.78, y: 0.32 },
  D: { x: 0.06, y: 0.58 }, E: { x: 0.38, y: 0.58 }, F: { x: 0.62, y: 0.58 },
  G: { x: 0.94, y: 0.58 }, H: { x: 0.22, y: 0.84 }, I: { x: 0.50, y: 0.84 },
  J: { x: 0.78, y: 0.84 },
};

const GEDGES: { from: NId; to: NId; w: number }[] = [
  { from:'A', to:'B', w:4 }, { from:'A', to:'C', w:3 },
  { from:'B', to:'D', w:5 }, { from:'B', to:'E', w:2 },
  { from:'C', to:'F', w:6 }, { from:'C', to:'G', w:1 },
  { from:'D', to:'E', w:2 }, { from:'D', to:'H', w:3 },
  { from:'E', to:'H', w:4 }, { from:'E', to:'I', w:7 },
  { from:'F', to:'I', w:2 }, { from:'F', to:'J', w:5 },
  { from:'G', to:'J', w:8 }, { from:'H', to:'I', w:6 },
  { from:'I', to:'J', w:3 },
];

const ADJ = (() => {
  const m = new Map<NId, { to: NId; w: number }[]>();
  for (const n of NIDS) m.set(n, []);
  for (const { from, to, w } of GEDGES) { m.get(from)!.push({ to, w }); m.get(to)!.push({ to: from, w }); }
  return m;
})();

interface GFrame {
  visited: NId[]; frontier: NId[]; current: NId | null;
  activeEdges: [NId, NId][]; dists?: Partial<Record<NId, number>>; msg: string;
}

function sorted(neighbors: { to: NId; w: number }[]) {
  return [...neighbors].sort((a, b) => a.to < b.to ? -1 : 1);
}

function bfsSteps(s: NId): GFrame[] {
  const out: GFrame[] = [], vis = new Set<NId>(), q: NId[] = [s], inQ = new Set<NId>([s]), te: [NId, NId][] = [];
  while (q.length) {
    const n = q.shift()!;
    if (vis.has(n)) continue;
    vis.add(n);
    out.push({ visited: [...vis], frontier: [...q], current: n, activeEdges: [...te], msg: `Dequeue ${n} — mark visited` });
    for (const { to } of sorted(ADJ.get(n)!)) {
      if (!vis.has(to) && !inQ.has(to)) { q.push(to); inQ.add(to); te.push([n, to]); }
    }
  }
  return out;
}

function dfsSteps(s: NId): GFrame[] {
  const out: GFrame[] = [], vis = new Set<NId>(), te: [NId, NId][] = [];
  function dfs(n: NId) {
    vis.add(n);
    out.push({ visited: [...vis], frontier: [], current: n, activeEdges: [...te], msg: `Visit ${n}` });
    for (const { to } of sorted(ADJ.get(n)!)) {
      if (!vis.has(to)) { te.push([n, to]); dfs(to); }
    }
  }
  dfs(s);
  return out;
}

function dijkstraSteps(s: NId): GFrame[] {
  const out: GFrame[] = [], dist: Partial<Record<NId, number>> = {}, prev: Partial<Record<NId, NId>> = {};
  const settled = new Set<NId>(), te: [NId, NId][] = [];
  for (const n of NIDS) dist[n] = Infinity;
  dist[s] = 0;
  const pq: { n: NId; d: number }[] = [{ n: s, d: 0 }];
  while (pq.length) {
    pq.sort((a, b) => a.d - b.d);
    const { n } = pq.shift()!;
    if (settled.has(n)) continue;
    settled.add(n);
    if (prev[n]) te.push([prev[n]!, n]);
    out.push({ visited: [...settled], frontier: pq.map(x => x.n), current: n, activeEdges: [...te], dists: { ...dist }, msg: `Settle ${n} (dist=${dist[n]})` });
    for (const { to, w } of ADJ.get(n)!) {
      const d2 = dist[n]! + w;
      if (d2 < dist[to]!) { dist[to] = d2; prev[to] = n; pq.push({ n: to, d: d2 }); }
    }
  }
  return out;
}

function primSteps(s: NId): GFrame[] {
  const out: GFrame[] = [], inMST = new Set<NId>([s]), te: [NId, NId][] = [];
  while (inMST.size < NIDS.length) {
    let best: { from: NId; to: NId; w: number } | null = null;
    for (const n of inMST) for (const { to, w } of ADJ.get(n)!) {
      if (!inMST.has(to) && (!best || w < best.w)) best = { from: n, to, w };
    }
    if (!best) break;
    inMST.add(best.to); te.push([best.from, best.to]);
    out.push({ visited: [...inMST], frontier: [], current: best.to, activeEdges: [...te], msg: `Add ${best.from}–${best.to} (w=${best.w})` });
  }
  return out;
}

// ════════════════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════════════════

type Tab = 'bst' | 'graph';
type GAlgo = 'bfs' | 'dfs' | 'dijkstra' | 'prim';

const ALGO_INFO: Record<GAlgo, { label: string; desc: string; color: string }> = {
  bfs:      { label: 'BFS',       color: '#00d4ff', desc: 'Explores layer by layer using a queue. Guarantees the shortest hop count path in unweighted graphs.' },
  dfs:      { label: 'DFS',       color: '#8b5cf6', desc: 'Dives as deep as possible before backtracking. Useful for cycle detection and topological sort.' },
  dijkstra: { label: "Dijkstra's", color: '#f59e0b', desc: 'Greedily settles the closest unvisited node. Finds shortest weighted paths from a source.' },
  prim:     { label: "Prim's MST", color: '#10b981', desc: 'Grows a minimum spanning tree by always adding the cheapest edge connecting the tree to a new node.' },
};

export default function GraphsVisualizer() {
  const [tab, setTab] = useState<Tab>('bst');

  // ── BST state ──────────────────────────────────────────────────────────
  const [bstRoot, setBstRoot]       = useState<BSTNode | null>(null);
  const [inputVal, setInputVal]     = useState('');
  const [hlIds, setHlIds]           = useState<number[]>([]);
  const [hlColor, setHlColor]       = useState<'cyan' | 'green' | 'red'>('cyan');
  const [bstMsg, setBstMsg]         = useState('Insert values to build the tree.');
  const hlTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Graph state ────────────────────────────────────────────────────────
  const [algo, setAlgo]             = useState<GAlgo>('bfs');
  const [startNode, setStartNode]   = useState<NId>('A');
  const [frames, setFrames]         = useState<GFrame[]>([]);
  const [fidx, setFidx]             = useState(-1);
  const [playing, setPlaying]       = useState(false);
  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── BST helpers ────────────────────────────────────────────────────────
  function hl(ids: number[], color: typeof hlColor) {
    if (hlTimer.current) clearTimeout(hlTimer.current);
    setHlIds(ids); setHlColor(color);
    hlTimer.current = setTimeout(() => setHlIds([]), 2000);
  }

  function handleInsert() {
    const n = parseInt(inputVal);
    if (isNaN(n) || n < 0 || n > 999) { setBstMsg('Enter a number 0–999.'); return; }
    const { root, path } = bstInsert(bstRoot, n);
    setBstRoot(root); setInputVal('');
    hl(path, 'cyan');
    setBstMsg(`Inserted ${n}. Traversed ${path.length} node${path.length !== 1 ? 's' : ''}.`);
  }

  function handleSearch() {
    if (!bstRoot) { setBstMsg('Tree is empty.'); return; }
    const n = parseInt(inputVal);
    if (isNaN(n)) { setBstMsg('Enter a number to search.'); return; }
    const { found, path } = bstSearch(bstRoot, n);
    hl(path, found ? 'green' : 'red');
    setBstMsg(found ? `Found ${n} after ${path.length} comparison${path.length !== 1 ? 's' : ''}.` : `${n} not found. Searched ${path.length} node${path.length !== 1 ? 's' : ''}.`);
  }

  function handleDelete() {
    if (!bstRoot) { setBstMsg('Tree is empty.'); return; }
    const n = parseInt(inputVal);
    if (isNaN(n)) { setBstMsg('Enter a number to delete.'); return; }
    const { found } = bstSearch(bstRoot, n);
    if (!found) { setBstMsg(`${n} is not in the tree.`); return; }
    const { root, path } = bstDeleteNode(bstRoot, n);
    hl(path, 'red');
    setBstRoot(root); setInputVal('');
    setBstMsg(`Deleted ${n}.`);
  }

  function handleRandom() {
    _uid = 0;
    const vals = Array.from({ length: 9 }, () => Math.floor(Math.random() * 89) + 5);
    let r: BSTNode | null = null;
    for (const v of vals) r = bstInsert(r, v).root;
    setBstRoot(r); setHlIds([]);
    setBstMsg(`Inserted: ${vals.join(', ')}`);
  }

  function handleClear() {
    _uid = 0; setBstRoot(null); setHlIds([]);
    setBstMsg('Tree cleared.');
  }

  // ── Graph helpers ──────────────────────────────────────────────────────
  const cf = fidx >= 0 && fidx < frames.length ? frames[fidx] : null;

  function runAlgo() {
    setPlaying(false);
    if (playTimer.current) clearTimeout(playTimer.current);
    const s: GFrame[] =
      algo === 'bfs'      ? bfsSteps(startNode)      :
      algo === 'dfs'      ? dfsSteps(startNode)      :
      algo === 'dijkstra' ? dijkstraSteps(startNode) :
                            primSteps(startNode);
    setFrames(s); setFidx(0);
  }

  function resetGraph() {
    setPlaying(false);
    if (playTimer.current) clearTimeout(playTimer.current);
    setFrames([]); setFidx(-1);
  }

  function step(dir: 1 | -1) {
    setPlaying(false);
    if (playTimer.current) clearTimeout(playTimer.current);
    setFidx(i => Math.max(0, Math.min(frames.length - 1, i + dir)));
  }

  useEffect(() => {
    if (!playing || fidx < 0) return;
    if (fidx >= frames.length - 1) { setPlaying(false); return; }
    playTimer.current = setTimeout(() => setFidx(i => i + 1), 650);
    return () => { if (playTimer.current) clearTimeout(playTimer.current); };
  }, [playing, fidx, frames.length]);

  // ── Canvas rendering ───────────────────────────────────────────────────
  const renderGraph = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const W = container.clientWidth, H = container.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const pad = 44;
    const gx = (id: NId) => GNODES[id].x * (W - pad * 2) + pad;
    const gy = (id: NId) => GNODES[id].y * (H - pad * 2) + pad;

    const visSet  = new Set(cf?.visited  ?? []);
    const frontSet = new Set(cf?.frontier ?? []);
    const aeSet   = new Set((cf?.activeEdges ?? []).map(([a, b]) => `${a}|${b}`));
    const isAE    = (a: NId, b: NId) => aeSet.has(`${a}|${b}`) || aeSet.has(`${b}|${a}`);

    // Edges
    for (const { from, to, w } of GEDGES) {
      const x1 = gx(from), y1 = gy(from), x2 = gx(to), y2 = gy(to);
      const active = isAE(from, to);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = active ? ALGO_INFO[algo].color : 'rgba(30,30,90,0.9)';
      ctx.lineWidth   = active ? 2.5 : 1.5;
      ctx.stroke();
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      ctx.fillStyle = active ? ALGO_INFO[algo].color : '#3a3a7a';
      ctx.font = '10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(w), mx, my - 7);
    }

    // Nodes
    const R = 19;
    for (const id of NIDS) {
      const x = gx(id), y = gy(id);
      const isCur  = cf?.current === id;
      const isVis  = visSet.has(id);
      const isFront = frontSet.has(id);
      const col = ALGO_INFO[algo].color;

      if (isCur) {
        ctx.beginPath(); ctx.arc(x, y, R + 7, 0, Math.PI * 2);
        ctx.fillStyle = col + '33'; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fillStyle = isCur ? col + 'cc' : isVis ? '#1e3050' : isFront ? '#1a1a40' : '#0d0d2b';
      ctx.fill();
      ctx.strokeStyle = isCur ? col : isVis ? col + '80' : isFront ? col + '50' : '#1e1e4a';
      ctx.lineWidth = isCur || isVis ? 2 : 1; ctx.stroke();

      ctx.fillStyle = isCur ? '#fff' : isVis ? '#c0d8ff' : '#94a3b8';
      ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(id, x, y);

      if (cf?.dists && cf.dists[id] !== undefined && cf.dists[id] !== Infinity) {
        ctx.fillStyle = '#f59e0b'; ctx.font = '10px monospace';
        ctx.fillText(String(cf.dists[id]), x, y + R + 9);
      }
    }
  }, [cf, algo]);

  useEffect(() => { renderGraph(); }, [renderGraph]);
  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const obs = new ResizeObserver(renderGraph);
    obs.observe(c); return () => obs.disconnect();
  }, [renderGraph]);

  // ── BST SVG calc ───────────────────────────────────────────────────────
  const allNodes = collectNodes(bstRoot);
  const allEdges = collectEdges(bstRoot);
  const posMap   = new Map<number, { x: number; y: number }>();
  calcPos(bstRoot, 0, 0, 1, posMap);
  const treeH   = bstDepth(bstRoot);
  const SVG_H   = Math.max(220, treeH * 76 + 50);
  const NR = 18;
  const px = (id: number) => (posMap.get(id)?.x ?? 0.5) * 880 + 40;
  const py = (id: number) => (posMap.get(id)?.y ?? 0)   * 76  + 38;

  const hlSet = new Set(hlIds);
  const hlNodeColor = hlColor === 'cyan' ? '#00d4ff' : hlColor === 'green' ? '#10b981' : '#ef4444';

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-white mb-1">
            Trees &amp; <span className="gradient-text-green">Graphs</span>
          </h1>
          <p className="text-slate-500 text-sm">Binary search trees and classic graph traversal algorithms, step by step.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(['bst', 'graph'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                tab === t
                  ? 'bg-green-500/15 border-green-500/50 text-green-400'
                  : 'border-[#1e1e4a] text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t === 'bst' ? 'Binary Search Tree' : 'Graph Algorithms'}
            </button>
          ))}
        </div>

        {/* ── BST Tab ─────────────────────────────────────────────────────── */}
        {tab === 'bst' && (
          <>
            {/* Controls */}
            <div className="glass rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Value (0–999)</label>
                <input
                  type="number" min={0} max={999} value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleInsert()}
                  placeholder="e.g. 42"
                  className="w-28 bg-[#0d0d2b] border border-[#1e1e4a] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                />
              </div>
              <button onClick={handleInsert}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/15 border border-green-500/40 text-green-400 hover:bg-green-500/25 text-sm font-medium transition-all">
                <Plus size={14} /> Insert
              </button>
              <button onClick={handleSearch}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e4a] hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 text-sm transition-all">
                <Search size={14} /> Search
              </button>
              <button onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e4a] hover:border-red-500/50 text-slate-400 hover:text-red-400 text-sm transition-all">
                <Trash2 size={14} /> Delete
              </button>
              <div className="flex gap-2 ml-auto">
                <button onClick={handleRandom}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e4a] hover:border-slate-500 text-slate-400 hover:text-white text-sm transition-all">
                  <Shuffle size={14} /> Random
                </button>
                <button onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e4a] hover:border-red-500/40 text-slate-400 hover:text-red-400 text-sm transition-all">
                  <X size={14} /> Clear
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="glass rounded-xl px-4 py-2.5 mb-4 text-sm text-slate-400 flex items-center gap-2">
              <span className="text-slate-500">›</span> {bstMsg}
              {allNodes.length > 0 && (
                <span className="ml-auto text-xs text-slate-600">{allNodes.length} node{allNodes.length !== 1 ? 's' : ''} · depth {treeH}</span>
              )}
            </div>

            {/* SVG */}
            <div className="glass rounded-xl overflow-auto" style={{ minHeight: 240 }}>
              {!bstRoot ? (
                <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
                  Insert values or click Random to build a tree.
                </div>
              ) : (
                <svg
                  viewBox={`0 0 960 ${SVG_H}`}
                  width="100%"
                  style={{ height: SVG_H, display: 'block' }}
                >
                  {/* Edges */}
                  {allEdges.map(([pid, cid]) => (
                    <line
                      key={`${pid}-${cid}`}
                      x1={px(pid)} y1={py(pid)}
                      x2={px(cid)} y2={py(cid)}
                      stroke={hlSet.has(pid) && hlSet.has(cid) ? hlNodeColor : '#1e1e4a'}
                      strokeWidth={hlSet.has(pid) && hlSet.has(cid) ? 2 : 1.5}
                    />
                  ))}
                  {/* Nodes */}
                  {allNodes.map(node => {
                    const x = px(node.id), y = py(node.id);
                    const isHl = hlSet.has(node.id);
                    return (
                      <g key={node.id}>
                        {isHl && (
                          <circle cx={x} cy={y} r={NR + 6} fill={hlNodeColor + '25'} />
                        )}
                        <circle cx={x} cy={y} r={NR}
                          fill={isHl ? hlNodeColor + 'cc' : '#12122e'}
                          stroke={isHl ? hlNodeColor : '#2a2a5a'}
                          strokeWidth={isHl ? 2 : 1.5}
                        />
                        <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                          fill={isHl ? '#fff' : '#e2e8f0'}
                          fontSize={node.val >= 100 ? 9 : 11}
                          fontFamily="monospace" fontWeight="bold"
                        >
                          {node.val}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-400/80 inline-block" /> Insert path</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" /> Found</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" /> Not found / Deleted</span>
            </div>
          </>
        )}

        {/* ── Graph Tab ───────────────────────────────────────────────────── */}
        {tab === 'graph' && (
          <>
            {/* Controls */}
            <div className="glass rounded-xl p-4 mb-4 flex flex-wrap items-end gap-4">
              {/* Algorithm picker */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Algorithm</label>
                <div className="relative">
                  <select
                    value={algo}
                    onChange={e => { setAlgo(e.target.value as GAlgo); resetGraph(); }}
                    className="appearance-none bg-[#0d0d2b] border border-[#1e1e4a] text-white rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:border-green-500 cursor-pointer"
                  >
                    {(Object.keys(ALGO_INFO) as GAlgo[]).map(k => (
                      <option key={k} value={k}>{ALGO_INFO[k].label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Start node */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 uppercase tracking-wider">Start Node</label>
                <div className="relative">
                  <select
                    value={startNode}
                    onChange={e => { setStartNode(e.target.value as NId); resetGraph(); }}
                    className="appearance-none bg-[#0d0d2b] border border-[#1e1e4a] text-white rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:border-green-500 cursor-pointer"
                  >
                    {NIDS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Playback */}
              <div className="flex items-end gap-2 ml-auto flex-wrap">
                {frames.length === 0 ? (
                  <button onClick={runAlgo}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-green-500/15 border border-green-500/40 text-green-400 hover:bg-green-500/25 transition-all">
                    <Play size={14} /> Run
                  </button>
                ) : (
                  <>
                    <button onClick={() => step(-1)} disabled={fidx <= 0}
                      className="px-3 py-2 rounded-lg border border-[#1e1e4a] text-slate-400 hover:text-white text-sm disabled:opacity-30 transition-all">‹</button>
                    <button onClick={() => setPlaying(p => !p)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        playing ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                      }`}>
                      {playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
                    </button>
                    <button onClick={() => step(1)} disabled={fidx >= frames.length - 1}
                      className="px-3 py-2 rounded-lg border border-[#1e1e4a] text-slate-400 hover:text-white text-sm disabled:opacity-30 transition-all">›</button>
                    <button onClick={resetGraph}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e4a] text-slate-400 hover:text-white text-sm transition-all">
                      <RotateCcw size={14} /> Reset
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Step message */}
            <div className="glass rounded-xl px-4 py-2.5 mb-4 text-sm flex items-center gap-2">
              <span className="text-slate-500">›</span>
              <span className="text-slate-400">{cf?.msg ?? `Select ${ALGO_INFO[algo].label} and click Run.`}</span>
              {frames.length > 0 && (
                <span className="ml-auto text-xs text-slate-600">Step {fidx + 1} / {frames.length}</span>
              )}
            </div>

            {/* Canvas */}
            <div ref={containerRef} className="glass rounded-xl mb-4 overflow-hidden" style={{ height: 420 }}>
              <canvas ref={canvasRef} className="block" />
            </div>

            {/* Algorithm description */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-white mb-1">{ALGO_INFO[algo].label}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{ALGO_INFO[algo].desc}</p>
              {algo === 'dijkstra' && (
                <p className="text-xs text-amber-400/80 mt-2">Yellow numbers below nodes show current shortest distance from the start node.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
