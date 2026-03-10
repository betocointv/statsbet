import { getMatchDetails } from "@/lib/data-service";
import { notFound } from "next/navigation";
import { Clock, TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TeamBadge from "@/components/TeamBadge";
import MatchTabs from "@/components/MatchTabs";

export const revalidate = 60;

function OddPill({ label, value, isValue }: { label: string; value: number; isValue?: boolean }) {
  return (
    <div
      className="flex-1 flex flex-col items-center py-3 rounded-2xl border transition-all"
      style={{
        backgroundColor: isValue ? "rgba(0,230,118,0.08)" : "var(--surface-2)",
        borderColor: isValue ? "rgba(0,230,118,0.4)" : "var(--border)",
      }}
    >
      <span className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span className="text-xl font-bold" style={{ color: isValue ? "var(--accent)" : "var(--text-primary)" }}>
        {value.toFixed(2)}
      </span>
      {isValue && (
        <span className="text-xs font-bold mt-1" style={{ color: "var(--accent)" }}>VALUE BET</span>
      )}
    </div>
  );
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatchDetails(id);
  if (!match) notFound();

  const isLive = match.status === "live" || match.status === "halftime";
  const betColor =
    match.betScore >= 80 ? "var(--accent)" : match.betScore >= 60 ? "var(--warning)" : "var(--text-secondary)";

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--text-secondary)" }}>
        <ArrowLeft size={14} /> Voltar
      </Link>

      {/* Match Header */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: "var(--surface)", borderColor: isLive ? "rgba(255,68,68,0.3)" : "var(--border)" }}
      >
        {/* League + Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span>{match.league.logo}</span>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{match.league.name}</span>
          </div>
          {isLive ? (
            <span className="flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,68,68,0.15)", color: "var(--live)" }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-live" />
              AO VIVO {match.minute}&apos;
            </span>
          ) : match.status === "finished" ? (
            <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(136,153,187,0.1)", color: "var(--text-secondary)" }}>
              ENCERRADO
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(136,153,187,0.1)", color: "var(--text-secondary)" }}>
              <Clock size={12} />
              {match.time}
            </span>
          )}
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex flex-col items-center gap-3">
            <TeamBadge team={match.homeTeam} size="xl" />
            <span className="text-lg font-bold text-center" style={{ color: "var(--text-primary)" }}>{match.homeTeam.name}</span>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Casa</span>
          </div>

          <div className="flex flex-col items-center">
            {match.score ? (
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black" style={{ color: "var(--text-primary)" }}>{match.score.home}</span>
                <span className="text-2xl font-light" style={{ color: "var(--text-secondary)" }}>-</span>
                <span className="text-5xl font-black" style={{ color: "var(--text-primary)" }}>{match.score.away}</span>
              </div>
            ) : (
              <span className="text-3xl font-bold" style={{ color: "var(--text-secondary)" }}>VS</span>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center gap-3">
            <TeamBadge team={match.awayTeam} size="xl" />
            <span className="text-lg font-bold text-center" style={{ color: "var(--text-primary)" }}>{match.awayTeam.name}</span>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Fora</span>
          </div>
        </div>

        {/* BetScore */}
        <div className="mt-6 p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-2" style={{ borderColor: betColor, color: betColor }}>
              {match.betScore}
            </div>
            <div>
              <p className="font-bold" style={{ color: betColor }}>
                {match.betScore >= 80 ? "Alta" : match.betScore >= 60 ? "Média" : "Baixa"} Apostabilidade
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Score calculado por análise de dados históricos
              </p>
            </div>
          </div>
          {match.valueBet && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.3)" }}>
              <TrendingUp size={14} style={{ color: "var(--accent)" }} />
              <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>VALUE BET</span>
            </div>
          )}
        </div>
      </div>

      {/* Odds rápidas */}
      <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>Odds</h3>
        <div className="flex gap-2">
          <OddPill label={match.homeTeam.shortName} value={match.odds.home} isValue={match.valueBet === "home"} />
          <OddPill label="Empate"                   value={match.odds.draw} isValue={match.valueBet === "draw"} />
          <OddPill label={match.awayTeam.shortName} value={match.odds.away} isValue={match.valueBet === "away"} />
        </div>
      </div>

      {/* Árbitro */}
      {match.referee && (
        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>Árbitro</p>
              <p className="font-bold" style={{ color: "var(--text-primary)" }}>{match.referee.name}</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{match.referee.country}</p>
            </div>
            <div className="flex gap-3">
              {[
                { label: "Amarelos/j", value: match.referee.avgYellowCards.toFixed(1), color: "var(--warning)" },
                { label: "Faltas/j",   value: match.referee.avgFouls.toFixed(1),       color: "var(--text-secondary)" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Abas — Stats / Escalação / H2H / Odds */}
      <MatchTabs match={match} />
    </div>
  );
}
