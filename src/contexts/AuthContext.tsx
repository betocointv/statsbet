"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  type User,
  getStoredUser,
  storeUser,
  clearUser,
  loginUser,
  registerUser,
  loginWithGoogle as authLoginWithGoogle,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ error?: string }>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Helpers de cookie de sessão ─────────────────────────────────────────────
// O middleware (src/middleware.ts) lê o cookie "sb_session" para proteger rotas
// server-side. O cookie é simples (MVP) — não criptografado.
// Em produção: usar JWT assinado ou NextAuth.js para validação real no servidor.

const SESSION_COOKIE = "sb_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 horas em segundos

function setSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = [
    `${SESSION_COOKIE}=1`,
    "path=/",
    `max-age=${SESSION_MAX_AGE}`,
    "SameSite=Lax",
    // "Secure" deve ser adicionado em produção com HTTPS
  ].join("; ");
}

function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário salvo no localStorage e sincroniza o cookie de sessão
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      // Garante que o cookie existe após reload/abertura de aba
      setSessionCookie();
    } else {
      // Limpa cookie órfão caso localStorage tenha sido limpo manualmente
      clearSessionCookie();
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if ("error" in result) return { error: result.error };
    setUser(result.user);
    storeUser(result.user);
    setSessionCookie(); // ← permite que o middleware detecte a sessão
    return {};
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerUser(name, email, password);
    if ("error" in result) return { error: result.error };
    setUser(result.user);
    storeUser(result.user);
    setSessionCookie(); // ← permite que o middleware detecte a sessão
    return {};
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const result = await authLoginWithGoogle(credential);
    if ("error" in result) return { error: result.error };
    setUser(result.user);
    storeUser(result.user);
    setSessionCookie(); // ← cookie necessário para o middleware detectar sessão
    return {};
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearUser();
    clearSessionCookie(); // ← middleware passa a bloquear rotas protegidas
  }, []);

  const refreshUser = useCallback(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
      <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, refreshUser }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
