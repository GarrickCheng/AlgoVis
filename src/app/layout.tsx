import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AlgoVis — Algorithm Visualizer",
  description: "Interactive visualizations of classic algorithms for learning and exploration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#06061a] text-slate-200 antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
