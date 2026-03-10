"use client";

import { useState, useMemo } from "react";
import type { Match, League } from "@/lib/mock-data";
import MatchCard from "./MatchCard";
import { Search } from "lucide-react";

type Props = {
  matches: Match[];
  leagues: League[];
};

export default function HomeClient({ matches, leagues }: Props) {
  const [activeLeague, setActiveLeague] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = matches;
    if (activeLeague !== "all") list = list.filter(m => m.league.id === activeLeague);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(m =>
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.homeTeam.shortName.toLowerCase().includes(q) ||
        m.awayTeam.shortName.toLowerCase().includes(q) ||
        m.league.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [matches, activeLeague, query]);

  const live      = filtered.filter(m => m.status === "live" || m.status === "halftime");
  const scheduled = filtered.filter(m => m.status === "scheduled");
  const finished  = filtered.filter(m => m.status === "finished");

  // Ligas que têm partidas disponíveis
  const activeLeagueIds = useMemo(() => new Set(matches.map(m => m.league.id)), [matches]);
  const availableLeagues = leagues.filter(l => activeLeagueIds.has(l.id));

  return (
    <div className="space-y-5">
      {/* Busca */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
        <input
          type="text"
          placeholder="Buscar time ou liga..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-sm outline-none border"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: query ? "var(--accent)" : "var(--border)",
            color: "var(--text-primary)",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold"
            style={{ color: "var(--text-secondary)" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros de liga */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveLeague("all")}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            backgroundColor: activeLeague === "all" ? "var(--accent)" : "var(--surface)",
            color: activeLeague === "all" ? "#000" : "var(--text-secondary)",
          }}
        >
          Todas
        </button>
        {availableLeagues.map(league => (
          <button
            key={league.id}
            onClick={() => setActiveLeague(activeLeague === league.id ? "all" : league.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: activeLeague === league.id ? "var(--accent)" : "var(--surface)",
              color: activeLeague === league.id ? "#000" : "var(--text-secondary)",
            }}
          >
            <span>{league.logo}</span>
            <span>{league.name}</span>
          </button>
        ))}
      </div>

      {/* Sem resultados */}
      {filtered.length === 0 && (
        <div className="rounded-2xl p-10 border text-center" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Nenhuma partida encontrada</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Tente outro time ou liga</p>
        </div>
      )}

      {live.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full animate-pulse-live" style={{ backgroundColor: "var(--live)" }} />
            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Ao Vivo</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(255,68,68,0.15)", color: "var(--live)" }}>
              {live.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {live.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {scheduled.length > 0 && (
        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: "var(--text-primary)" }}>Próximas Partidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scheduled.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {finished.length > 0 && (
        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: "var(--text-primary)" }}>Encerrados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {finished.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}
    </div>
  );
}
