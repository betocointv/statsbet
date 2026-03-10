"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff, TrendingUp } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";

// Componente interno separado para isolar o useSearchParams no Suspense
function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push(redirect);
    }
  }

  async function handleGoogleLogin(credential: string) {
    setError("");
    setLoading(true);
    const result = await loginWithGoogle(credential);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push(redirect);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-4"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <TrendingUp size={22} style={{ color: "var(--accent)" }} />
            <span className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
              Stats<span style={{ color: "var(--accent)" }}>Bet</span>
            </span>
          </div>
          <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>
            Entrar na sua conta
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Acesse suas estatísticas e análises
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-6 border space-y-4"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "rgba(255,68,68,0.1)", color: "var(--live)", border: "1px solid rgba(255,68,68,0.2)" }}
            >
              {error}
            </div>
          )}

          {/* Botão Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(cr) => { if (cr.credential) handleGoogleLogin(cr.credential); }}
              onError={() => setError("Falha ao entrar com o Google. Tente novamente.")}
              text="signin_with"
              shape="rectangular"
              theme="filled_black"
              width={340}
            />
          </div>

          {/* Divider "ou" */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              ou continue com e-mail
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                E-mail
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-1"
                  style={{
                    backgroundColor: "var(--surface-2)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                Senha
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "var(--surface-2)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity"
              style={{
                backgroundColor: "var(--accent)",
                color: "#000",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-4" style={{ color: "var(--text-secondary)" }}>
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold hover:underline" style={{ color: "var(--accent)" }}>
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
