"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Clock,
  HardDrive,
  BarChart3,
  GitGraph,
  Network,
  Search,
  Layers,
  TrendingUp,
  Brain,
  Code2,
  BookOpen,
  ArrowDownToLine,
  Settings2,
  CheckCircle2,
  ShieldCheck,
  GitMerge,
  List,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-3xl font-bold text-white mb-3"
    >
      {children}
    </motion.h2>
  );
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-500 mb-10 text-base">{children}</p>;
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
  };
}

// ─── Big-O data ──────────────────────────────────────────────────────────────

const complexities = [
  {
    notation: "O(1)",
    name: "Constant",
    example: "Array index access, hash map lookup",
    speed: "Blazing",
    color: "#10b981",
    bar: 2,
  },
  {
    notation: "O(log n)",
    name: "Logarithmic",
    example: "Binary search, balanced BST operations",
    speed: "Great",
    color: "#00d4ff",
    bar: 10,
  },
  {
    notation: "O(n)",
    name: "Linear",
    example: "Linear search, single array traversal",
    speed: "Good",
    color: "#6ee7b7",
    bar: 22,
  },
  {
    notation: "O(n log n)",
    name: "Linearithmic",
    example: "Merge sort, heap sort, quick sort (avg)",
    speed: "Decent",
    color: "#f59e0b",
    bar: 38,
  },
  {
    notation: "O(n²)",
    name: "Quadratic",
    example: "Bubble sort, selection sort, insertion sort (worst)",
    speed: "Slow",
    color: "#f97316",
    bar: 62,
  },
  {
    notation: "O(2ⁿ)",
    name: "Exponential",
    example: "Recursive Fibonacci (naïve), power set generation",
    speed: "Very slow",
    color: "#ef4444",
    bar: 84,
  },
  {
    notation: "O(n!)",
    name: "Factorial",
    example: "Brute-force travelling salesman, all permutations",
    speed: "Unusable",
    color: "#dc2626",
    bar: 100,
  },
];

// ─── Sorting data ─────────────────────────────────────────────────────────────

const sortingAlgos = [
  {
    name: "Bubble Sort",
    best: "O(n)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    note: "Educational only — rarely used in practice.",
  },
  {
    name: "Selection Sort",
    best: "O(n²)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: false,
    note: "Minimises swaps; useful when writes are expensive.",
  },
  {
    name: "Insertion Sort",
    best: "O(n)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    note: "Excellent on nearly-sorted data. Used inside Timsort.",
  },
  {
    name: "Merge Sort",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    stable: true,
    note: "Guaranteed O(n log n). Best for linked lists.",
  },
  {
    name: "Quick Sort",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    stable: false,
    note: "Fastest in practice on average. Pivot choice is key.",
  },
  {
    name: "Heap Sort",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
    stable: false,
    note: "Constant space + guaranteed O(n log n). Rarely beats quicksort in cache.",
  },
];

// ─── Pathfinding data ─────────────────────────────────────────────────────────

const pathAlgos = [
  {
    name: "Dijkstra's",
    weighted: true,
    guaranteed: true,
    heuristic: false,
    desc: "Explores cheapest edges first using a min-priority queue. Guaranteed shortest path on non-negative weighted graphs.",
    color: "#8b5cf6",
  },
  {
    name: "A* Search",
    weighted: true,
    guaranteed: true,
    heuristic: true,
    desc: "Dijkstra + a heuristic that guides search toward the goal. Much faster in practice while still optimal.",
    color: "#00d4ff",
  },
  {
    name: "BFS",
    weighted: false,
    guaranteed: true,
    heuristic: false,
    desc: "Level-by-level exploration using a queue. Shortest path on unweighted graphs. O(V + E) time.",
    color: "#10b981",
  },
  {
    name: "DFS",
    weighted: false,
    guaranteed: false,
    heuristic: false,
    desc: "Dives deep before backtracking using a stack. Does NOT guarantee shortest path but uses O(V) space.",
    color: "#f59e0b",
  },
];

// ─── Graph data ───────────────────────────────────────────────────────────────

