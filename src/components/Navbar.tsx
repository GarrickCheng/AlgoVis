"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, GitGraph, Cpu, Network, BookOpen } from "lucide-react";

const navLinks = [
  { href: "/sorting",     label: "Sorting",     icon: BarChart3,  activeClass: "border-cyan-400 text-cyan-400" },
  { href: "/pathfinding", label: "Pathfinding", icon: GitGraph,   activeClass: "border-purple-400 text-purple-400" },
  { href: "/graphs",      label: "Graphs",      icon: Network,    activeClass: "border-emerald-400 text-emerald-400" },
  { href: "/learn",       label: "Learn",       icon: BookOpen,   activeClass: "border-amber-400 text-amber-400" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#1e1e4a]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-white hover:opacity-90 transition-opacity">
          <Cpu size={18} className="text-cyan-400" />
          <span>Algo<span className="text-cyan-400">Vis</span></span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon, activeClass }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link key={href} href={href}>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
                  isActive
                    ? `${activeClass} border-current bg-current/10`
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
                }`}>
                  <Icon size={14} />
                  {label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
