/**
 * Tipos e utilidades de autenticação
 *
 * ⚠️  AVISO DE SEGURANÇA (MVP):
 * Esta implementação usa localStorage como banco de dados temporário.
 * Antes de ir para produção com usuários reais, migrar para:
 *  - Autenticação server-side (NextAuth.js, Auth0, Supabase, etc.)
 *  - Senhas hashadas com bcrypt/Argon2 no servidor
 *  - Sessions em cookies HTTP-only
 *  - Rate limiting real no servidor
 */

export type Plan = "free" | "pro" | "premium";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

// Chaves de localStorage
export const AUTH_KEY    = "statsbet_user";
export const SESSION_KEY = "statsbet_session";

// Planos e permissões
export const PLAN_LIMITS = {
  free: {
    valueBets: 1,
    leagues: 2,
    matchStats: false,
    h2h: false,
    alerts: false,
    bankroll: false,
  },
  pro: {
    valueBets: Infinity,
    leagues: Infinity,
    matchStats: true,
    h2h: true,
    alerts: true,
    bankroll: true,
  },
  premium: {
    valueBets: Infinity,
    leagues: Infinity,
    matchStats: true,
    h2h: true,
    alerts: true,
    bankroll: true,
  },
} as const;

export function planLabel(plan: Plan): string {
  return plan === "free" ? "Grátis" : plan === "pro" ? "Pro" : "Premium";
}

export function planColor(plan: Plan): string {
  return plan === "free"
    ? "var(--text-secondary)"
    : plan === "pro"
    ? "var(--warning)"
    : "var(--accent)";
}

// ─── Validação de entrada ────────────────────────────────────────────────────

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) return "E-mail é obrigatório.";
  if (!EMAIL_REGEX.test(email.trim())) return "E-mail inválido.";
  if (email.length > 254) return "E-mail muito longo.";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Senha é obrigatória.";
  if (password.length < 8) return "Senha deve ter pelo menos 8 caracteres.";
  if (password.length > 128) return "Senha muito longa.";
  if (!/[0-9]/.test(password)) return "Senha deve conter ao menos um número.";
  if (!/[a-zA-Z]/.test(password)) return "Senha deve conter ao menos uma letra.";
  return null;
}

function validateName(name: string): string | null {
  if (!name || name.trim().length < 2) return "Nome deve ter pelo menos 2 caracteres.";
  if (name.trim().length > 80) return "Nome muito longo.";
  return null;
}

// ─── Rate limiting (client-side — mitiga força bruta básica) ─────────────────
// Nota: rate limiting real deve ser implementado no servidor.
// Esta versão usa sessionStorage para persistir entre reloads mas não entre abas.

const RATE_LIMIT_KEY    = "statsbet_rl_attempts";
const RATE_LOCKOUT_KEY  = "statsbet_rl_lockout";
const MAX_ATTEMPTS      = 5;   // bloqueio após 5 falhas
const LOCKOUT_MS        = 15 * 60 * 1000; // 15 minutos

interface RateLimitCheck {
  blocked: boolean;
  minutesLeft?: number;
}

function checkRateLimit(): RateLimitCheck {
  if (typeof window === "undefined") return { blocked: false };

  const lockoutUntil = sessionStorage.getItem(RATE_LOCKOUT_KEY);
  if (lockoutUntil) {
    const until = parseInt(lockoutUntil, 10);
    const now   = Date.now();
    if (now < until) {
      return { blocked: true, minutesLeft: Math.ceil((until - now) / 60_000) };
    }
    // Bloqueio expirou — limpar
    sessionStorage.removeItem(RATE_LOCKOUT_KEY);
    sessionStorage.removeItem(RATE_LIMIT_KEY);
  }
  return { blocked: false };
}

function recordFailedAttempt(): void {
  if (typeof window === "undefined") return;
  const prev = parseInt(sessionStorage.getItem(RATE_LIMIT_KEY) || "0", 10);
  const next = prev + 1;

  if (next >= MAX_ATTEMPTS) {
    sessionStorage.setItem(RATE_LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
    sessionStorage.removeItem(RATE_LIMIT_KEY);
  } else {
    sessionStorage.setItem(RATE_LIMIT_KEY, String(next));
  }
}

function clearRateLimit(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RATE_LIMIT_KEY);
  sessionStorage.removeItem(RATE_LOCKOUT_KEY);
}

