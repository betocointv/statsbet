/**
 * Serviço de dados — abstrai API real e mock
 * Se USE_REAL_API = true → busca dados reais
 * Se USE_REAL_API = false → retorna dados mock
 */

import {
  USE_REAL_API,
  fetchTodayFixtures,
  fetchFixtureDetails,
  fetchH2H,
  fetchOdds,
  fetchStandings,
  fetchLeagueFixtures,
  LEAGUE_IDS,
  type APIFixture,
  type APIStatistics,
  type APIStanding,
} from "./api-football";

import {
  matches as mockMatches,
  leagues as mockLeagues,
  getMatchById as getMockMatchById,
  getMatchesByLeague as getMockMatchesByLeague,
  getLiveMatches as getMockLiveMatches,
  type Match,
  type Team,
  type League,
  type MatchStats,
} from "./mock-data";

// ─── Helpers de conversão ─────────────────────────────────────────────────────

function apiStatusToLocal(short: string): Match["status"] {
  switch (short) {
    case "1H":
    case "2H":
    case "ET":
    case "BT":  return "live";
    case "HT":  return "halftime";
    case "FT":
    case "AET":
    case "PEN": return "finished";
    default:    return "scheduled";
  }
}

function apiTeamToLocal(team: { id: number; name: string; logo: string }, isHome: boolean): Team {
  return {
    id:        String(team.id),
    name:      team.name,
    shortName: team.name.substring(0, 3).toUpperCase(),
    logo:      team.logo,
    logoUrl:   team.logo,
    country:   "",
    colors:    { primary: "#1a2236", secondary: "#ffffff", text: "#ffffff" },
  };
}

function apiLeagueToLocal(league: APIFixture["league"]): League {
  return {
    id:      String(league.id),
    name:    league.name,
    country: league.country,
    logo:    league.logo,
    flag:    league.logo,
  };
}

function apiStatToValue(stats: APIStatistics["statistics"], type: string): number {
  const found = stats.find((s) => s.type === type);
  if (!found || found.value === null) return 0;
  const v = String(found.value).replace("%", "");
  return parseFloat(v) || 0;
}

function apiStatsToLocal(statsArr: APIStatistics[]): MatchStats | undefined {
  if (!statsArr || statsArr.length < 2) return undefined;
  const h = statsArr[0].statistics;
  const a = statsArr[1].statistics;

  return {
    possession:     { home: apiStatToValue(h, "Ball Possession"),    away: apiStatToValue(a, "Ball Possession")    },
    shots:          { home: apiStatToValue(h, "Total Shots"),        away: apiStatToValue(a, "Total Shots")        },
    shotsOnTarget:  { home: apiStatToValue(h, "Shots on Goal"),      away: apiStatToValue(a, "Shots on Goal")      },
    corners:        { home: apiStatToValue(h, "Corner Kicks"),       away: apiStatToValue(a, "Corner Kicks")       },
    fouls:          { home: apiStatToValue(h, "Fouls"),              away: apiStatToValue(a, "Fouls")              },
    yellowCards:    { home: apiStatToValue(h, "Yellow Cards"),       away: apiStatToValue(a, "Yellow Cards")       },
    redCards:       { home: apiStatToValue(h, "Red Cards"),          away: apiStatToValue(a, "Red Cards")          },
    xG:             { home: apiStatToValue(h, "expected_goals"),     away: apiStatToValue(a, "expected_goals")     },
    passes:         { home: apiStatToValue(h, "Total passes"),       away: apiStatToValue(a, "Total passes")       },
    passAccuracy:   { home: apiStatToValue(h, "Passes accurate"),    away: apiStatToValue(a, "Passes accurate")    },
    offsides:       { home: apiStatToValue(h, "Offsides"),           away: apiStatToValue(a, "Offsides")           },
    saves:          { home: apiStatToValue(h, "Goalkeeper Saves"),   away: apiStatToValue(a, "Goalkeeper Saves")   },
  };
}

