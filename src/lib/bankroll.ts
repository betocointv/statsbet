/**
 * Gestor de Banca — tipos e lógica local (localStorage)
 */

export type BetResult = "win" | "loss" | "push" | "pending";

export interface Bet {
  id: string;
  date: string;           // ISO date string
  match: string;          // ex: "Flamengo vs Palmeiras"
  league: string;
  selection: string;      // ex: "Flamengo (1)"
  odd: number;
  stake: number;          // em unidades
  result: BetResult;
  profit: number;         // calculado: (odd - 1) * stake se win, -stake se loss
  notes?: string;
}

export interface BankrollConfig {
  initialBankroll: number;  // em R$
  unitSize: number;         // em R$ por unidade
  currency: string;         // "BRL"
}

export interface BankrollState {
  config: BankrollConfig;
  bets: Bet[];
}

const KEY = "statsbet_bankroll";

const DEFAULT_CONFIG: BankrollConfig = {
  initialBankroll: 1000,
  unitSize: 10,
  currency: "BRL",
};

export function loadBankroll(): BankrollState {
  if (typeof window === "undefined") return { config: DEFAULT_CONFIG, bets: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { config: DEFAULT_CONFIG, bets: [] };
    return JSON.parse(raw);
  } catch {
    return { config: DEFAULT_CONFIG, bets: [] };
  }
}

export function saveBankroll(state: BankrollState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

// ─── Cálculos ────────────────────────────────────────────────────────────────

export function calcProfit(bet: Pick<Bet, "odd" | "stake" | "result">): number {
  if (bet.result === "win")     return parseFloat(((bet.odd - 1) * bet.stake).toFixed(2));
  if (bet.result === "loss")    return -bet.stake;
  if (bet.result === "push")    return 0;
  return 0; // pending
}

export interface BankrollStats {
  totalBets: number;
  settledBets: number;
  wins: number;
  losses: number;
  pushes: number;
  pending: number;
  winRate: number;       // %
  totalStaked: number;   // unidades
  totalProfit: number;   // unidades
  roi: number;           // %
  currentBankroll: number; // R$
  bestOdd: number;
  avgOdd: number;
  streak: { type: "win" | "loss"; count: number };
}

export function calcStats(state: BankrollState): BankrollStats {
  const { bets, config } = state;
  const settled = bets.filter((b) => b.result !== "pending");
  const wins    = settled.filter((b) => b.result === "win");
  const losses  = settled.filter((b) => b.result === "loss");
  const pushes  = settled.filter((b) => b.result === "push");
  const pending = bets.filter((b) => b.result === "pending");

  const totalStaked  = settled.reduce((s, b) => s + b.stake, 0);
  const totalProfit  = settled.reduce((s, b) => s + b.profit, 0);
  const roi          = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
  const currentBankroll = config.initialBankroll + totalProfit * config.unitSize;
  const bestOdd = bets.length > 0 ? Math.max(...bets.map((b) => b.odd)) : 0;
  const avgOdd  = settled.length > 0 ? settled.reduce((s, b) => s + b.odd, 0) / settled.length : 0;

  // Calcular sequência atual
  let streak = { type: "win" as "win" | "loss", count: 0 };
  const sortedSettled = [...settled].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (sortedSettled.length > 0) {
    const lastType = sortedSettled[0].result === "win" ? "win" : "loss";
    let count = 0;
    for (const b of sortedSettled) {
      if ((b.result === "win" && lastType === "win") || (b.result === "loss" && lastType === "loss")) {
        count++;
      } else break;
    }
    streak = { type: lastType, count };
  }

  return {
    totalBets:       bets.length,
    settledBets:     settled.length,
    wins:            wins.length,
    losses:          losses.length,
    pushes:          pushes.length,
    pending:         pending.length,
    winRate:         settled.length > 0 ? (wins.length / settled.length) * 100 : 0,
    totalStaked,
    totalProfit,
    roi,
    currentBankroll,
    bestOdd,
    avgOdd,
    streak,
  };
}

export function buildEquityCurve(bets: Bet[], initialBankroll: number, unitSize: number): { date: string; value: number }[] {
  const settled = bets
    .filter((b) => b.result !== "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const points: { date: string; value: number }[] = [
    { date: "Início", value: initialBankroll },
  ];

  let current = initialBankroll;
  for (const bet of settled) {
    current += bet.profit * unitSize;
    points.push({
      date: new Date(bet.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value: parseFloat(current.toFixed(2)),
    });
  }

  return points;
}

// Seeds de demonstração para usuários novos
export function getDefaultBets(): Bet[] {
  return [
    { id: "b1", date: "2026-03-01", match: "Flamengo vs Palmeiras",      league: "Brasileirão", selection: "Flamengo (1)",  odd: 2.10, stake: 2, result: "win",     profit: calcProfit({ odd: 2.10, stake: 2, result: "win" }),     notes: "Mandante forte em casa" },
    { id: "b2", date: "2026-03-02", match: "Man City vs Arsenal",         league: "Premier League", selection: "Empate (X)", odd: 3.50, stake: 1, result: "loss",    profit: calcProfit({ odd: 3.50, stake: 1, result: "loss" }) },
    { id: "b3", date: "2026-03-03", match: "Real Madrid vs Barcelona",    league: "La Liga",     selection: "Barcelona (2)", odd: 2.90, stake: 1.5, result: "win",   profit: calcProfit({ odd: 2.90, stake: 1.5, result: "win" }),   notes: "Value detectado pelo sistema" },
    { id: "b4", date: "2026-03-04", match: "Juventus vs Inter Milan",     league: "Serie A",     selection: "Inter Milan (2)", odd: 3.30, stake: 1, result: "win",   profit: calcProfit({ odd: 3.30, stake: 1, result: "win" }) },
    { id: "b5", date: "2026-03-05", match: "BVB vs Bayern Munich",        league: "Bundesliga",  selection: "Bayern (2)",    odd: 1.90, stake: 2, result: "loss",    profit: calcProfit({ odd: 1.90, stake: 2, result: "loss" }) },
    { id: "b6", date: "2026-03-06", match: "PSG vs Olympique Lyon",       league: "Ligue 1",     selection: "PSG (1)",        odd: 1.60, stake: 3, result: "win",    profit: calcProfit({ odd: 1.60, stake: 3, result: "win" }),     notes: "Favorito em casa" },
    { id: "b7", date: "2026-03-07", match: "Atlético Madrid vs BVB",      league: "Champions",   selection: "Atlético (1)",   odd: 2.00, stake: 2, result: "push",   profit: 0 },
    { id: "b8", date: "2026-03-08", match: "Flamengo vs Palmeiras",       league: "Brasileirão", selection: "Flamengo (1)",   odd: 2.10, stake: 2, result: "pending", profit: 0,                                                      notes: "Ao vivo agora" },
  ];
}
