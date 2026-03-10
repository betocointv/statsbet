import { getLeagueMatches } from "@/lib/data-service";
import { leagues } from "@/lib/mock-data";
import MatchCard from "@/components/MatchCard";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import type { APIStanding } from "@/lib/api-football";

export const revalidate = 120;

export function generateStaticParams() {
  return leagues.map((l) => ({ slug: l.id }));
}

function StandingsTable({ standings, leagueName }: { standings: APIStanding[]; leagueName: string }) {
  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="p-4 border-b flex items-center gap-2"
        style={{ borderColor: "var(--border)" }}>
        <Trophy size={16} style={{ color: "var(--accent)" }} />
        <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          Classificação — {leagueName}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["#", "Time", "P", "J", "V", "E", "D", "GP", "GC", "SG", "Forma"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold"
                  style={{ color: "var(--text-secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr key={s.team.id}
                className="transition-colors hover:bg-white/5"
                style={{ borderBottom: i < standings.length - 1 ? "1px solid var(--border)" : undefined }}>
                <td className="px-3 py-2.5">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: s.rank <= 4 ? "rgba(0,230,118,0.15)" : s.rank <= 6 ? "rgba(0,176,255,0.15)" : s.rank >= standings.length - 2 ? "rgba(255,68,68,0.15)" : "transparent",
                      color: s.rank <= 4 ? "var(--accent)" : s.rank <= 6 ? "#00b0ff" : s.rank >= standings.length - 2 ? "var(--live)" : "var(--text-secondary)",
                    }}>
                    {s.rank}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {s.team.logo && (
                      <img src={s.team.logo} alt={s.team.name} className="w-5 h-5 object-contain" />
                    )}
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>{s.team.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 font-bold" style={{ color: "var(--accent)" }}>{s.points}</td>
                <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>{s.all.played}</td>
                <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>{s.all.win}</td>
                <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>{s.all.draw}</td>
                <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>{s.all.lose}</td>
                <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>{s.all.goals.for}</td>
                <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>{s.all.goals.against}</td>
                <td className="px-3 py-2.5" style={{ color: s.goalsDiff > 0 ? "var(--accent)" : s.goalsDiff < 0 ? "var(--live)" : "var(--text-secondary)" }}>
                  {s.goalsDiff > 0 ? `+${s.goalsDiff}` : s.goalsDiff}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-0.5">
                    {s.form?.split("").slice(-5).map((r, i) => (
                      <span key={i} className="w-4 h-4 rounded-sm flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: r === "W" ? "rgba(0,230,118,0.2)" : r === "L" ? "rgba(255,68,68,0.2)" : "rgba(136,153,187,0.2)",
                          color: r === "W" ? "var(--accent)" : r === "L" ? "var(--live)" : "var(--text-secondary)",
                        }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function LeaguePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const league = leagues.find((l) => l.id === slug);
  if (!league) notFound();

  const { matches, standings } = await getLeagueMatches(slug);
  const liveMatches      = matches.filter((m) => m.status === "live" || m.status === "halftime");
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");
  const finishedMatches  = matches.filter((m) => m.status === "finished");

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline"
        style={{ color: "var(--text-secondary)" }}>
        <ArrowLeft size={14} /> Voltar
      </Link>

      {/* Header */}
      <div className="rounded-2xl p-5 border flex items-center gap-4"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <span className="text-4xl">{league.logo}</span>
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>{league.name}</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{league.country} • {matches.length} partidas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Partidas */}
        <div className="lg:col-span-2 space-y-4">
          {liveMatches.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full animate-pulse-live" style={{ backgroundColor: "var(--live)" }} />
                <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Ao Vivo</h2>
              </div>
              <div className="space-y-3">
                {liveMatches.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}

          {scheduledMatches.length > 0 && (
            <section>
              <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>Próximas</h2>
              <div className="space-y-3">
                {scheduledMatches.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}

          {finishedMatches.length > 0 && (
            <section>
              <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>Resultados</h2>
              <div className="space-y-3">
                {finishedMatches.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </section>
          )}

          {matches.length === 0 && (
            <div className="rounded-2xl p-12 border text-center"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-3xl mb-3">⚽</p>
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Nenhuma partida hoje</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Confira a classificação ao lado</p>
            </div>
          )}
        </div>

        {/* Classificação */}
        <div className="lg:col-span-1">
          {standings && standings.length > 0 ? (
            <StandingsTable standings={standings} leagueName={league.name} />
          ) : (
            <div className="rounded-2xl p-5 border text-center"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <Trophy size={24} className="mx-auto mb-2" style={{ color: "var(--text-secondary)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Classificação</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                Disponível com API-Football ativa
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