function apiFixtureToMatch(f: APIFixture): Match {
  const status = apiStatusToLocal(f.fixture.status.short);
  const dateTime = new Date(f.fixture.date);

  return {
    id:        String(f.fixture.id),
    homeTeam:  apiTeamToLocal(f.teams.home, true),
    awayTeam:  apiTeamToLocal(f.teams.away, false),
    date:      dateTime.toISOString().split("T")[0],
    time:      dateTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }),
    status,
    minute:    f.fixture.status.elapsed ?? undefined,
    score:     f.goals.home !== null && f.goals.away !== null
               ? { home: f.goals.home, away: f.goals.away } : undefined,
    league:    apiLeagueToLocal(f.league),
    odds:      { home: 0, draw: 0, away: 0 },
    betScore:  70, // calculado por algoritmo próprio
  };
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

export async function getTodayMatches(): Promise<Match[]> {
  if (!USE_REAL_API) return mockMatches;

  const leagueIds = Object.values(LEAGUE_IDS);
  const allFixtures = await Promise.all(
    leagueIds.map((id) => fetchTodayFixtures(id))
  );

  const fixtures = allFixtures
    .flat()
    .filter((f): f is APIFixture => f !== null)
    .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime());

  if (fixtures.length === 0) return mockMatches; // fallback se API não retornar nada

  return fixtures.map(apiFixtureToMatch);
}

export async function getMatchDetails(id: string): Promise<Match | null> {
  if (!USE_REAL_API) return getMockMatchById(id) ?? null;

  const fixtureId = parseInt(id);
  if (isNaN(fixtureId)) return null;

  const { fixture, stats } = await fetchFixtureDetails(fixtureId);
  if (!fixture) return null;

  const match = apiFixtureToMatch(fixture);

  if (stats) {
    match.stats = apiStatsToLocal(stats);
  }

  // Buscar H2H
  const h2hFixtures = await fetchH2H(
    parseInt(match.homeTeam.id),
    parseInt(match.awayTeam.id),
    5
  );

  if (h2hFixtures) {
    match.h2h = h2hFixtures.map((f) => ({
      date:     f.fixture.date.split("T")[0],
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      score:    `${f.goals.home ?? 0}-${f.goals.away ?? 0}`,
      winner:   f.teams.home.winner === true ? "home"
               : f.teams.away.winner === true ? "away"
               : "draw",
    }));
  }

  // Buscar odds
  const oddsData = await fetchOdds(fixtureId);
  if (oddsData) {
    const matchBet = oddsData.bookmakers[0]?.bets.find((b) => b.name === "Match Winner");
    if (matchBet) {
      const homeOdd = matchBet.values.find((v) => v.value === "Home");
      const drawOdd = matchBet.values.find((v) => v.value === "Draw");
      const awayOdd = matchBet.values.find((v) => v.value === "Away");
      match.odds = {
        home: parseFloat(homeOdd?.odd ?? "0"),
        draw: parseFloat(drawOdd?.odd ?? "0"),
        away: parseFloat(awayOdd?.odd ?? "0"),
      };
    }
  }

  return match;
}

export async function getLiveMatches(): Promise<Match[]> {
  if (!USE_REAL_API) return getMockLiveMatches();

  const data = await fetchTodayFixtures();
  if (!data) return getMockLiveMatches();

  const live = data.filter((f) =>
    ["1H", "2H", "HT", "ET", "BT"].includes(f.fixture.status.short)
  );

  return live.length > 0 ? live.map(apiFixtureToMatch) : getMockLiveMatches();
}

export async function getLeagueMatches(leagueSlug: string): Promise<{ matches: Match[]; standings: APIStanding[] | null }> {
  const { LEAGUE_SLUG_TO_ID } = await import("./api-football");
  const leagueId = LEAGUE_SLUG_TO_ID[leagueSlug];

  if (!USE_REAL_API || !leagueId) {
    return {
      matches:    getMockMatchesByLeague(leagueSlug),
      standings:  null,
    };
  }

  const [fixtures, standings] = await Promise.all([
    fetchLeagueFixtures(leagueId, 20),
    fetchStandings(leagueId),
  ]);

  const matches = (fixtures ?? []).map(apiFixtureToMatch);
  const fallback = getMockMatchesByLeague(leagueSlug);

  return {
    matches:   matches.length > 0 ? matches : fallback,
    standings: standings ?? null,
  };
}

export { USE_REAL_API };
