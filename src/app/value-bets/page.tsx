import { getTodayMatches } from "@/lib/data-service";
import { TrendingUp } from "lucide-react";
import ValueBetsClient from "./ValueBetsClient";

export const revalidate = 60;

export default async function ValueBetsPage() {
  const allMatches = await getTodayMatches();
  const valueBets = allMatches.filter((m) => m.valueBet);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp size={22} style={{ color: "var(--accent)" }} />
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Value Bets
          </h1>
        </div>
        <span
          className="text-xs px-3 py-1 rounded-full font-bold"
          style={{ backgroundColor: "rgba(0,230,118,0.15)", color: "var(--accent)" }}
        >
          {valueBets.length} análises hoje
        </span>
      </div>

      {/* Explanation */}
      <div
        className="rounded-2xl p-4 border"
        style={{ backgroundColor: "var(--surface)", borderColor: "rgba(0,230,118,0.2)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
          O que é um Value Bet? (análise estatística)
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Um value bet é identificado quando a probabilidade real de um resultado — calculada a partir de dados históricos e estatísticas — é maior do que a probabilidade implícita nas odds disponíveis. É uma informação analítica, não uma recomendação de aposta.
        </p>
      </div>

      {/* Client component que verifica plano */}
      <ValueBetsClient valueBets={valueBets} />
    </div>
  );
}
