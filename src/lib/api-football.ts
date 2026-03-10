/**
 * API-Football Client
 * Documentação: https://www.api-football.com/documentation-v3
 */

const API_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY ?? "";
export const USE_REAL_API = process.env.USE_REAL_API === "true" && API_KEY !== "" && API_KEY !== "SUA_CHAVE_AQUI";

// IDs das principais ligas
export const LEAGUE_IDS = {
  brasileirao:   71,
  premier:       39,
  laliga:       140,
  seriea:       135,
  bundesliga:    78,
  ligue1:        61,
  libertadores:  13,
  champions:      2,
  sulamericana:  11,
  copabrasil:     73,
} as const;

// Mapeamento liga slug → ID
export const LEAGUE_SLUG_TO_ID: Record<string, number> = {
  brasileirao:  71,
  premier:      39,
  laliga:      140,
  seriea:      135,
  bundesliga:   78,
  ligue1:       61,
  libertadores: 13,
  champions:     2,
};

// Temporada atual por liga
export function getCurrentSeason(leagueId: number): number {
  const year = new Date().getFullYear();
  // Brasileirão, Libertadores, Sul-Americana começam no ano atual
  const currentYearLeagues = [71, 13, 11, 73];
  return currentYearLeagues.includes(leagueId) ? year : year - 1;
}

async function apiFetch<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T | null> {
  if (!USE_REAL_API) return null;

  const url = new URL(`${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "x-apisports-key": API_KEY,
        "x-rapidapi-key": API_KEY,
      },
      next: { revalidate: 60 }, // cache 60 segundos
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data as T;
  } catch (err) {
    console.error(`[API-Football] ${endpoint}:`, err);
    return null;
  }
}

// ─── Tipos da API ──────────────────────────────────────────────────────────────

export interface APIFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue: { name: string; city: string };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime:  { home: number | null; away: number | null };
  };
}

export interface APIStatistics {
  team: { id: number; name: string; logo: string };
  statistics: Array<{ type: string; value: string | number | null }>;
}

export interface APIStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  form: string;
}

export interface APIOdds {
  fixture: { id: number };
  bookmakers: Array<{
    id: number;
    name: string;
    bets: Array<{ id: number; name: string; values: Array<{ value: string; odd: string }> }>;
  }>;
}

// ─── Funções públicas ──────────────────────────────────────────────────────────

/** Partidas de hoje por liga */
export async function fetchTodayFixtures(leagueId?: number) {
  const today = new Date().toISOString().split("T")[0];
  const params: Record<string, string | number> = { date: today, timezone: "America/Sao_Paulo" };
  if (leagueId) params.league = leagueId;

  const data = await apiFetch<{ response: APIFixture[] }>("/fixtures", params);
  return data?.response ?? null;
}

/** Detalhes + estatísticas de uma partida */
export async function fetchFixtureDetails(fixtureId: number) {
  const [fixture, stats] = await Promise.all([
    apiFetch<{ response: APIFixture[] }>("/fixtures", { id: fixtureId }),
    apiFetch<{ response: APIStatistics[] }>("/fixtures/statistics", { fixture: fixtureId }),
  ]);

  return {
    fixture: fixture?.response?.[0] ?? null,
    stats: stats?.response ?? null,
  };
}

/** Head to Head entre dois times */
export async function fetchH2H(team1Id: number, team2Id: number, last = 5) {
  const data = await apiFetch<{ response: APIFixture[] }>("/fixtures/headtohead", {
    h2h: `${team1Id}-${team2Id}`,
    last,
  });
  return data?.response ?? null;
}

/** Odds de uma partida */
export async function fetchOdds(fixtureId: number) {
  const data = await apiFetch<{ response: APIOdds[] }>("/odds", { fixture: fixtureId, bookmaker: "8" });
  return data?.response?.[0] ?? null;
}

/** Tabela de classificação */
export async function fetchStandings(leagueId: number) {
  const season = getCurrentSeason(leagueId);
  const data = await apiFetch<{ response: Array<{ league: { standings: APIStanding[][] } }> }>(
    "/standings",
    { league: leagueId, season }
  );
  return data?.response?.[0]?.league?.standings?.[0] ?? null;
}

/** Partidas de uma liga */
export async function fetchLeagueFixtures(leagueId: number, next = 10) {
  const season = getCurrentSeason(leagueId);
  const data = await apiFetch<{ response: APIFixture[] }>("/fixtures", {
    league: leagueId,
    season,
    next,
    timezone: "America/Sao_Paulo",
  });
  return data?.response ?? null;
}

/** Escalação de uma partida */
export async function fetchLineups(fixtureId: number) {
  const data = await apiFetch<{ response: unknown[] }>("/fixtures/lineups", { fixture: fixtureId });
  return data?.response ?? null;
}

/** Artilheiros de uma liga */
export async function fetchTopScorers(leagueId: number) {
  const season = getCurrentSeason(leagueId);
  const data = await apiFetch<{ response: unknown[] }>("/players/topscorers", { league: leagueId, season });
  return data?.response ?? null;
}
