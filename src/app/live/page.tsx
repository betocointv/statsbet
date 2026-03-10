import { getLiveMatches } from "@/lib/mock-data";
import MatchCard from "@/components/MatchCard";

export default function LivePage() {
  const liveMatches = getLiveMatches();

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full animate-pulse-live" style={{ backgroundColor: "var(--live)" }} />
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Partidas Ao Vivo</h1>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-bold"
          style={{ backgroundColor: "rgba(255,68,68,0.15)", color: "var(--live)" }}
        >
          {liveMatches.length} ao vivo
        </span>
      </div>

      {liveMatches.length === 0 ? (
        <div
          className="rounded-2xl p-12 border text-center"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <p className="text-4xl mb-3">⚽</p>
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Nenhuma partida ao vivo no momento</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Volte mais tarde ou explore as próximas partidas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {liveMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
