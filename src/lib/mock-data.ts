export type Team = {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  logoUrl: string;
  country: string;
  colors: { primary: string; secondary: string; text: string };
};

export type Player = {
  number: number;
  name: string;
  pos: string; // GK | D | M | F
  grid?: string; // "row:col" ex "1:1"
  captain?: boolean;
  yellow?: boolean;
  red?: boolean;
};

export type Lineup = {
  formation: string; // ex "4-3-3"
  startXI: Player[];
  substitutes: Player[];
};

export type BookmakerOdds = {
  name: string;
  home: number;
  draw: number;
  away: number;
};

export type ProbablePlayer = {
  name: string;
  pos: "GK" | "D" | "M" | "F";
  number?: number;
  injured?: boolean;    // lesionado
  suspended?: boolean;  // suspenso
  doubt?: boolean;      // dúvida
};

export type PlayerOut = {
  name: string;
  reason: string;       // "Lesão muscular" | "Suspenso" | "Dúvida"
  returnDate?: string;  // "Indefinido" | "2026-03-20"
};

export type ProbableLineup = {
  formation: string;
  startXI: ProbablePlayer[];
  out: PlayerOut[];
};

export type Referee = {
  name: string;
  country: string;
  totalGames: number;
  avgYellowCards: number;
  avgRedCards: number;
  avgFouls: number;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
};

export type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  status: "scheduled" | "live" | "finished" | "halftime";
  minute?: number;
  score?: { home: number; away: number };
  league: League;
  odds: { home: number; draw: number; away: number };
  multiOdds?: BookmakerOdds[];
  stats?: MatchStats;
  teamStats?: { home: TeamSeasonStats; away: TeamSeasonStats };
  probableLineups?: { home: ProbableLineup; away: ProbableLineup };
  referee?: Referee;
  h2h?: H2HMatch[];
  lineups?: { home: Lineup; away: Lineup };
  betScore: number; // 0-100 apostabilidade
  valueBet?: string; // "home" | "draw" | "away"
};

export type MatchStats = {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  xG: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  offsides: { home: number; away: number };
  saves: { home: number; away: number };
};

export type H2HMatch = {
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  winner: "home" | "away" | "draw";
};

export type TeamSplit = {
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  avgGoalsScored: number;
  avgGoalsConceded: number;
  avgCorners: number;
  avgYellowCards: number;
  over25Pct: number; // % jogos com +2.5 gols
  btts: number;      // % ambas marcam
};

export type TeamSeasonStats = {
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  form: ("W" | "D" | "L")[]; // últimos 5
  avgGoalsScored: number;
  avgGoalsConceded: number;
  avgCorners: number;
  avgYellowCards: number;
  avgShotsOnTarget: number;
  avgPossession: number;
  over25Pct: number;
  over35Pct: number;
  btts: number;
  avgGoalKicks: number;  // tiros de meta
  avgThrowIns: number;   // laterais
  avgFouls: number;
  avgRedCards: number;
  over15Pct: number;     // % jogos com +1.5 gols
  avgShotsTotal: number; // total de finalizações (não apenas a gol)
  avgOffsides: number;   // impedimentos por jogo
  home: TeamSplit;
  away: TeamSplit;
};

export type League = {
  id: string;
  name: string;
  country: string;
  logo: string;
  flag?: string;
};

export const leagues: League[] = [
  { id: "brasileirao", name: "Brasileirão Série A", country: "Brasil", logo: "🇧🇷", flag: "🇧🇷" },
  { id: "premier", name: "Premier League", country: "Inglaterra", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "laliga", name: "La Liga", country: "Espanha", logo: "🇪🇸", flag: "🇪🇸" },
  { id: "seriea", name: "Serie A", country: "Itália", logo: "🇮🇹", flag: "🇮🇹" },
  { id: "bundesliga", name: "Bundesliga", country: "Alemanha", logo: "🇩🇪", flag: "🇩🇪" },
  { id: "ligue1", name: "Ligue 1", country: "França", logo: "🇫🇷", flag: "🇫🇷" },
  { id: "libertadores", name: "Libertadores", country: "América do Sul", logo: "🌎", flag: "🌎" },
  { id: "champions", name: "Champions League", country: "Europa", logo: "⭐", flag: "⭐" },
];

