"use client";

import { useState } from "react";
import type { Match, TeamSeasonStats } from "@/lib/mock-data";
import MultiOddsTable from "./MultiOddsTable";
import ProGate from "./ProGate";

// ─── Helpers ────────────────────────────────────────────────────────────────
function FormBadge({ result }: { result: "W" | "D" | "L" }) {
  const map = {
    W: { label: "V", color: "var(--accent)", bg: "rgba(0,230,118,0.15)" },
    D: { label: "E", color: "var(--warning)", bg: "rgba(255,160,0,0.15)" },
    L: { label: "D", color: "#ff4444", bg: "rgba(255,68,68,0.15)" },
  };
  const s = map[result];
  return (
    <span
      className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-black"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function StatRow({
  label, homeVal, awayVal, unit = "", higherIsBetter = true,
}: {
  label: string; homeVal: number; awayVal: number; unit?: string; higherIsBetter?: boolean;
}) {
  const total = homeVal + awayVal || 1;
  const homePct = Math.round((homeVal / total) * 100);
  const homeWins = higherIsBetter ? homeVal >= awayVal : homeVal <= awayVal;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-bold w-14" style={{ color: homeWins ? "var(--accent)" : "var(--text-primary)" }}>
          {homeVal}{unit}
        </span>
        <span className="flex-1 text-center" style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="font-bold w-14 text-right" style={{ color: !homeWins ? "#00b0ff" : "var(--text-primary)" }}>
          {awayVal}{unit}
        </span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
        <div className="rounded-l-full" style={{ width: `${homePct}%`, backgroundColor: "var(--accent)" }} />
        <div className="rounded-r-full" style={{ width: `${100 - homePct}%`, backgroundColor: "#00b0ff" }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl p-3 text-center border" style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}>
      <p className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{label}</p>
      {sub && <p className="text-xs mt-0.5 font-semibold" style={{ color: "var(--accent)" }}>{sub}</p>}
    </div>
  );
}

// ─── Visão Geral ─────────────────────────────────────────────────────────────
function VisaoGeralTab({ match }: { match: Match }) {
  const ts = match.teamStats;
  return (
    <div className="space-y-4">
      {ts && (
        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-secondary)" }}>
            Forma Recente (últimos 5 jogos)
          </h3>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{match.homeTeam.shortName}</span>
              <div className="flex gap-1">{ts.home.form.map((r, i) => <FormBadge key={i} result={r} />)}</div>
            </div>
            <span className="text-xl">🆚</span>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{match.awayTeam.shortName}</span>
              <div className="flex gap-1">{ts.away.form.map((r, i) => <FormBadge key={i} result={r} />)}</div>
            </div>
          </div>
        </div>
      )}

      {ts && (
        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Comparação na Temporada</h3>
            <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />{match.homeTeam.shortName}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00b0ff" }} />{match.awayTeam.shortName}</span>
            </div>
          </div>
          <div className="space-y-4">
            <StatRow label="Posse de Bola (média)"    homeVal={ts.home.avgPossession}    awayVal={ts.away.avgPossession}    unit="%" />
            <StatRow label="Gols Marcados (média)"    homeVal={ts.home.avgGoalsScored}   awayVal={ts.away.avgGoalsScored} />
            <StatRow label="Gols Sofridos (média)"    homeVal={ts.home.avgGoalsConceded} awayVal={ts.away.avgGoalsConceded} higherIsBetter={false} />
            <StatRow label="Escanteios (média)"       homeVal={ts.home.avgCorners}       awayVal={ts.away.avgCorners} />
            <StatRow label="Chutes a Gol (média)"     homeVal={ts.home.avgShotsOnTarget} awayVal={ts.away.avgShotsOnTarget} />
            <StatRow label="Cartões Amarelos (média)" homeVal={ts.home.avgYellowCards}   awayVal={ts.away.avgYellowCards}   higherIsBetter={false} />
          </div>
        </div>
      )}

      {match.referee && (
        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-secondary)" }}>🟨 Árbitro</h3>
          <div className="mb-4">
            <p className="font-bold" style={{ color: "var(--text-primary)" }}>{match.referee.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {match.referee.country} · {match.referee.totalGames} jogos na temporada
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatCard label="Amarelos/jogo"  value={match.referee.avgYellowCards.toFixed(1)} />
            <StatCard label="Vermelhos/jogo" value={match.referee.avgRedCards.toFixed(2)} />
            <StatCard label="Faltas/jogo"    value={match.referee.avgFouls.toFixed(1)} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Casa Vence", pct: match.referee.homeWinPct, color: "var(--accent)" },
              { label: "Empate",     pct: match.referee.drawPct,    color: "var(--warning)" },
              { label: "Fora Vence", pct: match.referee.awayWinPct, color: "#00b0ff" },
            ].map(({ label, pct, color }) => (
              <div key={label} className="rounded-xl p-3 border text-center" style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}>
                <p className="text-lg font-black" style={{ color }}>{pct}%</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {match.stats && (
        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "var(--surface)", borderColor: "rgba(255,68,68,0.3)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--live)" }}>Estatísticas ao Vivo</h3>
          </div>
          <div className="space-y-4">
            <StatRow label="Posse de Bola"    homeVal={match.stats.possession.home}    awayVal={match.stats.possession.away}    unit="%" />
            <StatRow label="xG"               homeVal={match.stats.xG.home}            awayVal={match.stats.xG.away} />
            <StatRow label="Finalizações"     homeVal={match.stats.shots.home}         awayVal={match.stats.shots.away} />
            <StatRow label="Chutes a Gol"     homeVal={match.stats.shotsOnTarget.home} awayVal={match.stats.shotsOnTarget.away} />
            <StatRow label="Escanteios"       homeVal={match.stats.corners.home}       awayVal={match.stats.corners.away} />
            <StatRow label="Faltas"           homeVal={match.stats.fouls.home}         awayVal={match.stats.fouls.away}         higherIsBetter={false} />
            <StatRow label="Cartões Amarelos" homeVal={match.stats.yellowCards.home}   awayVal={match.stats.yellowCards.away}   higherIsBetter={false} />
          </div>
        </div>
      )}

      {!ts && !match.stats && (
        <div className="rounded-2xl p-8 border text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <p className="text-2xl mb-2">📊</p>
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Estatísticas não disponíveis</p>
        </div>
      )}
    </div>
  );
}

