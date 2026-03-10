"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, TrendingUp, BarChart2, Star, Trophy, Calendar, Wallet } from "lucide-react";
import { leagues } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Zap, label: "Ao Vivo", href: "/live", live: true },
  { icon: TrendingUp, label: "Value Bets", href: "/value-bets" },
  { icon: Calendar, label: "Amanhã", href: "/tomorrow" },
  { icon: BarChart2, label: "Estatísticas", href: "/stats" },
  { icon: Wallet, label: "Simulador de Banca", href: "/banca" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 border-r overflow-y-auto"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Main Nav */}
      <div className="p-3">
        <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-2" style={{ color: "var(--text-secondary)" }}>
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all",
                isActive
                  ? "text-white"
                  : "hover:bg-white/5"
              )}
              style={isActive ? { backgroundColor: "var(--accent)", color: "#0a0e1a" } : { color: "var(--text-secondary)" }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.live && (
                <span
                  className="ml-auto w-2 h-2 rounded-full animate-pulse-live"
                  style={{ backgroundColor: isActive ? "#0a0e1a" : "var(--live)" }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mx-3 my-1 h-px" style={{ backgroundColor: "var(--border)" }} />

      {/* Leagues */}
      <div className="p-3">
        <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-2" style={{ color: "var(--text-secondary)" }}>
          Competições
        </p>
        {leagues.map((league) => {
          const isActive = pathname === `/liga/${league.id}`;
          return (
            <Link
              key={league.id}
              href={`/liga/${league.id}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 text-sm transition-all",
                isActive ? "font-semibold" : "hover:bg-white/5"
              )}
              style={
                isActive
                  ? { backgroundColor: "rgba(0,230,118,0.1)", color: "var(--accent)" }
                  : { color: "var(--text-secondary)" }
              }
            >
              <span className="text-base">{league.logo}</span>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-medium" style={{ color: isActive ? "var(--accent)" : "var(--text-primary)" }}>
                  {league.name}
                </span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {league.country}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pro Banner */}
      <div className="p-3 mt-auto">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "linear-gradient(135deg, #00e676 0%, #00b0ff 100%)" }}
        >
          <p className="font-bold text-sm text-gray-900">Análise completa</p>
          <p className="text-xs text-gray-800 mt-1 mb-3">xG, escalação, odds e muito mais</p>
          <Link
            href="/planos"
            className="block w-full py-1.5 rounded-lg text-xs font-bold bg-gray-900 text-white hover:opacity-90 transition-opacity"
          >
            Ver Planos
          </Link>
        </div>
      </div>
    </aside>
  );
}
