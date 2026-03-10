import type { ComponentType } from "react";
import { getTodayMatches } from "@/lib/data-service";
import { USE_REAL_API } from "@/lib/api-football";
import { leagues } from "@/lib/mock-data";
import HomeClient from "@/components/HomeClient";
import { Zap, TrendingUp, Calendar, Target } from "lucide-react";

export const revalidate = 60;

function StatCard({ icon: Icon, label, value, color }: {
  icon: ComponentType<{ size?: number; style?: object }>;
  label: string; value: string; color: string;
}) {
  return (
    <div className="rounded-2xl p-4 border flex items-center gap-4"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const allMatches = await getTodayMatches();
  const liveMatches = allMatches.filter((m) => m.status === "live" || m.status === "halftime");
  const valueBets   = allMatches.filter((m) => m.valueBet);

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {USE_REAL_API && (
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full w-fit"
          style={{ backgroundColor: "rgba(0,230,118,0.1)", color: "var(--accent)", border: "1px solid rgba(0,230,118,0.2)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-live" style={{ backgroundColor: "var(--accent)" }} />
          Dados em tempo real — API-Football
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Zap}        label="Ao Vivo Agora"  value={`${liveMatches.length} jogos`}   color="var(--live)"    />
        <StatCard icon={Calendar}   label="Partidas Hoje"  value={`${allMatches.length} jogos`}     color="var(--accent)"  />
        <StatCard icon={TrendingUp} label="Value Bets"     value={`${valueBets.length} detectados`} color="var(--warning)" />
        <StatCard icon={Target}     label="Apostabilidade" value="Alta Confiança"                   color="#00b0ff"        />
      </div>

      <HomeClient matches={allMatches} leagues={leagues} />
    </div>
  );
}
