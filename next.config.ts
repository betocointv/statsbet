import type { NextConfig } from "next";

// ─── Content Security Policy ─────────────────────────────────────────────────
// Permite inline styles/scripts por causa do padrão do Next.js + Tailwind v4.
// Em produção com nonces configurados, remover 'unsafe-inline' do script-src.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",              // Google Identity Services
  "style-src 'self' 'unsafe-inline' https://accounts.google.com",                             // estilos do botão Google
  "img-src 'self' data: blob: https://media.api-sports.io https://media.football-api.com https://flagcdn.com https://lh3.googleusercontent.com", // avatares Google
  "font-src 'self'",
  "connect-src 'self' https://v3.football.api-sports.io https://accounts.google.com https://oauth2.googleapis.com", // futebol API + Google OAuth
  "frame-src 'self' https://accounts.google.com",                                             // popup de login Google
  "frame-ancestors 'none'",                               // bloqueia clickjacking
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  // Previne clickjacking (redundante com frame-ancestors no CSP, mas por compatibilidade)
  { key: "X-Frame-Options", value: "DENY" },
  // Previne MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controla informações do Referer enviadas
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Força HTTPS por 2 anos (ativar apenas em produção com HTTPS configurado)
  // { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Limita acesso a APIs do browser
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Content Security Policy
  { key: "Content-Security-Policy", value: CSP },
  // Desativa detecção automática de XSS em browsers antigos (substituído pelo CSP)
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.api-sports.io",
        pathname: "/football/teams/**",
      },
      {
        protocol: "https",
        hostname: "media.football-api.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Aplica headers de segurança em todas as rotas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
