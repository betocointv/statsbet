"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProGate from "@/components/ProGate";
import {
  loadBankroll, saveBankroll, calcStats, buildEquityCurve,
  getDefaultBets, type BankrollState,
} from "@/lib/bankroll";
import {
  TrendingUp, TrendingDown, DollarSign,
  Target, BarChart2, Zap, Info,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { BetResult } from "@/lib/bankroll";

// ─── StatCard ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string; sub?: string; color: string;
  icon: React.ComponentType<{ size?: number; style?: object }>;
}) {
  return (
    <div className="rounded-2xl p-4 border flex items-center gap-4"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}20` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-black truncate" style={{ color: "var(--text-primary)" }}>{value}</p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</p>
        {sub && <p className="text-xs font-semibold mt-0.5" style={{ color }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── Badge de resultado ───────────────────────────────────────────────────────
function ResultBadge({ result }: { result: BetResult }) {
  const map: Record<BetResult, { label: string; bg: string; color: string }> = {
    win:     { label: "Ganhou",   bg: "rgba(0,230,118,0.15)",   color: "var(--accent)"  },
    loss:    { label: "Perdeu",   bg: "rgba(255,68,68,0.15)",   color: "var(--live)"    },
    push:    { label: "Push",     bg: "rgba(136,153,187,0.15)", color: "var(--text-secondary)" },
    pending: { label: "Ao Vivo",  bg: "rgba(255,167,38,0.15)",  color: "var(--warning)" },
  };
  const s = map[result];
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BancaClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [state, setState] = useState<BankrollState | null>(null);
  const [filterResult, setFilterResult] = useState<BetResult | "all">("all");

  useEffect(() => {
    if (!loading && !user) { router.push("/entrar"); return; }
    if (user) {
      let s = loadBankroll();
      if (s.bets.length === 0) {
        s = { ...s, bets: getDefaultBets() };
        saveBankroll(s);
      }
      setState(s);
    }
  }, [user, loading, router]);

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--accent)" }} />
      </div>
    );
  }

  const isPro = user && (user.plan === "pro" || user.plan === "premium");
  const stats = calcStats(state);
  const curve = buildEquityCurve(state.bets, state.config.initialBankroll, state.config.unitSize);

  const filteredBets = state.bets
    .filter((b) => filterResult === "all" || b.result === filterResult)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const roiColor   = stats.roi > 0 ? "var(--accent)" : stats.roi < 0 ? "var(--live)" : "var(--text-secondary)";
  const profitColor = stats.totalProfit > 0 ? "var(--accent)" : stats.totalProfit < 0 ? "var(--live)" : "var(--text-secondary)";

  return (
    <ProGate requiredPlan="pro" message="Simulador de Banca disponível no plano PRO" blurContent={!isPro}>
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <BarChart2 size={22} style={{ color: "var(--accent)" }} />
            <div>
              <h1 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                Simulador de Banca
              </h1>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Acompanhe a performance dos value bets detectados pelo sistema
              </p>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div
          className="rounded-2xl p-4 border flex items-start gap-3"
          style={{ backgroundColor: "rgba(0,230,118,0.05)", borderColor: "rgba(0,230,118,0.2)" }}
        >
          <Info size={16} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Este painel simula o desempenho de uma banca de{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              R${state.config.initialBankroll.toLocaleString("pt-BR")}
            </strong>{" "}
            seguindo os value bets identificados pelo StatsBet (
            {state.config.unitSize} reais por unidade). Valores meramente ilustrativos — apostas esportivas envolvem risco.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={DollarSign} label="Banca Simulada" color="var(--accent)"
            value={`R$${stats.currentBankroll.toFixed(0)}`}
            sub={`${stats.totalProfit >= 0 ? "+" : ""}R$${(stats.totalProfit * state.config.unitSize).toFixed(0)} P&L`} />
          <StatCard icon={stats.roi >= 0 ? TrendingUp : TrendingDown} label="ROI" color={roiColor}
            value={`${stats.roi >= 0 ? "+" : ""}${stats.roi.toFixed(1)}%`}
            sub={`${stats.settledBets} sinais analisados`} />
          <StatCard icon={Target} label="Precisão" color="var(--warning)"
            value={`${stats.winRate.toFixed(1)}%`}
            sub={`${stats.wins}✓ · ${stats.losses}✗ · ${stats.pushes} nulos`} />
          <StatCard icon={Zap} label="Lucro (un.)" color={profitColor}
            value={`${stats.totalProfit >= 0 ? "+" : ""}${stats.totalProfit.toFixed(2)}u`}
            sub={`Odd média ${stats.avgOdd.toFixed(2)}`} />
        </div>

        {/* Equity curve */}
        {curve.length > 1 && (
          <div className="rounded-2xl p-5 border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: "var(--text-secondary)" }}>
              Evolução da Banca Simulada
            </h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curve} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                    tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                    tickLine={false} axisLine={false}
                    tickFormatter={(v) => `R$${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      color: "var(--text-primary)",
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(v: any) => v != null ? [`R$${Number(v).toFixed(2)}`, "Banca simulada"] as [string, string] : ["", ""] as [string, string]}
                  />
                  <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2}
                    dot={{ fill: "var(--accent)", strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: "var(--accent)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Signals table */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>

          <div className="p-4 border-b flex items-center justify-between gap-3 flex-wrap"
            style={{ borderColor: "var(--border)" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}>
              Sinais Registrados pelo Sistema
            </h3>
            <div className="flex gap-1">
              {(["all", "pending", "win", "loss"] as const).map((f) => (
                <button key={f} onClick={() => setFilterResult(f)}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: filterResult === f ? "var(--surface-2)" : "transparent",
                    color: filterResult === f ? "var(--text-primary)" : "var(--text-secondary)",
                  }}>
                  {f === "all" ? "Todos" : f === "pending" ? "Ao Vivo" : f === "win" ? "Ganhou" : "Perdeu"}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {filteredBets.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-2xl mb-2">📋</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Nenhum sinal encontrado</p>
              </div>
            ) : filteredBets.map((bet) => (
              <div key={bet.id} className="px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold truncate"
                        style={{ color: "var(--text-primary)" }}>
                        {bet.match}
                      </span>
                      {bet.league && (
                        <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: "var(--surface-2)", color: "var(--text-secondary)" }}>
                          {bet.league}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs flex-wrap"
                      style={{ color: "var(--text-secondary)" }}>
                      <span className="font-medium" style={{ color: "var(--accent)" }}>
                        {bet.selection}
                      </span>
                      <span>@{bet.odd.toFixed(2)}</span>
                      <span>{bet.stake}u</span>
                      <span>·</span>
                      <span>{new Date(bet.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                    {bet.notes && (
                      <p className="text-xs mt-1 italic" style={{ color: "var(--text-secondary)" }}>
                        {bet.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <ResultBadge result={bet.result} />
                    {bet.result !== "pending" && (
                      <span className="text-sm font-bold w-16 text-right"
                        style={{
                          color: bet.profit > 0
                            ? "var(--accent)"
                            : bet.profit < 0
                            ? "var(--live)"
                            : "var(--text-secondary)",
                        }}>
                        {bet.profit > 0 ? "+" : ""}{bet.profit.toFixed(2)}u
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {stats.totalBets} sinais · {stats.settledBets} encerrados · {stats.pending} ao vivo
            </span>
            <span className="text-xs font-semibold" style={{ color: profitColor }}>
              Total: {stats.totalProfit >= 0 ? "+" : ""}{stats.totalProfit.toFixed(2)}u
              {" "}(R${(stats.totalProfit * state.config.unitSize).toFixed(2)})
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
          ⚠️ Resultados passados não garantem resultados futuros. O StatsBet é uma ferramenta de análise estatística e não incentiva apostas. Jogue com responsabilidade.
        </p>
      </div>
    </ProGate>
  );
}