// ─── "Banco de dados" local (MVP — substituir por API real em produção) ───────

function getUsers(): Record<string, User & { password: string }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("statsbet_users") || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, User & { password: string }>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("statsbet_users", JSON.stringify(users));
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ user: User } | { error: string }> {
  // Simulação de latência de rede
  await new Promise((r) => setTimeout(r, 600));

  // Validação de entrada
  const nameErr  = validateName(name);
  if (nameErr)  return { error: nameErr };

  const emailErr = validateEmail(email);
  if (emailErr) return { error: emailErr };

  const passErr  = validatePassword(password);
  if (passErr)  return { error: passErr };

  const users = getUsers();
  const existing = Object.values(users).find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );
  if (existing) return { error: "Este e-mail já está cadastrado." };

  const user: User = {
    id:        crypto.randomUUID(),
    name:      name.trim(),
    email:     email.toLowerCase().trim(),
    plan:      "free",
    createdAt: new Date().toISOString(),
  };

  // ⚠️  MVP: senha armazenada em plaintext. Em produção: usar bcrypt no servidor.
  users[user.id] = { ...user, password };
  saveUsers(users);
  return { user };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User } | { error: string }> {
  await new Promise((r) => setTimeout(r, 600));

  // Verificar rate limit antes de qualquer processamento
  const rl = checkRateLimit();
  if (rl.blocked) {
    return {
      error: `Muitas tentativas. Tente novamente em ${rl.minutesLeft} minuto(s).`,
    };
  }

  // Validação básica de entrada (não revelar qual campo está errado)
  if (!email || !password) {
    return { error: "Preencha todos os campos." };
  }

  const users = getUsers();
  const found = Object.values(users).find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  // Mensagem genérica — não revelar se o e-mail existe ou não
  if (!found || found.password !== password) {
    recordFailedAttempt();
    return { error: "Credenciais inválidas." };
  }

  // Login bem-sucedido — limpar rate limit
  clearRateLimit();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...user } = found;
  return { user };
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    if (!raw || typeof raw !== "object") return null;

    // Validação mínima do shape do objeto
    const requiredFields = ["id", "name", "email", "plan", "createdAt"];
    for (const field of requiredFields) {
      if (!(field in raw)) return null;
    }

    // Validar que o plano é um valor conhecido
    const validPlans: Plan[] = ["free", "pro", "premium"];
    if (!validPlans.includes(raw.plan)) {
      clearUser();
      return null;
    }

    return raw as User;
  } catch {
    return null;
  }
}

export function storeUser(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

// ─── Login via Google Identity Services ──────────────────────────────────────

/**
 * Autentica (ou registra) um usuário usando o JWT retornado pelo Google.
 * O token é decodificado client-side — o Google já o validou antes de entregá-lo.
 *
 * Fluxo:
 *  1. Decodifica payload do JWT (sub, email, name)
 *  2. Busca usuário por e-mail no localStorage
 *     - Encontrado → retorna o usuário existente (login)
 *     - Não encontrado → cria nova conta sem senha (registro automático)
 */
export async function loginWithGoogle(
  credential: string
): Promise<{ user: User } | { error: string }> {
  if (typeof window === "undefined") {
    return { error: "Autenticação Google não disponível no servidor." };
  }

  try {
    // Decodifica o payload Base64URL do JWT (segunda parte: header.PAYLOAD.signature)
    const base64Url = credential.split(".")[1];
    const base64    = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload   = JSON.parse(atob(base64)) as Record<string, unknown>;

    const googleId = String(payload.sub  ?? "");
    const email    = String(payload.email ?? "").toLowerCase().trim();
    const name     = String(payload.name  ?? email.split("@")[0]).trim();

    if (!googleId || !email) {
      return { error: "Dados insuficientes retornados pelo Google." };
    }

    const users = getUsers();

    // Verifica se já existe conta com este e-mail
    const existing = Object.values(users).find(u => u.email === email);
    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...user } = existing;
      return { user };
    }

    // Cria nova conta — Google users não possuem senha local
    const user: User = {
      id:        `google_${googleId}`,
      name,
      email,
      plan:      "free",
      createdAt: new Date().toISOString(),
    };
    users[user.id] = { ...user, password: "" };
    saveUsers(users);
    return { user };

  } catch {
    return { error: "Falha ao processar autenticação do Google." };
  }
}
