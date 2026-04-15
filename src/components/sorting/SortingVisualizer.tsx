"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RefreshCw, Shuffle, ChevronDown, Clock, HardDrive, Check, X } from "lucide-react";
import { ALGORITHMS, Frame, Bar } from "./sortingAlgorithms";

const BAR_COLORS: Record<string, string> = {
  default: '#1e3a5f',
  comparing: '#f59e0b',
  swapping: '#ef4444',
  sorted: '#10b981',
  pivot: '#8b5cf6',
  current: '#00d4ff',
  merging: '#06b6d4',
};

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export default function SortingVisualizer() {
  const [algoIndex, setAlgoIndex] = useState(0);
  const [arraySize, setArraySize] = useState(80);
  const [speed, setSpeed] = useState(5);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [initialArray, setInitialArray] = useState<number[]>(() => generateArray(80));

  const currentBars: Bar[] = frames.length > 0 ? frames[currentFrame] : initialArray.map(v => ({ value: v, state: 'default' as const }));
  const algo = ALGORITHMS[algoIndex];

  // Compute frames when algo or array changes
  const computeFrames = useCallback((arr: number[], algoIdx: number) => {
    const f = ALGORITHMS[algoIdx].getFrames(arr);
    setFrames(f);
    setCurrentFrame(0);
    setIsPlaying(false);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    computeFrames(initialArray, algoIndex);
  }, [initialArray, algoIndex, computeFrames]);

  // Animation loop
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!isPlaying || isComplete) return;

    const delay = Math.max(5, 600 / (speed * speed)); // exponential speed curve
    intervalRef.current = setInterval(() => {
      setCurrentFrame(prev => {
        if (prev >= frames.length - 1) {
          setIsPlaying(false);
          setIsComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, frames.length, speed, isComplete]);

  const handleGenerate = useCallback(() => {
    const arr = generateArray(arraySize);
    setInitialArray(arr);
  }, [arraySize]);

  const handleReset = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
    setIsComplete(false);
  };

  const handlePlayPause = () => {
    if (isComplete) {
      handleReset();
      return;
    }
    setIsPlaying(p => !p);
  };

  const totalSteps = frames.length;
  const progress = totalSteps > 0 ? (currentFrame / (totalSteps - 1)) * 100 : 0;

  const maxBarValue = Math.max(...currentBars.map(b => b.value), 1);

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">
            Sorting <span className="gradient-text-cyan">Algorithms</span>
          </h1>
          <p className="text-slate-500 text-sm">Select an algorithm, adjust the array, and hit play.</p>
        </div>

        {/* Controls */}
        <div className="glass rounded-xl p-4 mb-4 flex flex-wrap items-center gap-4">
          {/* Algorithm Select */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Algorithm</label>
            <div className="relative">
              <select
                className="appearance-none bg-[#0d0d2b] border border-[#1e1e4a] text-white rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                value={algoIndex}
                onChange={e => { setAlgoIndex(Number(e.target.value)); setIsPlaying(false); }}
                disabled={isPlaying}
              >
                {ALGORITHMS.map((a, i) => (
                  <option key={a.key} value={i}>{a.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Array Size */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Array Size: {arraySize}</label>
            <input
              type="range" min={10} max={150} value={arraySize}
              onChange={e => { setArraySize(Number(e.target.value)); }}
              onMouseUp={() => handleGenerate()}
              onTouchEnd={() => handleGenerate()}
              className="accent-cyan-400 cursor-pointer"
              disabled={isPlaying}
            />
          </div>

          {/* Speed */}
          <div className="flex flex-col gap-1 min-w-[120px]">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Speed: {speed}</label>
            <input
              type="range" min={1} max={10} value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2 ml-auto">
            <button
              onClick={handleGenerate}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e4a] hover:border-slate-500 text-slate-400 hover:text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Shuffle size={14} /> New Array
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e1e4a] hover:border-slate-500 text-slate-400 hover:text-white text-sm transition-all"
            >
              <RefreshCw size={14} /> Reset
            </button>
            <button
              onClick={handlePlayPause}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isPlaying
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30'
                  : isComplete
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30'
                  : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30'
              }`}
            >
              {isPlaying ? <><Pause size={14} /> Pause</> : isComplete ? <><RefreshCw size={14} /> Replay</> : <><Play size={14} /> Play</>}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-2 flex items-center gap-3">
          <div className="flex-1 h-1 bg-[#1e1e4a] rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-100 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            Step {currentFrame + 1} / {totalSteps}
          </span>
        </div>

        {/* Visualization */}
        <div className="glass rounded-xl p-4 mb-4" style={{ height: '320px' }}>
          <div className="flex items-end gap-px h-full">
            {currentBars.map((bar, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm sort-bar"
                style={{
                  height: `${(bar.value / maxBarValue) * 95}%`,
                  backgroundColor: BAR_COLORS[bar.state] || BAR_COLORS.default,
                  minWidth: '2px',
                }}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4 px-1">
          {[
            { state: 'default', label: 'Unsorted' },
            { state: 'comparing', label: 'Comparing' },
            { state: 'swapping', label: 'Swapping' },
            { state: 'pivot', label: 'Pivot' },
            { state: 'merging', label: 'Merging' },
            { state: 'sorted', label: 'Sorted' },
          ].map(({ state, label }) => (
            <div key={state} className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BAR_COLORS[state] }} />
              {label}
            </div>
          ))}
        </div>

        {/* Algorithm Info */}
        <div className="glass rounded-xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-xl font-bold text-white mb-2">{algo.name}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{algo.description}</p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-[#0d0d2b] rounded-lg p-2.5 flex items-center gap-2">
                  <Clock size={14} className="text-cyan-400" />
                  <div>
                    <div className="text-xs text-slate-500">Avg Time</div>
                    <div className="text-white font-mono font-medium">{algo.timeAvg}</div>
                  </div>
                </div>
                <div className="bg-[#0d0d2b] rounded-lg p-2.5 flex items-center gap-2">
                  <Clock size={14} className="text-amber-400" />
                  <div>
                    <div className="text-xs text-slate-500">Worst</div>
                    <div className="text-white font-mono font-medium">{algo.timeWorst}</div>
                  </div>
                </div>
                <div className="bg-[#0d0d2b] rounded-lg p-2.5 flex items-center gap-2">
                  <Clock size={14} className="text-green-400" />
                  <div>
                    <div className="text-xs text-slate-500">Best</div>
                    <div className="text-white font-mono font-medium">{algo.timeBest}</div>
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

              <div className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg w-fit ${
                algo.stable
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {algo.stable ? <Check size={13} /> : <X size={13} />}
                {algo.stable ? 'Stable' : 'Not Stable'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
