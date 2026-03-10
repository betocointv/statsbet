"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, Eye, EyeOff, TrendingUp, Check } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";

const BENEFITS = [
  "Estatísticas completas de partidas (xG, H2H, posse)",
  "Análises de Value Bet em tempo real (plano Pro)",
  "Simulador de Banca baseado nos sinais do sistema (plano Pro)",
  "Alertas personalizados antes dos jogos",
];

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/");
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
      router.push("/");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left — Benefits */}
        <div className="hidden lg:block space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={26} style={{ color: "var(--accent)" }} />
              <span className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
                Stats<span style={{ color: "var(--accent)" }}>Bet</span>
              </span>
            </div>
            <h2 className="text-3xl font-black mb-3" style={{ color: "var(--text-primary)" }}>
              Analise com dados, não com achismo.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Junte-se a milhares de pessoas que usam análises estatísticas avançadas de futebol para se manter à frente do mercado.
            </p>
          </div>

          <div className="space-y-3">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(0,230,118,0.15)" }}
                >
                  <Check size={13} style={{ color: "var(--accent)" }} />
                </div>
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>{b}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "50+",  label: "Ligas" },
              { value: "500+", label: "Partidas/dia" },
              { value: "89%",  label: "Precisão" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center border"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <p className="text-2xl font-black" style={{ color: "var(--accent)" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <div>
          {/* Mobile logo */}
          <div className="text-center mb-6 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp size={22} style={{ color: "var(--accent)" }} />
              <span className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                Stats<span style={{ color: "var(--accent)" }}>Bet</span>
              </span>
            </div>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>
              Criar conta grátis
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Sem cartão de crédito. Cancele quando quiser.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 border space-y-4"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
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
                text="signup_with"
                shape="rectangular"
                theme="filled_black"
                width={340}
              />
            </div>

            {/* Divider "ou" */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                ou cadastre com e-mail
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                  Nome completo
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                    minLength={2}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      backgroundColor: "var(--surface-2)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>
              </div>

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
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      backgroundColor: "var(--surface-2)",
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
                    placeholder="Mín. 8 caracteres"
                    required
                    minLength={8}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none"
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

                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="mt-1.5 flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor:
                            password.length >= i * 4
                              ? i === 1
                                ? "var(--live)"
                                : i === 2
                                ? "var(--warning)"
                                : "var(--accent)"
                              : "var(--border)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Terms */}
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Ao cadastrar, você concorda com nossos{" "}
                <span className="underline cursor-pointer" style={{ color: "var(--accent)" }}>
                  Termos de Uso
                </span>{" "}
                e{" "}
                <span className="underline cursor-pointer" style={{ color: "var(--accent)" }}>
                  Política de Privacidade
                </span>
                .
              </p>

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
                  <UserPlus size={16} />
                )}
                {loading ? "Criando conta..." : "Criar conta grátis"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm mt-4" style={{ color: "var(--text-secondary)" }}>
            Já tem conta?{" "}
            <Link href="/entrar" className="font-semibold hover:underline" style={{ color: "var(--accent)" }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