export const matches: Match[] = [
  {
    id: "1",
    homeTeam: { id: "fla", name: "Flamengo", shortName: "FLA", logo: "🔴", logoUrl: "https://media.api-sports.io/football/teams/127.png", country: "Brasil", colors: { primary: "#CC0000", secondary: "#000000", text: "#FFFFFF" } },
    awayTeam: { id: "plm", name: "Palmeiras", shortName: "PAL", logo: "🟢", logoUrl: "https://media.api-sports.io/football/teams/121.png", country: "Brasil", colors: { primary: "#006437", secondary: "#FFFFFF", text: "#FFFFFF" } },
    date: "2026-03-08",
    time: "16:00",
    status: "live",
    minute: 67,
    score: { home: 2, away: 1 },
    league: leagues[0],
    odds: { home: 2.1, draw: 3.2, away: 3.5 },
    betScore: 82,
    valueBet: "home",
    teamStats: {
      home: {
        gamesPlayed: 22, wins: 14, draws: 5, losses: 3,
        goalsScored: 41, goalsConceded: 18, cleanSheets: 8,
        form: ["W","W","D","W","W"],
        avgGoalsScored: 1.86, avgGoalsConceded: 0.82,
        avgCorners: 6.4, avgYellowCards: 2.1,
        avgShotsOnTarget: 5.8, avgPossession: 57,
        over25Pct: 68, over35Pct: 36, btts: 41,
        avgGoalKicks: 11.2, avgThrowIns: 32.4, avgFouls: 12.8, avgRedCards: 0.09,
        over15Pct: 82, avgShotsTotal: 14.2, avgOffsides: 2.1,
        home: { gamesPlayed: 11, wins: 8, draws: 2, losses: 1, avgGoalsScored: 2.18, avgGoalsConceded: 0.64, avgCorners: 7.1, avgYellowCards: 1.9, over25Pct: 72, btts: 36 },
        away: { gamesPlayed: 11, wins: 6, draws: 3, losses: 2, avgGoalsScored: 1.54, avgGoalsConceded: 1.00, avgCorners: 5.7, avgYellowCards: 2.3, over25Pct: 63, btts: 45 },
      },
      away: {
        gamesPlayed: 22, wins: 13, draws: 6, losses: 3,
        goalsScored: 38, goalsConceded: 20, cleanSheets: 9,
        form: ["W","D","W","L","W"],
        avgGoalsScored: 1.73, avgGoalsConceded: 0.91,
        avgCorners: 5.9, avgYellowCards: 2.3,
        avgShotsOnTarget: 5.2, avgPossession: 54,
        over25Pct: 59, over35Pct: 27, btts: 45,
        avgGoalKicks: 12.1, avgThrowIns: 30.8, avgFouls: 13.5, avgRedCards: 0.14,
        over15Pct: 76, avgShotsTotal: 13.1, avgOffsides: 1.8,
        home: { gamesPlayed: 11, wins: 8, draws: 2, losses: 1, avgGoalsScored: 2.09, avgGoalsConceded: 0.72, avgCorners: 6.4, avgYellowCards: 2.0, over25Pct: 63, btts: 40 },
        away: { gamesPlayed: 11, wins: 5, draws: 4, losses: 2, avgGoalsScored: 1.36, avgGoalsConceded: 1.09, avgCorners: 5.4, avgYellowCards: 2.6, over25Pct: 54, btts: 50 },
      },
    },
    probableLineups: {
      home: {
        formation: "4-2-3-1",
        startXI: [
          { name: "Rossi", pos: "GK", number: 1 },
          { name: "Varela", pos: "D", number: 2 },
          { name: "Léo Pereira", pos: "D", number: 3 },
          { name: "Fabrício Bruno", pos: "D", number: 4 },
          { name: "Ayrton Lucas", pos: "D", number: 6 },
          { name: "Pulgar", pos: "M", number: 5 },
          { name: "De la Cruz", pos: "M", number: 8 },
          { name: "Arrascaeta", pos: "M", number: 14 },
          { name: "Luiz Araújo", pos: "F", number: 7 },
          { name: "Gerson", pos: "M", number: 8 },
          { name: "Pedro", pos: "F", number: 9 },
        ],
        out: [
          { name: "Everton Cebolinha", reason: "Lesão muscular", returnDate: "Indefinido" },
          { name: "Viña", reason: "Dúvida", returnDate: "2026-03-15" },
        ],
      },
      away: {
        formation: "4-3-3",
        startXI: [
          { name: "Weverton", pos: "GK", number: 1 },
          { name: "Marcos Rocha", pos: "D", number: 2 },
          { name: "Gómez", pos: "D", number: 5 },
          { name: "Murilo", pos: "D", number: 3 },
          { name: "Piquerez", pos: "D", number: 22 },
          { name: "Raphael Veiga", pos: "M", number: 23 },
          { name: "Aníbal Moreno", pos: "M", number: 8 },
          { name: "Zé Rafael", pos: "M", number: 16 },
          { name: "Dudu", pos: "F", number: 7 },
          { name: "Flaco López", pos: "F", number: 9 },
          { name: "Estêvão", pos: "F", number: 41 },
        ],
        out: [
          { name: "Endrick", reason: "Suspenso", returnDate: "2026-03-20" },
          { name: "Rony", reason: "Lesão no joelho", returnDate: "Indefinido" },
          { name: "Gabriel Menino", reason: "Dúvida", returnDate: "2026-03-10" },
        ],
      },
    },
    referee: {
      name: "Wilton Pereira Sampaio",
      country: "Brasil",
      totalGames: 48,
      avgYellowCards: 4.2,
      avgRedCards: 0.3,
      avgFouls: 28.5,
      homeWinPct: 42,
      drawPct: 28,
      awayWinPct: 30,
    },
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 14, away: 8 },
      shotsOnTarget: { home: 7, away: 3 },
      corners: { home: 6, away: 3 },
      fouls: { home: 9, away: 13 },
      yellowCards: { home: 1, away: 2 },
      redCards: { home: 0, away: 0 },
      xG: { home: 2.4, away: 0.9 },
      passes: { home: 487, away: 342 },
      passAccuracy: { home: 88, away: 82 },
      offsides: { home: 2, away: 1 },
      saves: { home: 2, away: 5 },
    },
    h2h: [
      { date: "2025-09-14", homeTeam: "Palmeiras", awayTeam: "Flamengo", score: "1-2", winner: "away" },
      { date: "2025-05-20", homeTeam: "Flamengo", awayTeam: "Palmeiras", score: "3-1", winner: "home" },
      { date: "2024-11-03", homeTeam: "Palmeiras", awayTeam: "Flamengo", score: "0-0", winner: "draw" },
      { date: "2024-07-07", homeTeam: "Flamengo", awayTeam: "Palmeiras", score: "2-0", winner: "home" },
      { date: "2023-10-22", homeTeam: "Palmeiras", awayTeam: "Flamengo", score: "2-1", winner: "home" },
    ],
    multiOdds: [
      { name: "Bet365",      home: 2.10, draw: 3.20, away: 3.50 },
      { name: "Betano",      home: 2.15, draw: 3.10, away: 3.40 },
      { name: "Sportingbet", home: 2.05, draw: 3.25, away: 3.60 },
      { name: "Pinnacle",    home: 2.18, draw: 3.28, away: 3.55 },
      { name: "Betfair",     home: 2.20, draw: 3.15, away: 3.45 },
      { name: "1xBet",       home: 2.12, draw: 3.30, away: 3.62 },
    ],
    lineups: {
      home: {
        formation: "4-2-3-1",
        startXI: [
          { number: 1,  name: "Rossi",       pos: "GK", grid: "1:1" },
          { number: 2,  name: "Varela",      pos: "D",  grid: "2:1" },
          { number: 3,  name: "Léo Pereira", pos: "D",  grid: "2:2" },
          { number: 4,  name: "Fabrício",    pos: "D",  grid: "2:3" },
          { number: 6,  name: "Ayrton",      pos: "D",  grid: "2:4" },
          { number: 5,  name: "Pulgar",      pos: "M",  grid: "3:1" },
          { number: 8,  name: "De la Cruz",  pos: "M",  grid: "3:2" },
          { number: 10, name: "Arrascaeta",  pos: "M",  grid: "4:1", captain: true },
          { number: 7,  name: "Luiz Araújo", pos: "M",  grid: "4:2" },
          { number: 11, name: "Gerson",      pos: "M",  grid: "4:3" },
          { number: 9,  name: "Pedro",       pos: "F",  grid: "5:1" },
        ],
        substitutes: [
          { number: 12, name: "Matheus F.",  pos: "GK" },
          { number: 14, name: "Wesley",      pos: "F",  yellow: true },
          { number: 17, name: "Plata",       pos: "F" },
          { number: 20, name: "Lorran",      pos: "M" },
          { number: 23, name: "Viña",        pos: "D" },
        ],
      },
      away: {
        formation: "4-3-3",
        startXI: [
          { number: 1,  name: "Weverton",    pos: "GK", grid: "1:1" },
          { number: 2,  name: "Marcos R.",   pos: "D",  grid: "2:1" },
          { number: 5,  name: "Gómez",       pos: "D",  grid: "2:2" },
          { number: 3,  name: "Murilo",      pos: "D",  grid: "2:3" },
          { number: 6,  name: "Piquerez",    pos: "D",  grid: "2:4" },
          { number: 8,  name: "R. Veiga",    pos: "M",  grid: "3:1", captain: true },
          { number: 14, name: "Aníbal",      pos: "M",  grid: "3:2" },
          { number: 16, name: "Zé Rafael",   pos: "M",  grid: "3:3" },
          { number: 7,  name: "Dudu",        pos: "F",  grid: "4:1" },
          { number: 9,  name: "Flaco López", pos: "F",  grid: "4:2" },
          { number: 11, name: "Estêvão",     pos: "F",  grid: "4:3" },
        ],
        substitutes: [
          { number: 23, name: "Marcelo G.",  pos: "GK" },
          { number: 10, name: "Rony",        pos: "F",  yellow: true },
          { number: 17, name: "Lázaro",      pos: "F" },
          { number: 18, name: "Gabriel M.",  pos: "M" },
          { number: 22, name: "Mayke",       pos: "D" },
        ],
      },
    },
  },
  {
    id: "2",
    homeTeam: { id: "mci", name: "Manchester City", shortName: "MCI", logo: "🔵", logoUrl: "https://media.api-sports.io/football/teams/50.png", country: "Inglaterra", colors: { primary: "#6CABDD", secondary: "#FFFFFF", text: "#FFFFFF" } },
    awayTeam: { id: "ars", name: "Arsenal", shortName: "ARS", logo: "🔴", logoUrl: "https://media.api-sports.io/football/teams/42.png", country: "Inglaterra", colors: { primary: "#EF0107", secondary: "#FFFFFF", text: "#FFFFFF" } },
    date: "2026-03-08",
    time: "17:30",
    status: "live",
    minute: 34,
    score: { home: 1, away: 1 },
    league: leagues[1],
    odds: { home: 1.9, draw: 3.5, away: 4.0 },
    betScore: 91,
    valueBet: "draw",
    teamStats: {
      home: {
        gamesPlayed: 24, wins: 16, draws: 5, losses: 3,
        goalsScored: 52, goalsConceded: 22, cleanSheets: 9,
        form: ["W","W","W","D","W"],
        avgGoalsScored: 2.17, avgGoalsConceded: 0.92,
        avgCorners: 7.2, avgYellowCards: 1.6,
        avgShotsOnTarget: 6.9, avgPossession: 63,
        over25Pct: 75, over35Pct: 46, btts: 42,
        avgGoalKicks: 9.4, avgThrowIns: 28.6, avgFouls: 10.2, avgRedCards: 0.08,
        over15Pct: 87, avgShotsTotal: 17.2, avgOffsides: 1.9,
        home: { gamesPlayed: 12, wins: 10, draws: 1, losses: 1, avgGoalsScored: 2.58, avgGoalsConceded: 0.75, avgCorners: 8.0, avgYellowCards: 1.4, over25Pct: 83, btts: 38 },
        away: { gamesPlayed: 12, wins: 6, draws: 4, losses: 2, avgGoalsScored: 1.75, avgGoalsConceded: 1.08, avgCorners: 6.4, avgYellowCards: 1.8, over25Pct: 67, btts: 46 },
      },
      away: {
        gamesPlayed: 24, wins: 14, draws: 5, losses: 5,
        goalsScored: 46, goalsConceded: 28, cleanSheets: 7,
        form: ["D","W","W","L","W"],
        avgGoalsScored: 1.92, avgGoalsConceded: 1.17,
        avgCorners: 6.1, avgYellowCards: 2.0,
        avgShotsOnTarget: 5.8, avgPossession: 52,
        over25Pct: 70, over35Pct: 42, btts: 58,
        avgGoalKicks: 10.8, avgThrowIns: 31.2, avgFouls: 11.6, avgRedCards: 0.12,
        over15Pct: 82, avgShotsTotal: 15.4, avgOffsides: 2.3,
        home: { gamesPlayed: 12, wins: 9, draws: 2, losses: 1, avgGoalsScored: 2.25, avgGoalsConceded: 0.92, avgCorners: 6.8, avgYellowCards: 1.8, over25Pct: 75, btts: 50 },
        away: { gamesPlayed: 12, wins: 5, draws: 3, losses: 4, avgGoalsScored: 1.58, avgGoalsConceded: 1.42, avgCorners: 5.4, avgYellowCards: 2.2, over25Pct: 67, btts: 67 },
      },
    },
    stats: {
      possession: { home: 62, away: 38 },
      shots: { home: 9, away: 5 },
      shotsOnTarget: { home: 4, away: 2 },
      corners: { home: 5, away: 2 },
      fouls: { home: 6, away: 8 },
      yellowCards: { home: 0, away: 1 },
      redCards: { home: 0, away: 0 },
      xG: { home: 1.6, away: 0.8 },
      passes: { home: 412, away: 251 },
      passAccuracy: { home: 91, away: 85 },
      offsides: { home: 1, away: 2 },
      saves: { home: 1, away: 3 },
    },
    h2h: [
      { date: "2025-10-05", homeTeam: "Arsenal", awayTeam: "Manchester City", score: "2-2", winner: "draw" },
      { date: "2025-03-22", homeTeam: "Manchester City", awayTeam: "Arsenal", score: "3-1", winner: "home" },
      { date: "2024-09-08", homeTeam: "Arsenal", awayTeam: "Manchester City", score: "1-0", winner: "home" },
      { date: "2024-04-01", homeTeam: "Manchester City", awayTeam: "Arsenal", score: "0-2", winner: "away" },
      { date: "2023-10-08", homeTeam: "Arsenal", awayTeam: "Manchester City", score: "1-0", winner: "home" },
    ],
    multiOdds: [
      { name: "Bet365",      home: 1.90, draw: 3.50, away: 4.00 },
      { name: "Betano",      home: 1.88, draw: 3.45, away: 4.10 },
      { name: "Sportingbet", home: 1.92, draw: 3.55, away: 3.95 },
      { name: "Pinnacle",    home: 1.95, draw: 3.52, away: 4.05 },
      { name: "Betfair",     home: 1.87, draw: 3.48, away: 4.15 },
      { name: "1xBet",       home: 1.93, draw: 3.60, away: 4.20 },
    ],
  },
  {
    id: "3",
    homeTeam: { id: "rma", name: "Real Madrid", shortName: "RMA", logo: "⚪", logoUrl: "https://media.api-sports.io/football/teams/541.png", country: "Espanha", colors: { primary: "#FEBE10", secondary: "#FFFFFF", text: "#1a1a2e" } },
    awayTeam: { id: "bar", name: "Barcelona", shortName: "BAR", logo: "🔵", logoUrl: "https://media.api-sports.io/football/teams/529.png", country: "Espanha", colors: { primary: "#004D98", secondary: "#A50044", text: "#FFFFFF" } },
    date: "2026-03-08",
    time: "21:00",
    status: "scheduled",
    league: leagues[2],
    odds: { home: 2.4, draw: 3.3, away: 2.9 },
    betScore: 88,
    valueBet: "away",
    teamStats: {
      home: {
        gamesPlayed: 25, wins: 17, draws: 4, losses: 4,
        goalsScored: 55, goalsConceded: 25, cleanSheets: 8,
        form: ["W","L","W","W","D"],
        avgGoalsScored: 2.20, avgGoalsConceded: 1.00,
        avgCorners: 6.0, avgYellowCards: 2.4,
        avgShotsOnTarget: 6.2, avgPossession: 58,
        over25Pct: 72, over35Pct: 44, btts: 52,
        avgGoalKicks: 10.2, avgThrowIns: 29.5, avgFouls: 13.0, avgRedCards: 0.12,
        over15Pct: 85, avgShotsTotal: 17.8, avgOffsides: 2.4,
        home: { gamesPlayed: 13, wins: 10, draws: 2, losses: 1, avgGoalsScored: 2.46, avgGoalsConceded: 0.77, avgCorners: 6.6, avgYellowCards: 2.1, over25Pct: 77, btts: 46 },
        away: { gamesPlayed: 12, wins: 7, draws: 2, losses: 3, avgGoalsScored: 1.92, avgGoalsConceded: 1.25, avgCorners: 5.4, avgYellowCards: 2.7, over25Pct: 67, btts: 58 },
      },
      away: {
        gamesPlayed: 25, wins: 18, draws: 3, losses: 4,
        goalsScored: 61, goalsConceded: 24, cleanSheets: 10,
        form: ["W","W","W","D","W"],
        avgGoalsScored: 2.44, avgGoalsConceded: 0.96,
        avgCorners: 7.4, avgYellowCards: 2.2,
        avgShotsOnTarget: 7.1, avgPossession: 62,
        over25Pct: 80, over35Pct: 52, btts: 56,
        avgGoalKicks: 9.0, avgThrowIns: 27.8, avgFouls: 11.4, avgRedCards: 0.08,
        over15Pct: 88, avgShotsTotal: 16.5, avgOffsides: 2.8,
        home: { gamesPlayed: 13, wins: 11, draws: 1, losses: 1, avgGoalsScored: 2.77, avgGoalsConceded: 0.77, avgCorners: 8.1, avgYellowCards: 1.9, over25Pct: 85, btts: 54 },
        away: { gamesPlayed: 12, wins: 7, draws: 2, losses: 3, avgGoalsScored: 2.08, avgGoalsConceded: 1.17, avgCorners: 6.7, avgYellowCards: 2.5, over25Pct: 75, btts: 58 },
      },
    },
    probableLineups: {
      home: {
        formation: "4-3-3",
        startXI: [
          { name: "Courtois", pos: "GK", number: 1 },
          { name: "Carvajal", pos: "D", number: 2 },
          { name: "Rüdiger", pos: "D", number: 22 },
          { name: "Militão", pos: "D", number: 3 },
          { name: "Mendy", pos: "D", number: 23 },
          { name: "Tchouaméni", pos: "M", number: 8 },
          { name: "Valverde", pos: "M", number: 15 },
          { name: "Bellingham", pos: "M", number: 5 },
          { name: "Rodrygo", pos: "F", number: 11 },
          { name: "Mbappé", pos: "F", number: 9 },
          { name: "Vinicius Jr.", pos: "F", number: 7 },
        ],
        out: [
          { name: "Camavinga", reason: "Lesão no tornozelo", returnDate: "2026-03-25" },
          { name: "Modric", reason: "Dúvida", returnDate: "2026-03-10" },
        ],
      },
      away: {
        formation: "4-3-3",
        startXI: [
          { name: "Szczesny", pos: "GK", number: 1 },
          { name: "Koundé", pos: "D", number: 23 },
          { name: "Araujo", pos: "D", number: 4 },
          { name: "Martínez", pos: "D", number: 5 },
          { name: "Balde", pos: "D", number: 3 },
          { name: "Pedri", pos: "M", number: 8 },
          { name: "De Jong", pos: "M", number: 21 },
          { name: "Gavi", pos: "M", number: 6 },
          { name: "Yamal", pos: "F", number: 19 },
          { name: "Lewandowski", pos: "F", number: 9 },
          { name: "Raphinha", pos: "F", number: 11 },
        ],
        out: [
          { name: "Ter Stegen", reason: "Lesão no joelho", returnDate: "Indefinido" },
          { name: "Christensen", reason: "Lesão muscular", returnDate: "2026-04-01" },
        ],
      },
    },
    referee: {
      name: "Jesús Gil Manzano",
      country: "Espanha",
      totalGames: 62,
      avgYellowCards: 5.1,
      avgRedCards: 0.4,
      avgFouls: 32.8,
      homeWinPct: 38,
      drawPct: 30,
      awayWinPct: 32,
    },
    h2h: [
      { date: "2025-10-26", homeTeam: "Barcelona", awayTeam: "Real Madrid", score: "1-4", winner: "away" },
      { date: "2025-03-01", homeTeam: "Real Madrid", awayTeam: "Barcelona", score: "2-3", winner: "away" },
      { date: "2024-10-28", homeTeam: "Barcelona", awayTeam: "Real Madrid", score: "0-1", winner: "away" },
      { date: "2024-04-21", homeTeam: "Real Madrid", awayTeam: "Barcelona", score: "3-2", winner: "home" },
      { date: "2023-10-29", homeTeam: "Real Madrid", awayTeam: "Barcelona", score: "2-1", winner: "home" },
    ],
  },
  {
    id: "4",
    homeTeam: { id: "juve", name: "Juventus", shortName: "JUV", logo: "⬛", logoUrl: "https://media.api-sports.io/football/teams/496.png", country: "Itália", colors: { primary: "#000000", secondary: "#FFFFFF", text: "#FFFFFF" } },
    awayTeam: { id: "int", name: "Inter Milan", shortName: "INT", logo: "🔵", logoUrl: "https://media.api-sports.io/football/teams/505.png", country: "Itália", colors: { primary: "#0A0B8A", secondary: "#000000", text: "#FFFFFF" } },
    date: "2026-03-08",
    time: "14:00",
    status: "finished",
    score: { home: 0, away: 2 },
    league: leagues[3],
    odds: { home: 2.2, draw: 3.1, away: 3.3 },
    betScore: 74,
    teamStats: {
      home: {
        gamesPlayed: 24, wins: 10, draws: 7, losses: 7,
        goalsScored: 30, goalsConceded: 24, cleanSheets: 7,
        form: ["D","L","W","D","L"],
        avgGoalsScored: 1.25, avgGoalsConceded: 1.00,
        avgCorners: 4.8, avgYellowCards: 2.5,
        avgShotsOnTarget: 4.1, avgPossession: 49,
        over25Pct: 46, over35Pct: 21, btts: 46,
        avgGoalKicks: 13.2, avgThrowIns: 33.0, avgFouls: 14.5, avgRedCards: 0.17,
        over15Pct: 67, avgShotsTotal: 11.2, avgOffsides: 2.6,
        home: { gamesPlayed: 12, wins: 6, draws: 4, losses: 2, avgGoalsScored: 1.50, avgGoalsConceded: 0.83, avgCorners: 5.2, avgYellowCards: 2.3, over25Pct: 50, btts: 42 },
        away: { gamesPlayed: 12, wins: 4, draws: 3, losses: 5, avgGoalsScored: 1.00, avgGoalsConceded: 1.17, avgCorners: 4.4, avgYellowCards: 2.7, over25Pct: 42, btts: 50 },
      },
      away: {
        gamesPlayed: 24, wins: 15, draws: 6, losses: 3,
        goalsScored: 51, goalsConceded: 22, cleanSheets: 10,
        form: ["W","W","W","D","W"],
        avgGoalsScored: 2.13, avgGoalsConceded: 0.92,
        avgCorners: 6.8, avgYellowCards: 1.9,
        avgShotsOnTarget: 6.4, avgPossession: 58,
        over25Pct: 71, over35Pct: 38, btts: 46,
        avgGoalKicks: 10.0, avgThrowIns: 28.4, avgFouls: 11.8, avgRedCards: 0.08,
        over15Pct: 83, avgShotsTotal: 16.0, avgOffsides: 2.1,
        home: { gamesPlayed: 12, wins: 9, draws: 2, losses: 1, avgGoalsScored: 2.42, avgGoalsConceded: 0.75, avgCorners: 7.3, avgYellowCards: 1.7, over25Pct: 75, btts: 42 },
        away: { gamesPlayed: 12, wins: 6, draws: 4, losses: 2, avgGoalsScored: 1.83, avgGoalsConceded: 1.08, avgCorners: 6.3, avgYellowCards: 2.1, over25Pct: 67, btts: 50 },
      },
    },
    h2h: [
      { date: "2025-11-09", homeTeam: "Inter Milan", awayTeam: "Juventus", score: "4-4", winner: "draw" },
      { date: "2025-02-23", homeTeam: "Juventus", awayTeam: "Inter Milan", score: "1-0", winner: "home" },
      { date: "2024-11-10", homeTeam: "Inter Milan", awayTeam: "Juventus", score: "1-1", winner: "draw" },
      { date: "2024-04-01", homeTeam: "Juventus", awayTeam: "Inter Milan", score: "2-2", winner: "draw" },
      { date: "2023-11-26", homeTeam: "Inter Milan", awayTeam: "Juventus", score: "1-0", winner: "home" },
    ],
  },
  {
    id: "5",
    homeTeam: { id: "bvb", name: "Borussia Dortmund", shortName: "BVB", logo: "🟡", logoUrl: "https://media.api-sports.io/football/teams/165.png", country: "Alemanha", colors: { primary: "#FDE100", secondary: "#000000", text: "#000000" } },
    awayTeam: { id: "bay", name: "Bayern Munich", shortName: "BAY", logo: "🔴", logoUrl: "https://media.api-sports.io/football/teams/157.png", country: "Alemanha", colors: { primary: "#DC052D", secondary: "#FFFFFF", text: "#FFFFFF" } },
    date: "2026-03-08",
    time: "18:30",
    status: "scheduled",
    league: leagues[4],
    odds: { home: 3.8, draw: 3.5, away: 1.9 },
    betScore: 79,
    valueBet: "home",
    teamStats: {
      home: {
        gamesPlayed: 24, wins: 11, draws: 6, losses: 7,
        goalsScored: 42, goalsConceded: 34, cleanSheets: 5,
        form: ["L","W","W","D","W"],
        avgGoalsScored: 1.75, avgGoalsConceded: 1.42,
        avgCorners: 5.5, avgYellowCards: 2.6,
        avgShotsOnTarget: 5.0, avgPossession: 48,
        over25Pct: 67, over35Pct: 38, btts: 63,
        avgGoalKicks: 12.4, avgThrowIns: 34.2, avgFouls: 14.0, avgRedCards: 0.13,
        over15Pct: 79, avgShotsTotal: 13.8, avgOffsides: 2.7,
        home: { gamesPlayed: 12, wins: 7, draws: 3, losses: 2, avgGoalsScored: 2.00, avgGoalsConceded: 1.17, avgCorners: 6.1, avgYellowCards: 2.3, over25Pct: 75, btts: 58 },
        away: { gamesPlayed: 12, wins: 4, draws: 3, losses: 5, avgGoalsScored: 1.50, avgGoalsConceded: 1.67, avgCorners: 4.9, avgYellowCards: 2.9, over25Pct: 58, btts: 67 },
      },
      away: {
        gamesPlayed: 24, wins: 19, draws: 3, losses: 2,
        goalsScored: 64, goalsConceded: 20, cleanSheets: 12,
        form: ["W","W","W","W","D"],
        avgGoalsScored: 2.67, avgGoalsConceded: 0.83,
        avgCorners: 7.8, avgYellowCards: 1.8,
        avgShotsOnTarget: 8.2, avgPossession: 67,
        over25Pct: 83, over35Pct: 58, btts: 42,
        avgGoalKicks: 8.6, avgThrowIns: 26.4, avgFouls: 10.4, avgRedCards: 0.04,
        over15Pct: 91, avgShotsTotal: 20.1, avgOffsides: 2.2,
        home: { gamesPlayed: 12, wins: 11, draws: 1, losses: 0, avgGoalsScored: 3.17, avgGoalsConceded: 0.67, avgCorners: 8.6, avgYellowCards: 1.6, over25Pct: 92, btts: 42 },
        away: { gamesPlayed: 12, wins: 8, draws: 2, losses: 2, avgGoalsScored: 2.17, avgGoalsConceded: 1.00, avgCorners: 7.0, avgYellowCards: 2.0, over25Pct: 75, btts: 42 },
      },
    },
    probableLineups: {
      home: {
        formation: "4-2-3-1",
        startXI: [
          { name: "Kobel", pos: "GK", number: 1 },
          { name: "Ryerson", pos: "D", number: 16 },
          { name: "Hummels", pos: "D", number: 15 },
          { name: "Schlotterbeck", pos: "D", number: 4 },
          { name: "Bensebaini", pos: "D", number: 15 },
          { name: "Can", pos: "M", number: 23 },
          { name: "Sabitzer", pos: "M", number: 7 },
          { name: "Brandt", pos: "M", number: 19 },
          { name: "Adeyemi", pos: "F", number: 27 },
          { name: "Reus", pos: "F", number: 11 },
          { name: "Fullkrug", pos: "F", number: 14 },
        ],
        out: [
          { name: "Malen", reason: "Lesão muscular", returnDate: "2026-03-20" },
          { name: "Reyna", reason: "Dúvida", returnDate: "2026-03-10" },
        ],
      },
      away: {
        formation: "4-2-3-1",
        startXI: [
          { name: "Neuer", pos: "GK", number: 1 },
          { name: "Kimmich", pos: "D", number: 6 },
          { name: "Upamecano", pos: "D", number: 5 },
          { name: "Kim Min-jae", pos: "D", number: 3 },
          { name: "Davies", pos: "D", number: 19 },
          { name: "Goretzka", pos: "M", number: 8 },
          { name: "Laimer", pos: "M", number: 27 },
          { name: "Müller", pos: "M", number: 25 },
          { name: "Sané", pos: "F", number: 10 },
          { name: "Kane", pos: "F", number: 9 },
          { name: "Gnabry", pos: "F", number: 7 },
        ],
        out: [
          { name: "Coman", reason: "Lesão muscular", returnDate: "Indefinido" },
          { name: "Musiala", reason: "Suspenso", returnDate: "2026-03-25" },
        ],
      },
    },
    referee: {
      name: "Daniel Siebert",
      country: "Alemanha",
      totalGames: 54,
      avgYellowCards: 4.8,
      avgRedCards: 0.2,
      avgFouls: 30.1,
      homeWinPct: 44,
      drawPct: 24,
      awayWinPct: 32,
    },
    h2h: [
      { date: "2025-11-01", homeTeam: "Bayern Munich", awayTeam: "Borussia Dortmund", score: "1-0", winner: "home" },
      { date: "2025-04-13", homeTeam: "Borussia Dortmund", awayTeam: "Bayern Munich", score: "2-1", winner: "home" },
      { date: "2024-11-02", homeTeam: "Bayern Munich", awayTeam: "Borussia Dortmund", score: "1-0", winner: "home" },
      { date: "2024-04-06", homeTeam: "Borussia Dortmund", awayTeam: "Bayern Munich", score: "0-2", winner: "away" },
      { date: "2023-11-04", homeTeam: "Bayern Munich", awayTeam: "Borussia Dortmund", score: "4-0", winner: "home" },
    ],
  },
  {
    id: "6",
    homeTeam: { id: "psg", name: "PSG", shortName: "PSG", logo: "🔵", logoUrl: "https://media.api-sports.io/football/teams/85.png", country: "França", colors: { primary: "#004170", secondary: "#DA291C", text: "#FFFFFF" } },
    awayTeam: { id: "lyon", name: "Olympique Lyon", shortName: "LYO", logo: "🔴", logoUrl: "https://media.api-sports.io/football/teams/80.png", country: "França", colors: { primary: "#0050A4", secondary: "#FFFFFF", text: "#FFFFFF" } },
    date: "2026-03-08",
    time: "20:45",
    status: "halftime",
    minute: 45,
    score: { home: 1, away: 0 },
    league: leagues[5],
    odds: { home: 1.6, draw: 3.8, away: 5.5 },
    betScore: 65,
    teamStats: {
      home: {
        gamesPlayed: 24, wins: 17, draws: 4, losses: 3,
        goalsScored: 53, goalsConceded: 18, cleanSheets: 11,
        form: ["W","W","W","W","D"],
        avgGoalsScored: 2.21, avgGoalsConceded: 0.75,
        avgCorners: 7.0, avgYellowCards: 1.7,
        avgShotsOnTarget: 7.2, avgPossession: 64,
        over25Pct: 75, over35Pct: 46, btts: 38,
        avgGoalKicks: 9.2, avgThrowIns: 27.0, avgFouls: 10.8, avgRedCards: 0.08,
        over15Pct: 87, avgShotsTotal: 18.6, avgOffsides: 1.7,
        home: { gamesPlayed: 12, wins: 10, draws: 1, losses: 1, avgGoalsScored: 2.58, avgGoalsConceded: 0.58, avgCorners: 7.7, avgYellowCards: 1.5, over25Pct: 83, btts: 33 },
        away: { gamesPlayed: 12, wins: 7, draws: 3, losses: 2, avgGoalsScored: 1.83, avgGoalsConceded: 0.92, avgCorners: 6.3, avgYellowCards: 1.9, over25Pct: 67, btts: 42 },
      },
      away: {
        gamesPlayed: 24, wins: 8, draws: 6, losses: 10,
        goalsScored: 29, goalsConceded: 38, cleanSheets: 4,
        form: ["L","D","W","L","D"],
        avgGoalsScored: 1.21, avgGoalsConceded: 1.58,
        avgCorners: 4.4, avgYellowCards: 2.9,
        avgShotsOnTarget: 3.8, avgPossession: 44,
        over25Pct: 58, over35Pct: 29, btts: 54,
        avgGoalKicks: 14.0, avgThrowIns: 35.6, avgFouls: 15.2, avgRedCards: 0.21,
        over15Pct: 63, avgShotsTotal: 10.4, avgOffsides: 2.4,
        home: { gamesPlayed: 12, wins: 5, draws: 4, losses: 3, avgGoalsScored: 1.50, avgGoalsConceded: 1.25, avgCorners: 4.9, avgYellowCards: 2.6, over25Pct: 58, btts: 50 },
        away: { gamesPlayed: 12, wins: 3, draws: 2, losses: 7, avgGoalsScored: 0.92, avgGoalsConceded: 1.92, avgCorners: 3.9, avgYellowCards: 3.2, over25Pct: 58, btts: 58 },
      },
    },
    h2h: [
      { date: "2025-09-21", homeTeam: "Olympique Lyon", awayTeam: "PSG", score: "1-3", winner: "away" },
      { date: "2025-02-16", homeTeam: "PSG", awayTeam: "Olympique Lyon", score: "1-0", winner: "home" },
      { date: "2024-09-29", homeTeam: "Olympique Lyon", awayTeam: "PSG", score: "1-4", winner: "away" },
      { date: "2024-04-14", homeTeam: "PSG", awayTeam: "Olympique Lyon", score: "4-1", winner: "home" },
      { date: "2023-09-03", homeTeam: "Olympique Lyon", awayTeam: "PSG", score: "0-4", winner: "away" },
    ],
  },
  {
    id: "7",
    homeTeam: { id: "flu", name: "Fluminense", shortName: "FLU", logo: "🟢", logoUrl: "https://media.api-sports.io/football/teams/119.png", country: "Brasil", colors: { primary: "#78003C", secondary: "#1E5122", text: "#FFFFFF" } },
    awayTeam: { id: "ldu", name: "LDU Quito", shortName: "LDU", logo: "⬜", logoUrl: "https://media.api-sports.io/football/teams/1322.png", country: "Equador", colors: { primary: "#0033A0", secondary: "#FFD700", text: "#FFFFFF" } },
    date: "2026-03-08",
    time: "21:30",
    status: "scheduled",
    league: leagues[6],
    odds: { home: 1.8, draw: 3.4, away: 4.5 },
    betScore: 71,
    teamStats: {
      home: {
        gamesPlayed: 18, wins: 10, draws: 4, losses: 4,
        goalsScored: 30, goalsConceded: 18, cleanSheets: 6,
        form: ["W","D","W","W","L"],
        avgGoalsScored: 1.67, avgGoalsConceded: 1.00,
        avgCorners: 5.2, avgYellowCards: 2.3,
        avgShotsOnTarget: 4.8, avgPossession: 52,
        over25Pct: 56, over35Pct: 28, btts: 44,
        avgGoalKicks: 11.8, avgThrowIns: 31.4, avgFouls: 13.6, avgRedCards: 0.11,
        over15Pct: 72, avgShotsTotal: 12.3, avgOffsides: 1.9,
        home: { gamesPlayed: 9, wins: 6, draws: 2, losses: 1, avgGoalsScored: 1.89, avgGoalsConceded: 0.78, avgCorners: 5.7, avgYellowCards: 2.1, over25Pct: 56, btts: 44 },
        away: { gamesPlayed: 9, wins: 4, draws: 2, losses: 3, avgGoalsScored: 1.44, avgGoalsConceded: 1.22, avgCorners: 4.7, avgYellowCards: 2.5, over25Pct: 56, btts: 44 },
      },
      away: {
        gamesPlayed: 12, wins: 5, draws: 3, losses: 4,
        goalsScored: 16, goalsConceded: 15, cleanSheets: 3,
        form: ["L","W","D","L","W"],
        avgGoalsScored: 1.33, avgGoalsConceded: 1.25,
        avgCorners: 4.1, avgYellowCards: 2.7,
        avgShotsOnTarget: 3.6, avgPossession: 46,
        over25Pct: 50, over35Pct: 25, btts: 50,
        avgGoalKicks: 13.5, avgThrowIns: 33.8, avgFouls: 14.2, avgRedCards: 0.17,
        over15Pct: 67, avgShotsTotal: 9.8, avgOffsides: 2.3,
        home: { gamesPlayed: 6, wins: 3, draws: 2, losses: 1, avgGoalsScored: 1.50, avgGoalsConceded: 1.00, avgCorners: 4.5, avgYellowCards: 2.5, over25Pct: 50, btts: 50 },
        away: { gamesPlayed: 6, wins: 2, draws: 1, losses: 3, avgGoalsScored: 1.17, avgGoalsConceded: 1.50, avgCorners: 3.7, avgYellowCards: 2.9, over25Pct: 50, btts: 50 },
      },
    },
    h2h: [
      { date: "2023-10-28", homeTeam: "Fluminense", awayTeam: "LDU Quito", score: "2-1", winner: "home" },
      { date: "2023-08-05", homeTeam: "LDU Quito", awayTeam: "Fluminense", score: "0-2", winner: "away" },
    ],
  },
  {
    id: "8",
    homeTeam: { id: "atm", name: "Atlético Madrid", shortName: "ATM", logo: "🔴", logoUrl: "https://media.api-sports.io/football/teams/530.png", country: "Espanha", colors: { primary: "#CB3524", secondary: "#FFFFFF", text: "#FFFFFF" } },
    awayTeam: { id: "bvb2", name: "Borussia Dortmund", shortName: "BVB", logo: "🟡", logoUrl: "https://media.api-sports.io/football/teams/165.png", country: "Alemanha", colors: { primary: "#FDE100", secondary: "#000000", text: "#000000" } },
    date: "2026-03-08",
    time: "20:00",
    status: "scheduled",
    league: leagues[7],
    odds: { home: 2.0, draw: 3.4, away: 3.7 },
    betScore: 85,
    valueBet: "home",
    teamStats: {
      home: {
        gamesPlayed: 24, wins: 14, draws: 6, losses: 4,
        goalsScored: 38, goalsConceded: 22, cleanSheets: 8,
        form: ["W","W","D","W","W"],
        avgGoalsScored: 1.58, avgGoalsConceded: 0.92,
        avgCorners: 5.4, avgYellowCards: 2.8,
        avgShotsOnTarget: 5.1, avgPossession: 51,
        over25Pct: 58, over35Pct: 29, btts: 46,
        avgGoalKicks: 11.6, avgThrowIns: 32.2, avgFouls: 15.0, avgRedCards: 0.17,
        over15Pct: 71, avgShotsTotal: 13.2, avgOffsides: 2.0,
        home: { gamesPlayed: 12, wins: 9, draws: 2, losses: 1, avgGoalsScored: 1.83, avgGoalsConceded: 0.67, avgCorners: 5.9, avgYellowCards: 2.5, over25Pct: 67, btts: 42 },
        away: { gamesPlayed: 12, wins: 5, draws: 4, losses: 3, avgGoalsScored: 1.33, avgGoalsConceded: 1.17, avgCorners: 4.9, avgYellowCards: 3.1, over25Pct: 50, btts: 50 },
      },
      away: {
        gamesPlayed: 24, wins: 11, draws: 6, losses: 7,
        goalsScored: 42, goalsConceded: 34, cleanSheets: 5,
        form: ["L","W","W","D","W"],
        avgGoalsScored: 1.75, avgGoalsConceded: 1.42,
        avgCorners: 5.5, avgYellowCards: 2.6,
        avgShotsOnTarget: 5.0, avgPossession: 48,
        over25Pct: 67, over35Pct: 38, btts: 63,
        avgGoalKicks: 12.4, avgThrowIns: 34.2, avgFouls: 14.0, avgRedCards: 0.13,
        over15Pct: 79, avgShotsTotal: 13.8, avgOffsides: 2.7,
        home: { gamesPlayed: 12, wins: 7, draws: 3, losses: 2, avgGoalsScored: 2.00, avgGoalsConceded: 1.17, avgCorners: 6.1, avgYellowCards: 2.3, over25Pct: 75, btts: 58 },
        away: { gamesPlayed: 12, wins: 4, draws: 3, losses: 5, avgGoalsScored: 1.50, avgGoalsConceded: 1.67, avgCorners: 4.9, avgYellowCards: 2.9, over25Pct: 58, btts: 67 },
      },
    },
    h2h: [
      { date: "2024-04-10", homeTeam: "Atlético Madrid", awayTeam: "Borussia Dortmund", score: "2-1", winner: "home" },
      { date: "2024-04-16", homeTeam: "Borussia Dortmund", awayTeam: "Atlético Madrid", score: "4-2", winner: "home" },
    ],
  },
];

export const getMatchById = (id: string) => matches.find((m) => m.id === id);
export const getMatchesByLeague = (leagueId: string) =>
  matches.filter((m) => m.league.id === leagueId);
export const getLiveMatches = () => matches.filter((m) => m.status === "live" || m.status === "halftime");
