"use client";

import type { Lineup, Team } from "@/lib/mock-data";

interface Props {
  homeLineup: Lineup;
  awayLineup: Lineup;
  homeTeam: Team;
  awayTeam: Team;
}

function PlayerDot({ player, side }: { player: { number: number; name: string; captain?: boolean; yellow?: boolean; red?: boolean }; side: "home" | "away" }) {
  const accent = side === "home" ? "var(--accent)" : "#00b0ff";

  return (
    <div className="flex flex-col items-center gap-1 group">
      <div
        className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${accent}20`, borderColor: accent, color: accent }}
      >
        {player.number}
        {player.captain && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-yellow-500 text-black text-[8px] flex items-center justify-center font-black">
            C
          </span>
        )}
        {player.yellow && (
          <span className="absolute -top-1 -left-1 w-3 h-3.5 rounded-sm bg-yellow-400" />
        )}
        {player.red && (
          <span className="absolute -top-1 -left-1 w-3 h-3.5 rounded-sm bg-red-500" />
        )}
      </div>
      <span className="text-[10px] font-medium text-center leading-tight max-w-[56px] truncate" style={{ color: "var(--text-secondary)" }}>
        {player.name.split(" ").slice(-1)[0]}
      </span>
    </div>
  );
}

function PitchHalf({ lineup, team, side }: { lineup: Lineup; team: Team; side: "home" | "away" }) {
  // Agrupa jogadores por linha do grid
  const rows: Record<string, typeof lineup.startXI> = {};
  for (const p of lineup.startXI) {
    const row = p.grid?.split(":")?.[0] ?? "1";
    if (!rows[row]) rows[row] = [];
    rows[row].push(p);
  }

  const sortedRows = Object.keys(rows)
    .sort((a, b) => Number(a) - Number(b))
    // para o lado "away" (direita), invertemos a ordem das linhas
    .sort((a, b) => side === "away" ? Number(b) - Number(a) : Number(a) - Number(b));

  const accent = side === "home" ? "var(--accent)" : "#00b0ff";

  return (
    <div className="flex-1 flex flex-col justify-around py-3 px-2 gap-2">
      {/* Formation badge */}
      <div className="flex justify-center">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          {lineup.formation}
        </span>
      </div>

      {sortedRows.map((rowKey) => (
        <div key={rowKey} className="flex justify-around items-center">
          {rows[rowKey].map((player) => (
            <PlayerDot key={player.number} player={player} side={side} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function LineupView({ homeLineup, awayLineup, homeTeam, awayTeam }: Props) {
  return (
    <div className="space-y-4">
      {/* Pitch */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div
          className="relative flex"
          style={{
            background: "linear-gradient(90deg, rgba(0,230,118,0.04) 0%, rgba(0,176,255,0.04) 100%)",
            minHeight: 320,
          }}
        >
          {/* Campo lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-px h-full bg-white/5" />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/5 pointer-events-none" />

          {/* Team labels */}
          <div className="absolute top-3 left-4">
            <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{homeTeam.shortName}</span>
          </div>
          <div className="absolute top-3 right-4">
            <span className="text-xs font-bold" style={{ color: "#00b0ff" }}>{awayTeam.shortName}</span>
          </div>

          <PitchHalf lineup={homeLineup} team={homeTeam} side="home" />
          <PitchHalf lineup={awayLineup} team={awayTeam} side="away" />
        </div>
      </div>

      {/* Substitutes */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { lineup: homeLineup, team: homeTeam, side: "home" as const },
          { lineup: awayLineup, team: awayTeam, side: "away" as const },
        ].map(({ lineup, team, side }) => (
          <div
            key={team.id}
            className="rounded-2xl p-4 border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="text-xs font-bold mb-3" style={{ color: "var(--text-secondary)" }}>
              RESERVAS — {team.shortName}
            </p>
            <div className="space-y-2">
              {lineup.substitutes.map((p) => (
                <div key={p.number} className="flex items-center gap-2.5">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: side === "home" ? "rgba(0,230,118,0.1)" : "rgba(0,176,255,0.1)",
                      color: side === "home" ? "var(--accent)" : "#00b0ff",
                    }}
                  >
                    {p.number}
                  </span>
                  <span className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{p.name}</span>
                  <span className="text-xs ml-auto" style={{ color: "var(--text-secondary)" }}>{p.pos}</span>
                  {p.yellow && <span className="w-2.5 h-3.5 rounded-sm bg-yellow-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
