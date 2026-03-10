"use client";

import Link from "next/link";
import { Lock, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Plan } from "@/lib/auth";

interface ProGateProps {
  requiredPlan?: Plan;          // "pro" | "premium"
  children: React.ReactNode;
  blurContent?: boolean;        // se true, mostra conteúdo embaçado por baixo
  message?: string;
}

export default function ProGate({
  requiredPlan = "pro",
  children,
  blurContent = true,
  message,
}: ProGateProps) {
  const { user } = useAuth();

  // Verifica acesso
  const hasAccess =
    user &&
    (user.plan === "premium" ||
      (requiredPlan === "pro" && user.plan === "pro"));

  if (hasAccess) return <>{children}</>;

  const defaultMsg = !user
    ? "Faça login para acessar este conteúdo"
    : `Conteúdo exclusivo para plano ${requiredPlan === "pro" ? "Pro" : "Premium"}`;

  return (
    <div className="relative">
      {/* Conteúdo embaçado */}
      {blurContent && (
        <div className="pointer-events-none select-none" style={{ filter: "blur(6px)", opacity: 0.4 }}>
          {children}
        </div>
      )}

      {/* Overlay de bloqueio */}
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl p-6 border text-center ${blurContent ? "absolute inset-0" : ""}`}
        style={{
          backgroundColor: blurContent ? "rgba(10,14,26,0.85)" : "var(--surface)",
          borderColor: "rgba(0,230,118,0.2)",
          backdropFilter: blurContent ? "blur(2px)" : undefined,
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,230,118,0.1)" }}
        >
          <Lock size={22} style={{ color: "var(--accent)" }} />
        </div>

        <div>
          <p className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            {message ?? defaultMsg}
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {!user
              ? "Crie uma conta grátis e faça upgrade para PRO"
              : `Faça upgrade para desbloquear este recurso`}
          </p>
        </div>

        <div className="flex gap-2">
          {!user && (
            <Link
              href="/cadastro"
              className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            >
              Criar conta
            </Link>
          )}
          <Link
            href="/planos"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
            style={{ backgroundColor: "var(--accent)", color: "#0a0e1a" }}
          >
            <Zap size={13} />
            {!user ? "Ver Planos" : "Fazer Upgrade"}
          </Link>
        </div>
      </div>
    </div>
  );
}
