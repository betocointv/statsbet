import { Check, Zap, Star, Trophy } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0",
    period: "para sempre",
    icon: Star,
    color: "var(--text-secondary)",
    description: "Para quem está começando",
    features: [
      "Resultados em tempo real",
      "Odds informativas (1X2)",
      "H2H últimas 3 partidas",
      "1 análise de Value Bet por dia",
      "Tabelas das ligas principais",
    ],
    locked: [
      "xG (Gols Esperados)",
      "Estatísticas completas",
      "Todas as análises de Value Bet",
      "Alertas personalizados",
      "Simulador de Banca",
    ],
    cta: "Começar Grátis",
    ctaHref: "/",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 29",
    period: "por mês",
    icon: Zap,
    color: "var(--accent)",
    description: "Para quem quer análises completas",
    features: [
      "Tudo do plano Free",
      "xG (Gols Esperados)",
      "Estatísticas completas de partidas",
      "Todas as análises de Value Bet",
      "H2H completo (últimos 10 jogos)",
      "Odds comparativas de múltiplas casas",
      "Escalação e análise tática",
      "Alertas por e-mail",
      "BetScore (índice de apostabilidade)",
    ],
    locked: ["Alertas WhatsApp/Telegram", "Simulador de Banca avançado"],
    cta: "Assinar Pro",
    ctaHref: "/assinar/pro",
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 59",
    period: "por mês",
    icon: Trophy,
    color: "#ffd700",
    description: "Para análise profissional",
    features: [
      "Tudo do plano Pro",
      "Alertas WhatsApp & Telegram",
      "Simulador de Banca completo",
      "ROI e histórico de sinais",
      "Análise de movimento de odds",
      "Suporte prioritário",
      "API de dados (em breve)",
      "Relatórios semanais por e-mail",
    ],
    locked: [],
    cta: "Assinar Premium",
    ctaHref: "/assinar/premium",
    highlighted: false,
  },
];

export default function PlanosPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-black mb-3" style={{ color: "var(--text-primary)" }}>
          Escolha seu plano
        </h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Analise com mais inteligência. Cancele quando quiser.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className="rounded-2xl p-6 border flex flex-col relative"
              style={{
                backgroundColor: plan.highlighted ? "var(--surface-2)" : "var(--surface)",
                borderColor: plan.highlighted ? plan.color : "var(--border)",
                boxShadow: plan.highlighted ? `0 0 30px rgba(0,230,118,0.1)` : undefined,
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full"
                  style={{ backgroundColor: plan.color, color: "#0a0e1a" }}
                >
                  MAIS POPULAR
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${plan.color}20` }}
                >
                  <Icon size={20} style={{ color: plan.color }} />
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{plan.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{plan.description}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-black" style={{ color: "var(--text-primary)" }}>{plan.price}</span>
                <span className="text-sm ml-1" style={{ color: "var(--text-secondary)" }}>/{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={14} className="shrink-0 mt-0.5" style={{ color: plan.color }} />
                    <span style={{ color: "var(--text-primary)" }}>{f}</span>
                  </li>
                ))}
                {plan.locked.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm opacity-30">
                    <Check size={14} className="shrink-0 mt-0.5" style={{ color: "var(--text-secondary)" }} />
                    <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className="block w-full py-3 rounded-xl font-bold text-sm text-center transition-all hover:opacity-90"
                style={
                  plan.highlighted
                    ? { backgroundColor: plan.color, color: "#0a0e1a" }
                    : { backgroundColor: "var(--surface-2)", color: "var(--text-primary)", border: "1px solid var(--border)" }
                }
              >
                {plan.cta}
              </Link>
            </div>
          );
        })}
      </div>

      {/* FAQ / Guarantee */}
      <div
        className="rounded-2xl p-6 border text-center"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <p className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Garantia de 7 dias
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Não ficou satisfeito? Devolvemos 100% do seu dinheiro, sem perguntas.
        </p>
      </div>
    </div>
  );
}