// ─── Times Tab ───────────────────────────────────────────────────────────────
function TeamStatsPanel({ stats, teamName, isHome }: { stats: TeamSeasonStats; teamName: string; isHome: boolean }) {
  const color = isHome ? "var(--accent)" : "#00b0ff";
  const winPct = Math.round((stats.wins / stats.gamesPlayed) * 100);
  return (
    <div className="rounded-2xl p-5 border space-y-5" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>{teamName}</h3>
        <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ backgroundColor: isHome ? "rgba(0,230,118,0.1)" : "rgba(0,176,255,0.1)", color }}>
          {isHome ? "Casa" : "Fora"}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Jogos"    value={String(stats.gamesPlayed)} />
        <StatCard label="Vitórias" value={String(stats.wins)} sub={`${winPct}%`} />
        <StatCard label="Empates"  value={String(stats.draws)} />
        <StatCard label="Derrotas" value={String(stats.losses)} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Gols</p>
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Marcados"    value={String(stats.goalsScored)}   sub={`${stats.avgGoalsScored.toFixed(2)}/jogo`} />
          <StatCard label="Sofridos"    value={String(stats.goalsConceded)} sub={`${stats.avgGoalsConceded.toFixed(2)}/jogo`} />
          <StatCard label="Clean Sheet" value={String(stats.cleanSheets)} />
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Médias por Jogo</p>
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Escanteios"   value={stats.avgCorners.toFixed(1)} />
          <StatCard label="Cartão Amar." value={stats.avgYellowCards.toFixed(1)} />
          <StatCard label="Cartão Verm." value={stats.avgRedCards.toFixed(2)} />
          <StatCard label="Chutes a Gol" value={stats.avgShotsOnTarget.toFixed(1)} />
          <StatCard label="Finalizações" value={stats.avgShotsTotal.toFixed(1)} />
          <StatCard label="Impedimentos" value={stats.avgOffsides.toFixed(1)} />
          <StatCard label="Tiro de Meta" value={stats.avgGoalKicks.toFixed(1)} />
          <StatCard label="Laterais"     value={stats.avgThrowIns.toFixed(1)} />
          <StatCard label="Faltas"       value={stats.avgFouls.toFixed(1)} />
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Divisão Casa / Fora</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Em Casa", split: stats.home },
            { label: "Fora",    split: stats.away },
          ].map(({ label, split }) => (
            <div key={label} className="rounded-xl p-3 border" style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}>
              <p className="text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>{label} ({split.gamesPlayed}J)</p>
              <div className="space-y-1 text-xs">
                {[
                  [`${split.wins}V ${split.draws}E ${split.losses}D`, "Resultado"],
                  [`${split.avgGoalsScored.toFixed(1)} / ${split.avgGoalsConceded.toFixed(1)}`, "Gols M/S"],
                  [`${split.avgCorners.toFixed(1)}`, "Escanteios"],
                  [`${split.over25Pct}%`, "Over 2.5"],
                  [`${split.btts}%`, "Ambas Marcam"],
                ].map(([val, lbl]) => (
                  <div key={lbl} className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>{lbl}</span>
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimesTab({ match }: { match: Match }) {
  if (!match.teamStats) {
    return (
      <div className="rounded-2xl p-8 border text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <p className="text-2xl mb-2">📋</p>
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Dados da temporada não disponíveis</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <TeamStatsPanel stats={match.teamStats.home} teamName={match.homeTeam.name} isHome={true} />
      <TeamStatsPanel stats={match.teamStats.away} teamName={match.awayTeam.name} isHome={false} />
    </div>
  );
}

// ─── Escalação Tab ───────────────────────────────────────────────────────────
function EscalacaoTab({ match }: { match: Match }) {
  const [side, setSide] = useState<"home" | "away">("home");
  const pl = match.probableLineups;

  if (!pl) {
    return (
      <div className="rounded-2xl p-8 border text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <p className="text-2xl mb-2">⚽</p>
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Escalações não disponíveis</p>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Dados disponíveis 24h antes da partida</p>
      </div>
    );
  }

  const lineup = side === "home" ? pl.home : pl.away;
  const team   = side === "home" ? match.homeTeam : match.awayTeam;
  const color  = side === "home" ? "var(--accent)" : "#00b0ff";

  const gks  = lineup.startXI.filter(p => p.pos === "GK");
  const defs = lineup.startXI.filter(p => p.pos === "D");
  const mids = lineup.startXI.filter(p => p.pos === "M");
  const fwds = lineup.startXI.filter(p => p.pos === "F");

  return (
    <div className="space-y-4">
      {/* Seletor de time */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
        {(["home", "away"] as const).map(s => {
          const t = s === "home" ? match.homeTeam : match.awayTeam;
          const c = s === "home" ? "var(--accent)" : "#00b0ff";
          return (
            <button
              key={s}
              onClick={() => setSide(s)}
              className="flex-1 py-2 text-xs font-semibold rounded-xl transition-all"
              style={{
                backgroundColor: side === s ? "var(--surface-2)" : "transparent",
                color: side === s ? c : "var(--text-secondary)",
              }}
            >
              {t.shortName} ({s === "home" ? "Casa" : "Fora"})
            </button>
          );
        })}
      </div>

      {/* Campo */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}>
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{team.name}</span>
          <span className="text-sm font-black px-3 py-1 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
            {lineup.formation}
          </span>
        </div>
        <div
          className="py-6 px-4"
          style={{ background: "linear-gradient(180deg, rgba(0,100,50,0.2) 0%, rgba(0,60,30,0.08) 100%)" }}
        >
          {/* Linha do meio */}
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-px opacity-10" style={{ backgroundColor: "var(--text-primary)" }} />
          </div>
          {/* Fileiras: Ataque → Meio → Defesa → Goleiro */}
          {[
            { players: fwds, label: "Ataque" },
            { players: mids, label: "Meio" },
            { players: defs, label: "Defesa" },
            { players: gks,  label: "Goleiro" },
          ].filter(row => row.players.length > 0).map(({ players, label }) => (
            <div key={label} className="flex justify-around items-center mb-6 last:mb-0">
              {players.map(p => (
                <div key={p.name} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2"
                    style={{ backgroundColor: `${color}20`, borderColor: color, color }}
                  >
                    {p.number ?? p.name.charAt(0)}
                  </div>
                  <span className="text-xs text-center leading-tight" style={{ color: "var(--text-primary)", maxWidth: 64 }}>
                    {p.name.split(" ").slice(-1)[0]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Desfalques */}
      {lineup.out.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="px-4 py-3 border-b" style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}>
            <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              🚑 Desfalques ({lineup.out.length})
            </span>
          </div>
          {lineup.out.map((p, i) => {
            const isSusp  = p.reason.toLowerCase().includes("suspenso");
            const isInj   = p.reason.toLowerCase().includes("les");
            const badgeColor = isSusp ? "#ff4444" : isInj ? "var(--warning)" : "var(--text-secondary)";
            const badge      = isSusp ? "Suspenso" : isInj ? "Lesionado" : "Dúvida";
            return (
              <div
                key={p.name}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < lineup.out.length - 1 ? "1px solid var(--border)" : undefined }}
              >
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{p.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{p.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}>
                    {badge}
                  </span>
                  {p.returnDate && (
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {p.returnDate === "Indefinido"
                        ? "Retorno indefinido"
                        : `Retorno: ${new Date(p.returnDate).toLocaleDateString("pt-BR")}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Mercados Tab ────────────────────────────────────────────────────────────
type MarketRow = { label: string; home: string; away: string };

function MarketCard({ title, icon, rows, highlight }: { title: string; icon: string; rows: MarketRow[]; highlight?: string }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}>
        <span className="text-base">{icon}</span>
        <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{title}</span>
        {highlight && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "rgba(0,230,118,0.15)", color: "var(--accent)" }}>
            {highlight}
          </span>
        )}
      </div>
      <div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center px-4 py-2.5 text-sm"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : undefined }}
          >
            <span className="font-semibold" style={{ color: "var(--accent)" }}>{row.home}</span>
            <span className="text-center text-xs" style={{ color: "var(--text-secondary)" }}>{row.label}</span>
            <span className="font-semibold text-right" style={{ color: "#00b0ff" }}>{row.away}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// helpers para projeção aproximada over/under
function overProb(projected: number, line: number, factor: number, min = 10, max = 90) {
  return Math.min(max, Math.max(min, Math.round(50 + (projected - line) * factor)));
}

function MercadosTab({ match }: { match: Match }) {
  const ts = match.teamStats;
  if (!ts) {
    return (
      <div className="rounded-2xl p-8 border text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <p className="text-2xl mb-2">📈</p>
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Dados de mercado não disponíveis</p>
      </div>
    );
  }

  const h = ts.home;
  const a = ts.away;

  // Taxas de resultado
  const hWinPct  = Math.round((h.wins  / h.gamesPlayed) * 100);
  const aWinPct  = Math.round((a.wins  / a.gamesPlayed) * 100);
  const hDrawPct = Math.round((h.draws / h.gamesPlayed) * 100);
  const aDrawPct = Math.round((a.draws / a.gamesPlayed) * 100);
  const hLossPct = 100 - hWinPct - hDrawPct;
  const aLossPct = 100 - aWinPct - aDrawPct;

  const hWinHome  = Math.round((h.home.wins  / h.home.gamesPlayed) * 100);
  const aWinAway  = Math.round((a.away.wins  / a.away.gamesPlayed) * 100);
  const hDrawHome = Math.round((h.home.draws / h.home.gamesPlayed) * 100);
  const aDrawAway = Math.round((a.away.draws / a.away.gamesPlayed) * 100);

  // Dupla Chance
  const dc1X_h = hWinHome + hDrawHome;
  const dcX2_a = aWinAway + aDrawAway;
  const dc12_h = 100 - hDrawHome;
  const dc12_a = 100 - aDrawAway;
  const dcX2_h = 100 - hWinHome;
  const dc1X_a = 100 - aWinAway;

  // Projeção de gols
  const homeXG = (h.avgGoalsScored + a.avgGoalsConceded) / 2;
  const awayXG = (a.avgGoalsScored + h.avgGoalsConceded) / 2;
  const totalXG = homeXG + awayXG;

  const over15Comb = Math.round((h.over15Pct + a.over15Pct) / 2);
  const over25Comb = Math.round((h.over25Pct + a.over25Pct) / 2);
  const over35Comb = Math.round((h.over35Pct + a.over35Pct) / 2);
  const over05Comb = Math.min(99, over15Comb + 12);
  const over45Comb = Math.max(5, over35Comb - 20);

  // BTTS
  const bttsComb = Math.round((h.btts + a.btts) / 2);

  // 1º Tempo
  const fhGoalsH = (h.avgGoalsScored * 0.45).toFixed(2);
  const fhGoalsA = (a.avgGoalsScored * 0.45).toFixed(2);
  const fhTotal  = (totalXG * 0.45).toFixed(2);
  const fhOver05 = Math.min(80, Math.max(25, Math.round(over15Comb * 0.75)));
  const fhOver15 = Math.min(60, Math.max(10, Math.round(over25Comb * 0.55)));

  // Escanteios
  const projCorners = h.avgCorners + a.avgCorners;
  const c85 = overProb(projCorners, 8.5, 10, 20, 92);
  const c95 = overProb(projCorners, 9.5, 10, 15, 88);
  const c105 = overProb(projCorners, 10.5, 10, 10, 82);
  const c115 = overProb(projCorners, 11.5, 10, 8, 75);

  // Cartões
  const projYellow = h.avgYellowCards + a.avgYellowCards;
  const y35 = overProb(projYellow, 3.5, 15, 20, 90);
  const y45 = overProb(projYellow, 4.5, 15, 15, 85);
  const y55 = overProb(projYellow, 5.5, 15, 10, 78);
  const projRed  = +(h.avgRedCards + a.avgRedCards).toFixed(2);
  const red05 = Math.min(45, Math.max(5, Math.round(projRed * 45)));

  // Faltas
  const projFouls = +(h.avgFouls + a.avgFouls).toFixed(1);
  const f265 = overProb(+projFouls, 26.5, 5, 20, 88);
  const f295 = overProb(+projFouls, 29.5, 5, 15, 82);
  const f325 = overProb(+projFouls, 32.5, 5, 10, 75);

  // Impedimentos
  const projOffsides = +(h.avgOffsides + a.avgOffsides).toFixed(1);
  const o35 = overProb(+projOffsides, 3.5, 15, 20, 85);
  const o45 = overProb(+projOffsides, 4.5, 15, 10, 78);

  // Tiro de meta
  const projGK = +(h.avgGoalKicks + a.avgGoalKicks).toFixed(0);
  const gkLine = Math.round((+projGK - 2) / 5) * 5 + 0.5;
  const gkProb = overProb(+projGK, gkLine, 8, 25, 85);

  // Laterais
  const projThrow = +(h.avgThrowIns + a.avgThrowIns).toFixed(0);
  const tLine = Math.round((+projThrow - 3) / 5) * 5 + 0.5;
  const tProb = overProb(+projThrow, tLine, 6, 25, 85);

  // Chutes a gol
  const projSOT = +(h.avgShotsOnTarget + a.avgShotsOnTarget).toFixed(1);
  const sot85 = overProb(+projSOT, 8.5, 10, 20, 85);
  const sot105 = overProb(+projSOT, 10.5, 10, 10, 78);

  // Finalizações totais
  const projShots = +(h.avgShotsTotal + a.avgShotsTotal).toFixed(0);
  const sh215 = overProb(+projShots, 21.5, 5, 20, 85);
  const sh255 = overProb(+projShots, 25.5, 5, 10, 78);

  const homeName = match.homeTeam.shortName;
  const awayName = match.awayTeam.shortName;

  return (
    <div className="space-y-4">
      {/* Cabeçalho com nomes */}
      <div className="flex justify-between px-4 py-2 text-xs font-bold rounded-xl" style={{ backgroundColor: "var(--surface)", color: "var(--text-secondary)" }}>
        <span style={{ color: "var(--accent)" }}>{homeName}</span>
        <span>Mercado / Estatística</span>
        <span style={{ color: "#00b0ff" }}>{awayName}</span>
      </div>

      {/* 1X2 */}
      <MarketCard title="Resultado (1X2)" icon="🏆" rows={[
        { label: "Vitórias na temporada",  home: `${hWinPct}%`,  away: `${aWinPct}%` },
        { label: `Vit. em casa / fora`,    home: `${hWinHome}%`, away: `${aWinAway}%` },
        { label: "Empates na temporada",   home: `${hDrawPct}%`, away: `${aDrawPct}%` },
        { label: "Derrotas na temporada",  home: `${hLossPct}%`, away: `${aLossPct}%` },
        { label: "Forma recente (5J)",     home: h.form.join(""), away: a.form.join("") },
      ]} />

      {/* Dupla Chance */}
      <MarketCard title="Dupla Chance" icon="🎲" rows={[
        { label: "1X — casa ou empate",  home: `${dc1X_h}%`, away: `${dc1X_a}%` },
        { label: "X2 — empate ou fora",  home: `${dcX2_h}%`, away: `${dcX2_a}%` },
        { label: "12 — sem empate",      home: `${dc12_h}%`, away: `${dc12_a}%` },
      ]} />

      {/* Handicap */}
      <MarketCard title="Handicap Asiático" icon="⚖️" rows={[
        { label: "AH -0.5 (vitória simples)", home: `${hWinHome}%`, away: `${aWinAway}%` },
        { label: "AH +0.5 (não perde)",       home: `${dc1X_h}%`,   away: `${dcX2_a}%` },
        { label: "AH -1.5 (vencer por 2+)",   home: `~${Math.max(10, hWinHome - 22)}%`, away: `~${Math.max(10, aWinAway - 22)}%` },
        { label: "AH +1.5 (não perde por 2)", home: `~${Math.min(95, 100 - Math.max(10, aWinAway - 22))}%`, away: `~${Math.min(95, 100 - Math.max(10, hWinHome - 22))}%` },
      ]} />

      {/* Over/Under Gols */}
      <MarketCard
        title="Total de Gols (Over/Under)"
        icon="⚽"
        highlight={`Proj. ${totalXG.toFixed(1)} gols`}
        rows={[
          { label: "Média marcados/jogo",    home: h.avgGoalsScored.toFixed(2),   away: a.avgGoalsScored.toFixed(2) },
          { label: "Média sofridos/jogo",    home: h.avgGoalsConceded.toFixed(2), away: a.avgGoalsConceded.toFixed(2) },
          { label: "Over 0.5 gols (hist.)",  home: `${over05Comb}%`,              away: `${over05Comb}%` },
          { label: "Over 1.5 gols (hist.)",  home: `${h.over15Pct}%`,             away: `${a.over15Pct}%` },
          { label: "Over 2.5 gols (hist.)",  home: `${h.over25Pct}%`,             away: `${a.over25Pct}%` },
          { label: "Over 3.5 gols (hist.)",  home: `${h.over35Pct}%`,             away: `${a.over35Pct}%` },
          { label: "Over 4.5 gols (proj.)",  home: `~${over45Comb}%`,             away: `~${over45Comb}%` },
          { label: "Over 2.5 combinado",     home: `${over25Comb}%`,              away: "combinado" },
        ]}
      />

      {/* BTTS */}
      <MarketCard
        title="Ambas Marcam (BTTS)"
        icon="🎯"
        highlight={`Proj. ${bttsComb}% BTTS`}
        rows={[
          { label: "BTTS na temporada",     home: `${h.btts}%`,              away: `${a.btts}%` },
          { label: "BTTS em casa / fora",   home: `${h.home.btts}%`,         away: `${a.away.btts}%` },
          { label: "Gols marcados (média)", home: h.avgGoalsScored.toFixed(2), away: a.avgGoalsScored.toFixed(2) },
          { label: "Gols sofridos (média)", home: h.avgGoalsConceded.toFixed(2), away: a.avgGoalsConceded.toFixed(2) },
          { label: "Clean sheets",          home: String(h.cleanSheets),     away: String(a.cleanSheets) },
        ]}
      />

      {/* 1º Tempo */}
      <MarketCard
        title="Gols no 1º Tempo"
        icon="⏱️"
        highlight={`Proj. ${fhTotal} gols`}
        rows={[
          { label: "Média gols 1ºT (proj.)", home: fhGoalsH,      away: fhGoalsA },
          { label: "Over 0.5 1ºT (proj.)",   home: `~${fhOver05}%`, away: `~${fhOver05}%` },
          { label: "Over 1.5 1ºT (proj.)",   home: `~${fhOver15}%`, away: `~${fhOver15}%` },
        ]}
      />

      {/* Escanteios */}
      <MarketCard
        title="Escanteios"
        icon="🚩"
        highlight={`Proj. ${projCorners.toFixed(1)} cantos`}
        rows={[
          { label: "Média escanteios/jogo",  home: h.avgCorners.toFixed(1),      away: a.avgCorners.toFixed(1) },
          { label: "Média em casa / fora",   home: h.home.avgCorners.toFixed(1), away: a.away.avgCorners.toFixed(1) },
          { label: "Over 8.5 (proj.)",       home: `~${c85}%`,                   away: `~${c85}%` },
          { label: "Over 9.5 (proj.)",       home: `~${c95}%`,                   away: `~${c95}%` },
          { label: "Over 10.5 (proj.)",      home: `~${c105}%`,                  away: `~${c105}%` },
          { label: "Over 11.5 (proj.)",      home: `~${c115}%`,                  away: `~${c115}%` },
        ]}
      />

      {/* Cartões Amarelos */}
      <MarketCard
        title="Cartões Amarelos"
        icon="🟨"
        highlight={`Proj. ${projYellow.toFixed(1)} amarelos`}
        rows={[
          { label: "Média amarelos/jogo",   home: h.avgYellowCards.toFixed(1),      away: a.avgYellowCards.toFixed(1) },
          { label: "Média em casa / fora",  home: h.home.avgYellowCards.toFixed(1), away: a.away.avgYellowCards.toFixed(1) },
          { label: "Over 3.5 (proj.)",      home: `~${y35}%`,                       away: `~${y35}%` },
          { label: "Over 4.5 (proj.)",      home: `~${y45}%`,                       away: `~${y45}%` },
          { label: "Over 5.5 (proj.)",      home: `~${y55}%`,                       away: `~${y55}%` },
        ]}
      />

      {/* Cartões Vermelhos */}
      <MarketCard
        title="Cartões Vermelhos"
        icon="🟥"
        highlight={`Proj. ${projRed} vermelhos`}
        rows={[
          { label: "Média vermelhos/jogo",  home: h.avgRedCards.toFixed(2),  away: a.avgRedCards.toFixed(2) },
          { label: "Over 0.5 (proj.)",      home: `~${red05}%`,              away: `~${red05}%` },
          { label: "Média faltas/jogo",     home: h.avgFouls.toFixed(1),     away: a.avgFouls.toFixed(1) },
        ]}
      />

      {/* Faltas */}
      <MarketCard
        title="Faltas"
        icon="🤚"
        highlight={`Proj. ${projFouls} faltas`}
        rows={[
          { label: "Média faltas/jogo",    home: h.avgFouls.toFixed(1), away: a.avgFouls.toFixed(1) },
          { label: `Over 26.5 (proj.)`,    home: `~${f265}%`,           away: `~${f265}%` },
          { label: `Over 29.5 (proj.)`,    home: `~${f295}%`,           away: `~${f295}%` },
          { label: `Over 32.5 (proj.)`,    home: `~${f325}%`,           away: `~${f325}%` },
        ]}
      />

      {/* Impedimentos */}
      <MarketCard
        title="Impedimentos"
        icon="🚫"
        highlight={`Proj. ${projOffsides} imped.`}
        rows={[
          { label: "Média impedimentos/jogo", home: h.avgOffsides.toFixed(1), away: a.avgOffsides.toFixed(1) },
          { label: "Over 3.5 (proj.)",        home: `~${o35}%`,               away: `~${o35}%` },
          { label: "Over 4.5 (proj.)",        home: `~${o45}%`,               away: `~${o45}%` },
        ]}
      />

      {/* Tiro de Meta */}
      <MarketCard
        title="Tiro de Meta"
        icon="🥅"
        highlight={`Proj. ${projGK} tiros`}
        rows={[
          { label: "Média tiro de meta/jogo",   home: h.avgGoalKicks.toFixed(1), away: a.avgGoalKicks.toFixed(1) },
          { label: `Over ${gkLine} (proj.)`,    home: `~${gkProb}%`,             away: `~${gkProb}%` },
        ]}
      />

      {/* Laterais */}
      <MarketCard
        title="Laterais (Throw-ins)"
        icon="↔️"
        highlight={`Proj. ${projThrow} laterais`}
        rows={[
          { label: "Média laterais/jogo",    home: h.avgThrowIns.toFixed(1), away: a.avgThrowIns.toFixed(1) },
          { label: `Over ${tLine} (proj.)`,  home: `~${tProb}%`,             away: `~${tProb}%` },
        ]}
      />

      {/* Chutes a Gol */}
      <MarketCard
        title="Chutes a Gol"
        icon="🎯"
        highlight={`Proj. ${projSOT} chutes`}
        rows={[
          { label: "Média chutes a gol/jogo", home: h.avgShotsOnTarget.toFixed(1), away: a.avgShotsOnTarget.toFixed(1) },
          { label: "Over 8.5 (proj.)",        home: `~${sot85}%`,                  away: `~${sot85}%` },
          { label: "Over 10.5 (proj.)",       home: `~${sot105}%`,                 away: `~${sot105}%` },
        ]}
      />

      {/* Finalizações Totais */}
      <MarketCard
        title="Finalizações Totais"
        icon="⚡"
        highlight={`Proj. ${projShots} finalizações`}
        rows={[
          { label: "Média finalizações/jogo", home: h.avgShotsTotal.toFixed(1), away: a.avgShotsTotal.toFixed(1) },
          { label: "Over 21.5 (proj.)",       home: `~${sh215}%`,               away: `~${sh215}%` },
          { label: "Over 25.5 (proj.)",       home: `~${sh255}%`,               away: `~${sh255}%` },
        ]}
      />

      {/* Posse de Bola */}
      <MarketCard
        title="Posse de Bola"
        icon="⚽"
        highlight={`${homeName} ${h.avgPossession}% / ${awayName} ${a.avgPossession}%`}
        rows={[
          { label: "Posse média na temp.",  home: `${h.avgPossession}%`,      away: `${a.avgPossession}%` },
          { label: "Em casa / fora",        home: `${h.home.avgGoalsScored.toFixed(1)} avg gol`, away: `${a.away.avgGoalsScored.toFixed(1)} avg gol` },
        ]}
      />
    </div>
  );
}

// ─── H2H Tab ────────────────────────────────────────────────────────────────
function H2HTab({ match }: { match: Match }) {
  if (!match.h2h || match.h2h.length === 0) {
    return (
      <div className="rounded-2xl p-8 border text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <p className="text-2xl mb-2">📊</p>
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>H2H não disponível</p>
      </div>
    );
  }

  const homeWins = match.h2h.filter(h =>
    (h.homeTeam === match.homeTeam.name && h.winner === "home") ||
    (h.awayTeam === match.homeTeam.name && h.winner === "away")
  ).length;
  const awayWins = match.h2h.filter(h =>
    (h.homeTeam === match.awayTeam.name && h.winner === "home") ||
    (h.awayTeam === match.awayTeam.name && h.winner === "away")
  ).length;
  const draws = match.h2h.filter(h => h.winner === "draw").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: match.homeTeam.shortName, count: homeWins, color: "var(--accent)" },
          { label: "Empates",                count: draws,    color: "var(--text-secondary)" },
          { label: match.awayTeam.shortName, count: awayWins, color: "#00b0ff" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <p className="text-3xl font-black" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        {match.h2h.map((h, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < match.h2h!.length - 1 ? "1px solid var(--border)" : undefined }}
          >
            <span className="text-xs w-24 shrink-0" style={{ color: "var(--text-secondary)" }}>{h.date}</span>
            <div className="flex items-center gap-2 flex-1 justify-center">
              <span className="text-sm font-medium truncate max-w-[90px] text-right" style={{ color: "var(--text-primary)" }}>{h.homeTeam}</span>
              <span className="text-sm font-black px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--surface-2)", color: "var(--text-primary)" }}>{h.score}</span>
              <span className="text-sm font-medium truncate max-w-[90px]" style={{ color: "var(--text-primary)" }}>{h.awayTeam}</span>
            </div>
            <span
              className="text-xs w-16 text-right shrink-0 font-semibold"
              style={{ color: h.winner === "draw" ? "var(--text-secondary)" : h.winner === "home" ? "var(--accent)" : "#00b0ff" }}
            >
              {h.winner === "draw" ? "Empate" : h.winner === "home" ? h.homeTeam.split(" ")[0] : h.awayTeam.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tabs Component ──────────────────────────────────────────────────────────
type Tab = "geral" | "times" | "escalacao" | "mercados" | "h2h" | "odds";

export default function MatchTabs({ match }: { match: Match }) {
  const [active, setActive] = useState<Tab>("geral");

  const tabs: { id: Tab; label: string; pro?: boolean }[] = [
    { id: "geral",     label: "Geral" },
    { id: "times",     label: "Times" },
    { id: "escalacao", label: "Escalação", pro: true },
    { id: "mercados",  label: "Mercados" },
    { id: "h2h",       label: "H2H",  pro: true },
    { id: "odds",      label: "Odds", pro: true },
  ];

  return (
    <div className="space-y-3">
      {/* Tab bar - scrollável horizontalmente */}
      <div className="flex gap-1 p-1 rounded-2xl overflow-x-auto" style={{ backgroundColor: "var(--surface)" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="flex-shrink-0 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
            style={{
              backgroundColor: active === tab.id ? "var(--surface-2)" : "transparent",
              color: active === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            {tab.label}
            {tab.pro && <span className="text-[9px] font-black px-1 rounded" style={{ backgroundColor: "rgba(0,230,118,0.2)", color: "var(--accent)" }}>PRO</span>}
          </button>
        ))}
      </div>

      {active === "geral"    && <VisaoGeralTab match={match} />}
      {active === "times"    && <TimesTab match={match} />}
      {active === "escalacao" && (
        <ProGate requiredPlan="pro" message="Escalação provável disponível no plano PRO">
          <EscalacaoTab match={match} />
        </ProGate>
      )}
      {active === "mercados" && <MercadosTab match={match} />}
      {active === "h2h" && (
        <ProGate requiredPlan="pro" message="Histórico H2H disponível no plano PRO">
          <H2HTab match={match} />
        </ProGate>
      )}
      {active === "odds" && (
        <ProGate requiredPlan="pro" message="Comparador de odds disponível no plano PRO">
          {match.multiOdds && match.multiOdds.length > 0 ? (
            <MultiOddsTable
              multiOdds={match.multiOdds}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              valueBet={match.valueBet}
            />
          ) : (
            <div className="rounded-2xl p-8 border text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-2xl mb-2">📈</p>
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Odds não disponíveis</p>
            </div>
          )}
        </ProGate>
      )}
    </div>
  );
}
