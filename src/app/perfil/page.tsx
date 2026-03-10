"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { User, Crown, Calendar, Zap, ArrowLeft } from "lucide-react";
import { planLabel, planColor } from "@/lib/auth";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/entrar");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)" }} />
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm hover:underline"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={14} />
        Voltar
      </Link>

      {/* Header */}
      <div
        className="rounded-2xl p-6 border flex items-center gap-5"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black shrink-0"
          style={{ backgroundColor: "rgba(0,230,118,0.15)", color: "var(--accent)" }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black truncate" style={{ color: "var(--text-primary)" }}>
            {user.name}
          </h1>
          <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
            {user.email}
          </p>
          <span
            className="inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${planColor(user.plan)}20`, color: planColor(user.plan) }}
          >
            {planLabel(user.plan).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: User, label: "Plano Atual", value: planLabel(user.plan), color: planColor(user.plan) },
          { icon: Calendar, label: "Membro desde", value: joinDate, color: "var(--text-secondary)" },
          { icon: Crown, label: "Status", value: user.plan === "free" ? "Gratuito" : "Assinante", color: "var(--accent)" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-4 border flex items-center gap-3"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${card.color}20` }}
            >
              <card.icon size={18} style={{ color: card.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{card.label}</p>
              <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade card — só para free */}
      {user.plan === "free" && (
        <div
          className="rounded-2xl p-5 border"
          style={{ backgroundColor: "var(--surface)", borderColor: "rgba(0,230,118,0.2)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-bold" style={{ color: "var(--text-primary)" }}>
                Desbloqueie o StatsBet PRO
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Acesse value bets ilimitados, H2H, stats e muito mais
              </p>
            </div>
            <Link
              href="/planos"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
              style={{ backgroundColor: "var(--accent)", color: "#0a0e1a" }}
            >
              <Zap size={15} />
              Ver Planos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
