"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, GitGraph, Cpu, ChevronDown, Network } from "lucide-react";

// Mini decorative sorting animation
function MiniSortViz() {
  const [bars, setBars] = useState<{value: number; active: boolean}[]>(() =>
    Array.from({ length: 40 }, (_, i) => ({ value: ((i + 1) / 40) * 100, active: false }))
  );

  useEffect(() => {
    let arr = Array.from({ length: 40 }, () => Math.random() * 100 + 10);
    let i = 0, j = 0;

    const interval = setInterval(() => {
      if (i < arr.length - 1) {
        if (j < arr.length - 1 - i) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          }
          const highlight = [j, j + 1];
          setBars(arr.map((value, idx) => ({ value, active: highlight.includes(idx) })));
          j++;
        } else {
          j = 0;
          i++;
        }
      } else {
        arr = Array.from({ length: 40 }, () => Math.random() * 100 + 10);
        i = 0;
        j = 0;
        setBars(arr.map(value => ({ value, active: false })));
      }
    }, 30);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-end gap-0.5 h-24 opacity-40" aria-hidden>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-75"
          style={{
            height: `${bar.value}%`,
            backgroundColor: bar.active ? '#00d4ff' : '#1e1e6a',
          }}
        />
      ))}
    </div>
  );
}

const features = [
  {
    href: "/sorting",
    icon: BarChart3,
    title: "Sorting Algorithms",
    desc: "Watch 6 classic algorithms race to order an array in real time. Compare speeds, swaps, and strategies.",
    algorithms: ["Bubble Sort", "Merge Sort", "Quick Sort", "Heap Sort", "Insertion Sort", "Selection Sort"],
    accent: "#00d4ff",
    bg: "from-cyan-950/30 to-blue-950/20",
    border: "border-cyan-900/50 hover:border-cyan-500/50",
    badge: "bg-cyan-500/10 text-cyan-400",
    glow: "hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]",
  },
  {
    href: "/pathfinding",
    icon: GitGraph,
    title: "Pathfinding Algorithms",
    desc: "Draw walls, set start and end points, and watch A*, Dijkstra, BFS, and DFS navigate through mazes.",
    algorithms: ["A* Search", "Dijkstra's", "BFS", "DFS"],
    accent: "#8b5cf6",
    bg: "from-purple-950/30 to-indigo-950/20",
    border: "border-purple-900/50 hover:border-purple-500/50",
    badge: "bg-purple-500/10 text-purple-400",
    glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
  },
  {
    href: "/graphs",
    icon: Network,
    title: "Trees & Graphs",
    desc: "Build and search binary search trees, then watch BFS, DFS, Dijkstra, and Prim's MST traverse a weighted graph step by step.",
    algorithms: ["BST", "BFS", "DFS", "Dijkstra's", "Prim's MST"],
    accent: "#10b981",
    bg: "from-emerald-950/30 to-teal-950/20",
    border: "border-emerald-900/50 hover:border-emerald-500/50",
    badge: "bg-emerald-500/10 text-emerald-400",
    glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
  },
];


export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden pt-32 pb-24 px-6">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
              <Cpu size={14} />
              <span>Interactive Algorithm Learning</span>
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6">
              <span className="text-white">Algo</span>
              <span className="gradient-text-cyan">Vis</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto mb-4">
              See algorithms come to life.
            </p>
            <p className="text-base text-slate-500 max-w-xl mx-auto mb-10">
              An interactive platform for exploring, visualizing, and understanding classic computer science algorithms from sorting to pathfinding to trees and graphs.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Link href="/sorting">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
                >
                  Explore Sorting <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link href="/pathfinding">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-purple-500/50 hover:border-purple-400 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Explore Pathfinding <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link href="/graphs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-emerald-500/50 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Explore Trees &amp; Graphs <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>

            {/* Mini viz */}
            <div className="max-w-lg mx-auto">
              <MiniSortViz />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Choose your algorithm</h2>
          <p className="text-slate-500">Three fully interactive visualizers, built for learning.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ href, icon: Icon, title, desc, algorithms, accent, bg, border, badge, glow }, index) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={href}>
                <div className={`group relative p-6 rounded-2xl border bg-gradient-to-br ${bg} ${border} ${glow} transition-all duration-300 cursor-pointer h-full`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}30` }}
                    >
                      <Icon size={20} style={{ color: accent }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-slate-100">{title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{desc}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {algorithms.map(algo => (
                      <span key={algo} className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>
                        {algo}
                      </span>
                    ))}
                  </div>

                  <div
                    className="flex items-center gap-1 text-sm font-medium transition-colors"
                    style={{ color: accent }}
                  >
                    Open visualizer <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Educational section */}
      <section className="bg-[#0d0d2b]/50 border-t border-[#1e1e4a]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Why visualize algorithms?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Build intuition",
                  desc: "Seeing an algorithm operate and solve issues in real time helps with understanding and retention. When you watch merge sort divide and conquer, the recursion becomes visual.",
                  icon: "🧠",
                },
                {
                  title: "Compare strategies",
                  desc: "Different algorithms solve the same problem with different approaches. Visualizing them reveals why O(n log n) beats O(n²) in real time.",
                  icon: "⚖️",
                },
                {
                  title: "Spot the patterns",
                  desc: "A* finds the shortest path by combining cost and heuristic. Watching it work shows how informed search differs from brute force exploration.",
                  icon: "🔍",
                },
              ].map(({ title, desc, icon }) => (
                <div key={title} className="p-5 rounded-xl border border-[#1e1e4a] bg-[#12122e]">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e4a] py-8 px-6 text-center text-slate-600 text-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-slate-400 font-semibold">AlgoVis</span>
          <span>An interactive algorithm learning platform</span>
          <div className="flex gap-4">
            <Link href="/sorting" className="hover:text-cyan-400 transition-colors">Sorting</Link>
            <Link href="/pathfinding" className="hover:text-purple-400 transition-colors">Pathfinding</Link>
            <Link href="/graphs" className="hover:text-emerald-400 transition-colors">Graphs</Link>
            <Link href="/learn" className="hover:text-amber-400 transition-colors">Learn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