const graphAlgos = [
  {
    name: "BST Operations",
    complexity: "O(log n) avg, O(n) worst",
    desc: "Insert, search, and delete in a binary tree where left < root < right. Degrades to a linked list without balancing.",
    color: "#00d4ff",
  },
  {
    name: "BFS (Graph)",
    complexity: "O(V + E)",
    desc: "Expands neighbours level by level. Great for shortest hops, connected components, and level-order traversal.",
    color: "#10b981",
  },
  {
    name: "DFS (Graph)",
    complexity: "O(V + E)",
    desc: "Visits as deep as possible before backtracking. Used for cycle detection, topological sort, and SCCs.",
    color: "#f59e0b",
  },
  {
    name: "Dijkstra (Graph)",
    complexity: "O((V + E) log V)",
    desc: "Single-source shortest paths on weighted graphs with non-negative edges. Powers GPS and network routing.",
    color: "#8b5cf6",
  },
  {
    name: "Prim's MST",
    complexity: "O((V + E) log V)",
    desc: "Grows a minimum spanning tree one cheapest edge at a time. Used in network design and cluster analysis.",
    color: "#ec4899",
  },
];

// ─── Interview patterns ───────────────────────────────────────────────────────

const interviewPatterns = [
  {
    pattern: "Two Pointers",
    when: "Sorted arrays, pair sums, palindrome checks",
    example: "Find two numbers that sum to a target",
    complexity: "O(n) time / O(1) space",
    icon: "↔",
    color: "#00d4ff",
  },
  {
    pattern: "Sliding Window",
    when: "Subarray/substring of fixed or variable size",
    example: "Longest substring without repeating characters",
    complexity: "O(n) time / O(k) space",
    icon: "□",
    color: "#10b981",
  },
  {
    pattern: "Binary Search",
    when: "Sorted collection, search for a boundary",
    example: "Find first bad version, rotated array search",
    complexity: "O(log n) time / O(1) space",
    icon: "÷",
    color: "#8b5cf6",
  },
  {
    pattern: "BFS / Level Order",
    when: "Shortest path, closest node, spreading simulation",
    example: "Word ladder, walls and gates, rotten oranges",
    complexity: "O(V + E) time / O(V) space",
    icon: "≈",
    color: "#f59e0b",
  },
  {
    pattern: "DFS / Backtracking",
    when: "Explore all possibilities, generate combinations",
    example: "N-Queens, permutations, maze solving",
    complexity: "O(b^d) time / O(d) space",
    icon: "↙",
    color: "#f97316",
  },
  {
    pattern: "Dynamic Programming",
    when: "Overlapping subproblems + optimal substructure",
    example: "Fibonacci, knapsack, longest common subsequence",
    complexity: "Problem-dependent, usually O(n²) → O(n)",
    icon: "⊞",
    color: "#ec4899",
  },
  {
    pattern: "Heap / Priority Queue",
    when: "Repeated min/max queries, top-K elements",
    example: "Merge K sorted lists, K closest points",
    complexity: "O(n log k) time / O(k) space",
    icon: "△",
    color: "#a78bfa",
  },
  {
    pattern: "Union-Find",
    when: "Connected components, cycle detection in graphs",
    example: "Number of provinces, redundant connection",
    complexity: "O(α(n)) per op / O(n) space",
    icon: "⊂",
    color: "#34d399",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function LearnContent() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden pt-32 pb-20 px-6">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-24 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-12 right-1/4 w-80 h-80 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
              <BookOpen size={14} />
              <span>Algorithm Reference Guide</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Everything about</span>
              <br />
              <span className="gradient-text-amber">Algorithms</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4">
              From first principles to interview patterns — a single page that
              tells you everything you need to know.
            </p>
            <p className="text-sm text-slate-500 max-w-xl mx-auto mb-10">
              What they are · Why they matter · How to measure them · Which one
              to reach for · How they show up in interviews
            </p>

            {/* Jump links */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "What is an algorithm?", href: "#what" },
                { label: "Big O notation", href: "#bigo" },
                { label: "Sorting", href: "#sorting" },
                { label: "Pathfinding", href: "#pathfinding" },
                { label: "Graphs & Trees", href: "#graphs" },
                { label: "Interview patterns", href: "#interviews" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm px-4 py-1.5 rounded-full border border-[#1e1e4a] text-slate-400 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What is an algorithm? ── */}
      <section id="what" className="max-w-5xl mx-auto px-6 py-20">
        <SectionTitle>What is an algorithm?</SectionTitle>
        <SectionSub>
          The word sounds scary. It isn&apos;t.
        </SectionSub>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div {...fadeUp(0)} className="space-y-4">
            <p className="text-slate-400 leading-relaxed">
              An <span className="text-white font-medium">algorithm</span> is
              simply a <em>step-by-step set of instructions</em> for solving a
              problem. You follow algorithms every day — a recipe, a morning
              routine, turn-by-turn navigation. In computer science, we write
              those steps in code so a machine can execute them.
            </p>
            <p className="text-slate-400 leading-relaxed">
              What makes one algorithm better than another? Two things:{" "}
              <span className="text-cyan-400">speed</span> (how many steps it
              takes) and{" "}
              <span className="text-purple-400">memory</span> (how much extra
              space it needs). These are formally measured with Big O notation.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Almost every problem in software engineering — searching a
              database, routing a packet, ranking a search result, rendering a
              game — is solved by running a well-chosen algorithm on the right
              data structure.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="space-y-3">
            {[
              {
                Icon: ArrowDownToLine,
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
                title: "Input",
                desc: "Every algorithm takes some data — an array, a graph, a number — as its starting point.",
              },
              {
                Icon: Settings2,
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                title: "Process",
                desc: "It applies a precise sequence of operations: comparisons, swaps, additions, recursion…",
              },
              {
                Icon: CheckCircle2,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                title: "Output",
                desc: "It produces a result — sorted array, shortest path, yes/no answer — and then halts.",
              },
              {
                Icon: ShieldCheck,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                title: "Correctness",
                desc: "For every valid input, the algorithm must always produce the right answer. Always.",
              },
            ].map(({ Icon, color, bg, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-4 rounded-xl border border-[#1e1e4a] bg-[#12122e]"
              >
                <div className={`flex-shrink-0 p-2 rounded-lg ${bg}`}>
                  <Icon size={16} className={color} />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm mb-0.5">
                    {title}
                  </div>
                  <div className="text-slate-500 text-sm leading-relaxed">
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Why we need them */}
        <motion.div
          {...fadeUp(0.2)}
          className="p-6 rounded-2xl border border-[#1e1e4a] bg-gradient-to-br from-cyan-950/20 to-blue-950/10"
        >
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Zap size={18} className="text-cyan-400" /> Why do we need
            algorithms?
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                title: "Scale",
                desc: "Searching 1 million records with the wrong algorithm can take a billion operations. The right one takes 20.",
                color: "text-cyan-400",
              },
              {
                title: "Reliability",
                desc: "Correct algorithms handle edge cases (empty input, duplicates, negatives) gracefully — every time.",
                color: "text-purple-400",
              },
              {
                title: "Resources",
                desc: "Memory and battery are finite. An efficient algorithm can mean the difference between a fast app and a crashing one.",
                color: "text-emerald-400",
              },
            ].map(({ title, desc, color }) => (
              <div key={title}>
                <div className={`font-semibold text-sm ${color} mb-1`}>
                  {title}
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Big O ── */}
      <section
        id="bigo"
        className="bg-[#0d0d2b]/50 border-t border-b border-[#1e1e4a]"
      >
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionTitle>Big O Notation</SectionTitle>
          <SectionSub>
            How we describe the cost of an algorithm as input size grows toward
            infinity.
          </SectionSub>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <motion.div {...fadeUp(0)} className="space-y-4">
              <p className="text-slate-400 leading-relaxed">
                Big O ignores constants and focuses on the{" "}
                <span className="text-white">dominant growth factor</span>.
                Doubling the input:
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                {[
                  ["O(1)", "still takes the same time"],
                  ["O(log n)", "adds only one more step"],
                  ["O(n)", "doubles the work"],
                  ["O(n²)", "quadruples the work"],
                  ["O(2ⁿ)", "makes it astronomically longer"],
                ].map(([big, result]) => (
                  <li key={big} className="flex items-baseline gap-2">
                    <span className="font-mono text-cyan-400 w-24 flex-shrink-0">
                      {big}
                    </span>
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 text-sm text-amber-300/80">
                <span className="font-semibold text-amber-400">
                  Space complexity
                </span>{" "}
                follows the same notation — but measures extra memory consumed,
                not time. An O(1) space algorithm modifies data in-place; O(n)
                space means it allocates a copy.
              </div>
            </motion.div>

            {/* Visual bar chart */}
            <motion.div {...fadeUp(0.1)}>
              <div className="space-y-2.5">
                {complexities.map(({ notation, name, bar, color, speed }) => (
                  <div key={notation} className="flex items-center gap-3">
                    <span className="font-mono text-xs w-20 flex-shrink-0 text-right text-slate-400">
                      {notation}
                    </span>
                    <div className="flex-1 h-5 bg-[#12122e] rounded overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full rounded"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                    <span className="text-xs w-20 flex-shrink-0 text-slate-500">
                      {speed}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-3 text-right">
                Bar length = relative cost for large n
              </p>
            </motion.div>
          </div>

          {/* Full complexity table */}
          <motion.div {...fadeUp(0.2)} className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e4a] text-left text-slate-500 text-xs uppercase tracking-wider">
                  <th className="pb-3 pr-4">Notation</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4 hidden sm:table-cell">
                    Real example
                  </th>
                  <th className="pb-3">Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e4a]">
                {complexities.map(({ notation, name, example, speed, color }) => (
                  <tr key={notation} className="group">
                    <td className="py-3 pr-4 font-mono font-semibold" style={{ color }}>
                      {notation}
                    </td>
                    <td className="py-3 pr-4 text-white">{name}</td>
                    <td className="py-3 pr-4 text-slate-500 hidden sm:table-cell">
                      {example}
                    </td>
                    <td className="py-3 text-slate-400">{speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── Sorting ── */}
      <section id="sorting" className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
          <SectionTitle>Sorting Algorithms</SectionTitle>
          <Link href="/sorting">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
            >
              <BarChart3 size={14} /> Visualize sorting <ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>
        <SectionSub>
          Rearranging elements into a defined order — the foundation of computer
          science interviews and real-world processing pipelines.
        </SectionSub>

        <motion.div {...fadeUp(0)} className="mb-8 p-5 rounded-xl border border-[#1e1e4a] bg-[#12122e]">
          <p className="text-slate-400 text-sm leading-relaxed">
            Sorting isn&apos;t just about putting numbers in order. It unlocks
            faster searches (binary search requires sorted data), simplifies
            deduplication, and is the first step in countless algorithms.
            Choosing the right sort depends on input size, whether data is
            nearly sorted, whether stability matters, and whether you can afford
            extra memory.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e4a] text-left text-slate-500 text-xs uppercase tracking-wider">
                <th className="pb-3 pr-4">Algorithm</th>
                <th className="pb-3 pr-4">Best</th>
                <th className="pb-3 pr-4">Average</th>
                <th className="pb-3 pr-4">Worst</th>
                <th className="pb-3 pr-4">Space</th>
                <th className="pb-3 pr-4">Stable?</th>
                <th className="pb-3 hidden lg:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e4a]">
              {sortingAlgos.map(({ name, best, avg, worst, space, stable, note }) => (
                <tr key={name} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-semibold text-white">{name}</td>
                  <td className="py-3 pr-4 font-mono text-emerald-400">{best}</td>
                  <td className="py-3 pr-4 font-mono text-amber-400">{avg}</td>
                  <td className="py-3 pr-4 font-mono text-red-400">{worst}</td>
                  <td className="py-3 pr-4 font-mono text-slate-400">{space}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${stable ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700/50 text-slate-500"}`}>
                      {stable ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 text-xs hidden lg:table-cell max-w-xs">
                    {note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="mt-6 grid sm:grid-cols-2 gap-4">
          {[
            {
              Icon: Zap,
              color: "text-cyan-400",
              bg: "bg-cyan-500/10",
              title: "When to use Quick Sort",
              desc: "General-purpose in-memory sorts. Fastest in practice due to cache performance. Avoid on nearly-sorted data without randomisation.",
            },
            {
              Icon: GitMerge,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
              title: "When to use Merge Sort",
              desc: "When stability is required or you're sorting linked lists. Guaranteed O(n log n) regardless of input.",
            },
            {
              Icon: List,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
              title: "When to use Insertion Sort",
              desc: "Input size < ~20 elements, or nearly sorted. This is why Timsort (Python, Java) falls back to insertion sort for small runs.",
            },
            {
              Icon: HardDrive,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
              title: "When to use Heap Sort",
              desc: "Memory-constrained systems needing guaranteed O(n log n). Rarely beats Quick Sort in practice due to poor cache locality.",
            },
          ].map(({ Icon, color, bg, title, desc }) => (
            <div key={title} className="flex gap-3 p-4 rounded-xl border border-[#1e1e4a] bg-[#12122e]">
              <div className={`flex-shrink-0 p-2 rounded-lg ${bg} h-fit`}>
                <Icon size={14} className={color} />
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-1">{title}</div>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Pathfinding ── */}
      <section id="pathfinding" className="bg-[#0d0d2b]/50 border-t border-b border-[#1e1e4a]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
            <SectionTitle>Pathfinding Algorithms</SectionTitle>
            <Link href="/pathfinding">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
              >
                <GitGraph size={14} /> Visualize pathfinding <ArrowRight size={14} />
              </motion.button>
            </Link>
          </div>
          <SectionSub>
            Finding the shortest (or any) route through a graph or grid — used
            in GPS, game AI, robotics, and network routing.
          </SectionSub>

          <motion.div {...fadeUp(0)} className="mb-8 p-5 rounded-xl border border-[#1e1e4a] bg-[#12122e]">
            <p className="text-slate-400 text-sm leading-relaxed">
              All pathfinding algorithms model the world as a{" "}
              <span className="text-white">graph</span>: nodes (locations) connected
              by edges (paths), optionally with weights (distances or costs). The
              key trade-off is between{" "}
              <span className="text-purple-400">optimality</span> (guaranteed shortest
              path) and <span className="text-cyan-400">speed</span> (how quickly
              you find any path).
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {pathAlgos.map(({ name, weighted, guaranteed, heuristic, desc, color }, i) => (
              <motion.div
                key={name}
                {...fadeUp(i * 0.08)}
                className="p-5 rounded-xl border border-[#1e1e4a] bg-[#12122e] hover:border-purple-900/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="font-bold text-white">{name}</span>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {weighted && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                        Weighted
                      </span>
                    )}
                    {!weighted && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-500">
                        Unweighted
                      </span>
                    )}
                    {guaranteed && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                        Optimal
                      </span>
                    )}
                    {!guaranteed && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                        Not optimal
                      </span>
                    )}
                    {heuristic && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">
                        Heuristic
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                <div className="mt-3 h-0.5 rounded w-12" style={{ backgroundColor: color }} />
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.3)} className="mt-8 p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <h4 className="text-amber-400 font-semibold text-sm mb-2 flex items-center gap-2">
              <TrendingUp size={14} /> Quick decision guide
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-400">
              {[
                ["Unweighted grid, shortest hops", "→ BFS"],
                ["Weighted graph, guaranteed shortest path", "→ Dijkstra's"],
                ["Weighted grid with clear goal, faster search", "→ A*"],
                ["Just need some path, memory-limited", "→ DFS"],
              ].map(([condition, answer]) => (
                <li key={condition} className="flex gap-3">
                  <span className="text-slate-600">{condition}</span>
                  <span className="text-amber-400 font-mono font-semibold">{answer}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Graphs & Trees ── */}
      <section id="graphs" className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
          <SectionTitle>Trees &amp; Graph Algorithms</SectionTitle>
          <Link href="/graphs">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
            >
              <Network size={14} /> Visualize graphs <ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>
        <SectionSub>
          Structures where relationships matter as much as the data — powering
          social networks, compilers, maps, and databases.
        </SectionSub>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {graphAlgos.map(({ name, complexity, desc, color }, i) => (
            <motion.div
              key={name}
              {...fadeUp(i * 0.08)}
              className="p-5 rounded-xl border border-[#1e1e4a] bg-[#12122e] flex flex-col"
            >
              <div
                className="text-sm font-semibold mb-1"
                style={{ color }}
              >
                {name}
              </div>
              <div className="font-mono text-xs text-slate-500 mb-3">{complexity}</div>
              <p className="text-slate-400 text-xs leading-relaxed flex-1">{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.3)} className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-[#1e1e4a] bg-gradient-to-br from-cyan-950/20 to-blue-950/10">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" /> Tree terminology
            </h4>
            <ul className="space-y-1.5 text-sm">
              {[
                ["Root", "The topmost node with no parent"],
                ["Leaf", "A node with no children"],
                ["Height", "Longest path from root to a leaf"],
                ["BST property", "left.val < node.val < right.val"],
                ["Balanced tree", "Height stays O(log n)"],
              ].map(([term, def]) => (
                <li key={term} className="flex gap-3">
                  <span className="text-cyan-400 font-mono text-xs w-28 flex-shrink-0">{term}</span>
                  <span className="text-slate-500 text-xs">{def}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-[#1e1e4a] bg-gradient-to-br from-emerald-950/20 to-teal-950/10">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Search size={16} className="text-emerald-400" /> Graph terminology
            </h4>
            <ul className="space-y-1.5 text-sm">
              {[
                ["Vertex (V)", "A node in the graph"],
                ["Edge (E)", "A connection between two vertices"],
                ["Directed", "Edges have a direction (A → B)"],
                ["Weighted", "Edges have a numeric cost"],
                ["MST", "Minimum spanning tree — cheapest connected subgraph"],
              ].map(([term, def]) => (
                <li key={term} className="flex gap-3">
                  <span className="text-emerald-400 font-mono text-xs w-28 flex-shrink-0">{term}</span>
                  <span className="text-slate-500 text-xs">{def}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ── Interview patterns ── */}
      <section id="interviews" className="bg-[#0d0d2b]/50 border-t border-[#1e1e4a]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionTitle>Interview Patterns</SectionTitle>
          <SectionSub>
            Most coding interview problems map to one of ~10 fundamental
            patterns. Recognise the pattern and the solution becomes clear.
          </SectionSub>

          <motion.div {...fadeUp(0)} className="mb-8 p-5 rounded-xl border border-[#1e1e4a] bg-[#12122e]">
            <div className="flex items-start gap-3">
              <Brain size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-400 text-sm leading-relaxed">
                Interviewers at top companies rarely ask you to implement a
                sorting algorithm from scratch. Instead they present a{" "}
                <span className="text-white">novel problem</span> that requires
                you to recognise which algorithmic pattern applies, adapt it,
                and explain your time/space trade-offs. The 8 patterns below
                cover the vast majority of LeetCode-style problems.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {interviewPatterns.map(({ pattern, when, example, complexity, icon, color }, i) => (
              <motion.div
                key={pattern}
                {...fadeUp(i * 0.06)}
                className="p-5 rounded-xl border border-[#1e1e4a] bg-[#12122e] hover:border-current/20 transition-colors group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className="text-2xl w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 font-mono font-bold"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    {icon}
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">{pattern}</div>
                    <div className="font-mono text-xs mt-0.5" style={{ color }}>
                      {complexity}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-500">
                    <span className="text-slate-400 font-medium">Use when: </span>
                    {when}
                  </div>
                  <div className="text-slate-500">
                    <span className="text-slate-400 font-medium">Classic problem: </span>
                    {example}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tips */}
          <motion.div {...fadeUp(0.3)} className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Code2 size={16} />,
                title: "State the approach first",
                desc: "Before writing a single line of code, explain your pattern choice and complexity to the interviewer.",
                color: "text-cyan-400",
                border: "border-cyan-900/40",
              },
              {
                icon: <Clock size={16} />,
                title: "Always analyse complexity",
                desc: "After coding, walk through the time AND space complexity. Interviewers expect this unprompted.",
                color: "text-purple-400",
                border: "border-purple-900/40",
              },
              {
                icon: <HardDrive size={16} />,
                title: "Consider edge cases",
                desc: "Empty input, single element, duplicates, negatives, integer overflow — mention them before they're pointed out.",
                color: "text-emerald-400",
                border: "border-emerald-900/40",
              },
            ].map(({ icon, title, desc, color, border }) => (
              <div key={title} className={`p-5 rounded-xl border ${border} bg-[#12122e]`}>
                <div className={`mb-2 ${color} flex items-center gap-2`}>
                  {icon}
                  <span className="font-semibold text-sm">{title}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">
            Now see them in action
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            Reading about algorithms is a start. Watching them work on real data
            is how it clicks.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/sorting">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
              >
                <BarChart3 size={16} /> Sorting visualizer
              </motion.button>
            </Link>
            <Link href="/pathfinding">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-purple-500/50 hover:border-purple-400 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                <GitGraph size={16} /> Pathfinding visualizer
              </motion.button>
            </Link>
            <Link href="/graphs">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-emerald-500/50 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <Network size={16} /> Graphs visualizer
              </motion.button>
            </Link>
          </div>
        </motion.div>
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
