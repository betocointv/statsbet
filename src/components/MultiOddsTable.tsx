"use client";

import type { BookmakerOdds, Match } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";

interface Props {
  multiOdds: BookmakerOdds[];
  homeTeam: Match["homeTeam"];
  awayTeam: Match["awayTeam"];
  valueBet?: string;
}

export default function MultiOddsTable({ multiOdds, homeTeam, awayTeam, valueBet }: Props) {
  // Calcular melhor odd para cada resultado
  const bestHome = Math.max(...multiOdds.map((o) => o.home));
  const bestDraw = Math.max(...multiOdds.map((o) => o.draw));
  const bestAway = Math.max(...multiOdds.map((o) => o.away));

  // Calcular probabilidade implícita média
  const avgHome = multiOdds.reduce((s, o) => s + o.home, 0) / multiOdds.length;
  const avgDraw = multiOdds.reduce((s, o) => s + o.draw, 0) / multiOdds.length;
  const avgAway = multiOdds.reduce((s, o) => s + o.away, 0) / multiOdds.length;

  function impliedProb(odd: number) {
    return ((1 / odd) * 100).toFixed(1);
  }

  return (
    <div className="space-y-4">
      {/* Comparação visual */}
      <div
        className="rounded-2xl p-5 border"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-secondary)" }}>
          Probabilidades Implícitas (média)
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: homeTeam.shortName, avg: avgHome, type: "home", color: "var(--accent)" },
            { label: "Empate",           avg: avgDraw, type: "draw", color: "var(--warning)" },
            { label: awayTeam.shortName, avg: avgAway, type: "away", color: "#00b0ff" },
          ].map((col) => {
            const isValue = valueBet === col.type;
            return (
              <div
                key={col.type}
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: isValue ? `${col.color}12` : "var(--surface-2)",
                  border: isValue ? `1px solid ${col.color}40` : "1px solid transparent",
                }}
              >
                <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{col.label}</p>
                <p className="text-2xl font-black" style={{ color: col.color }}>{col.avg.toFixed(2)}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {impliedProb(col.avg)}% prob.
                </p>
                {isValue && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp size={10} style={{ color: col.color }} />
                    <span className="text-xs font-bold" style={{ color: col.color }}>VALUE</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela por casa */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Comparativo por Casa de Apostas
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="px-4 py-2.5 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>Casa</th>
                <th className="px-4 py-2.5 text-center font-semibold" style={{ color: "var(--accent)" }}>1 — {homeTeam.shortName}</th>
                <th className="px-4 py-2.5 text-center font-semibold" style={{ color: "var(--text-secondary)" }}>X</th>
                <th className="px-4 py-2.5 text-center font-semibold" style={{ color: "#00b0ff" }}>2 — {awayTeam.shortName}</th>
                <th className="px-4 py-2.5 text-center font-semibold" style={{ color: "var(--text-secondary)" }}>Margem</th>
              </tr>
            </thead>
            <tbody>
              {multiOdds.map((bm, i) => {
                const margin = ((1/bm.home + 1/bm.draw + 1/bm.away - 1) * 100).toFixed(1);
                const isLastRow = i === multiOdds.length - 1;

                return (
                  <tr
                    key={bm.name}
                    className="hover:bg-white/5 transition-colors"
                    style={{ borderBottom: isLastRow ? "none" : "1px solid var(--border)" }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {bm.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-bold ${bm.home === bestHome ? "text-base" : ""}`}
                        style={{ color: bm.home === bestHome ? "var(--accent)" : "var(--text-primary)" }}
                      >
                        {bm.home.toFixed(2)}
                        {bm.home === bestHome && (
                          <span className="ml-1 text-xs" style={{ color: "var(--accent)" }}>★</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-bold`}
                        style={{ color: bm.draw === bestDraw ? "var(--warning)" : "var(--text-primary)" }}
                      >
                        {bm.draw.toFixed(2)}
                        {bm.draw === bestDraw && (
                          <span className="ml-1 text-xs" style={{ color: "var(--warning)" }}>★</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-bold`}
                        style={{ color: bm.away === bestAway ? "#00b0ff" : "var(--text-primary)" }}
                      >
                        {bm.away.toFixed(2)}
                        {bm.away === bestAway && (
                          <span className="ml-1 text-xs" style={{ color: "#00b0ff" }}>★</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: parseFloat(margin) < 5 ? "rgba(0,230,118,0.1)" : "rgba(136,153,187,0.1)",
                          color: parseFloat(margin) < 5 ? "var(--accent)" : "var(--text-secondary)",
                        }}
                      >
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            ★ = Melhor odd disponível. Margem = overround da casa de apostas.
          </p>
        </div>
      </div>

      {/* Best odds summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: `Melhor odd — ${homeTeam.shortName}`, value: bestHome, color: "var(--accent)" },
          { label: "Melhor odd — Empate", value: bestDraw, color: "var(--warning)" },
          { label: `Melhor odd — ${awayTeam.shortName}`, value: bestAway, color: "#00b0ff" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl p-3 border text-center"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="text-xs mb-1 leading-tight" style={{ color: "var(--text-secondary)" }}>{item.label}</p>
            <p className="text-xl font-black" style={{ color: item.color }}>{item.value.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
