"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Match } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import TeamBadge from "@/components/TeamBadge";

function BetScore({ score }: { score: number }) {
  const color =
    score >= 80 ? "var(--accent)" : score >= 60 ? "var(--warning)" : "var(--text-secondary)";
  const label = score >= 80 ? "Alto" : score >= 60 ? "Médio" : "Baixo";

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
        style={{ borderColor: color, color }}
      >
        {score}
      </div>
      <div>
        <p className="text-xs font-semibold" style={{ color }}>
          {label}
        </p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Apostabilidade
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ match }: { match: Match }) {
  if (match.status === "live") {
    return (
      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,68,68,0.15)", color: "var(--live)" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live" />
        AO VIVO {match.minute}&apos;
      </span>
    );
  }
  if (match.status === "halftime") {
    return (
      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,167,38,0.15)", color: "var(--warning)" }}>
        INTERVALO
      </span>
    );
  }
  if (match.status === "finished") {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(136,153,187,0.15)", color: "var(--text-secondary)" }}>
        ENCERRADO
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(136,153,187,0.1)", color: "var(--text-secondary)" }}>
      <Clock size={10} />
      {match.time}
    </span>
  );
}

export default function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "live" || match.status === "halftime";
  const isFinished = match.status === "finished";

  return (
    <Link href={`/partida/${match.id}`}>
      <div
        className={cn(
          "rounded-2xl p-4 border transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer group",
          isLive && "ring-1"
        )}
        style={{
          backgroundColor: "var(--surface)",
          borderColor: isLive ? "rgba(255,68,68,0.3)" : "var(--border)",
          boxShadow: isLive ? "0 0 20px rgba(255,68,68,0.05)" : undefined,
          ...(isLive && { "--tw-ring-color": "rgba(255,68,68,0.2)" } as object),
        }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">{match.league.logo}</span>
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              {match.league.name}
            </span>
          </div>
          <StatusBadge match={match} />
        </div>

        {/* Teams & Score */}
        <div className="flex items-center gap-3 mb-4">
          {/* Home */}
          <div className="flex-1 flex flex-col items-start gap-2">
            <TeamBadge team={match.homeTeam} size="md" />
            <span className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center">
            {match.score !== undefined ? (
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-bold w-8 text-center"
                  style={{ color: match.score.home > match.score.away ? "var(--accent)" : isFinished && match.score.home < match.score.away ? "var(--live)" : "var(--text-primary)" }}
                >
                  {match.score.home}
                </span>
                <span className="text-lg font-light" style={{ color: "var(--text-secondary)" }}>-</span>
                <span
                  className="text-2xl font-bold w-8 text-center"
                  style={{ color: match.score.away > match.score.home ? "var(--accent)" : isFinished && match.score.away < match.score.home ? "var(--live)" : "var(--text-primary)" }}
                >
                  {match.score.away}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>VS</span>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-end gap-2">
            <TeamBadge team={match.awayTeam} size="md" />
            <span className="text-sm font-semibold leading-tight text-right" style={{ color: "var(--text-primary)" }}>
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Bottom row — Odds + BetScore */}
        <div
          className="pt-3 flex items-center justify-between border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Odds */}
          <div className="flex gap-2">
            {[
              { label: "1", value: match.odds.home, type: "home" },
              { label: "X", value: match.odds.draw, type: "draw" },
              { label: "2", value: match.odds.away, type: "away" },
            ].map((odd) => (
              <div
                key={odd.label}
                className="flex flex-col items-center px-2.5 py-1.5 rounded-lg"
                style={{
                  backgroundColor: match.valueBet === odd.type ? "rgba(0,230,118,0.1)" : "var(--surface-2)",
                  border: `1px solid ${match.valueBet === odd.type ? "rgba(0,230,118,0.3)" : "transparent"}`,
                }}
              >
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {odd.label}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: match.valueBet === odd.type ? "var(--accent)" : "var(--text-primary)" }}
                >
                  {odd.value.toFixed(2)}
                </span>
                {match.valueBet === odd.type && (
                  <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>VALUE</span>
                )}
              </div>
            ))}
          </div>

          <BetScore score={match.betScore} />
        </div>
      </div>
    </Link>
  );
}
