"use client";

import MatchCard from "@/components/MatchCard";
import ProGate from "@/components/ProGate";
import type { Match } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";

export default function ValueBetsClient({ valueBets }: { valueBets: Match[] }) {
  const { user } = useAuth();
  const isPro = user && (user.plan === "pro" || user.plan === "premium");
  const freeLimit = 1;
  const freeMatches = valueBets.slice(0, freeLimit);
  const lockedMatches = valueBets.slice(freeLimit);

  return (
    <div className="space-y-4">
      {/* Grátis */}
      {freeMatches.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>
            Disponíveis no Plano Gratuito
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {freeMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}

      {/* PRO — bloqueados ou liberados */}
      {lockedMatches.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>
            {isPro ? "Todos os Value Bets" : `Exclusivo PRO — ${lockedMatches.length} value bet${lockedMatches.length > 1 ? "s" : ""} bloqueado${lockedMatches.length > 1 ? "s" : ""}`}
          </p>

          {isPro ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lockedMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <ProGate
              requiredPlan="pro"
              message={`${lockedMatches.length} value bet${lockedMatches.length > 1 ? "s" : ""} disponíve${lockedMatches.length > 1 ? "is" : "l"} no plano PRO`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lockedMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </ProGate>
          )}
        </div>
      )}

      {valueBets.length === 0 && (
        <div
          className="rounded-2xl p-12 border text-center"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <p className="text-3xl mb-3">🎯</p>
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Nenhum value bet detectado agora
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Nosso algoritmo monitora as odds em tempo real
          </p>
        </div>
      )}
    </div>
  );
}
