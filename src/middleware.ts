import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de segurança — StatsBet
 *
 * Responsabilidades:
 * 1. Reforçar security headers em todas as respostas (defesa em profundidade
 *    além do next.config.ts, que não cobre redirecionamentos internos).
 * 2. Bloquear rotas protegidas para usuários sem sessão ativa.
 * 3. Bloquear acesso direto a arquivos sensíveis.
 *
 * ⚠️  Limitação MVP: a sessão é verificada via cookie simples "sb_session"
 * que é definido pelo AuthContext no login. Como a auth é client-side, este
 * cookie NÃO é criptografado e pode ser forjado. Em produção, usar JWT
 * assinado ou NextAuth.js para verificação real no servidor.
 */

// Rotas que exigem login
const PROTECTED_ROUTES = ["/banca", "/value-bets", "/alertas", "/perfil"];

// Rotas de autenticação (redirecionar para home se já logado)
const AUTH_ROUTES = ["/entrar", "/cadastro"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response     = NextResponse.next();

  // ─── 1. Security headers extras em todas as respostas ─────────────────────
  // (Complementa o next.config.ts — cobre rotas dinâmicas e redirects)
  response.headers.set("X-Frame-Options",        "DENY");
  response.headers.set("X-Content-Type-Options",  "nosniff");
  response.headers.set("Referrer-Policy",         "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy",      "camera=(), microphone=(), geolocation=(), payment=()");
  // Remover header que expõe tecnologia usada
  response.headers.delete("X-Powered-By");

  // ─── 2. Bloquear acesso a arquivos de ambiente ────────────────────────────
  if (pathname.startsWith("/.env") || pathname.startsWith("/.git")) {
    return new NextResponse(null, { status: 404 });
  }

  // ─── 3. Proteção de rotas ─────────────────────────────────────────────────
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute  = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Cookie definido pelo AuthContext quando usuário faz login
  const session = request.cookies.get("sb_session")?.value;
  const isLoggedIn = Boolean(session);

  if (isProtected && !isLoggedIn) {
    // Redirecionar para login, preservando a URL de destino
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isLoggedIn) {
    // Já logado — redirecionar para home
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplicar middleware em todas as rotas EXCETO:
     * - _next/static  (assets estáticos)
     * - _next/image   (otimização de imagens)
     * - favicon.ico
     * - arquivos com extensão (ex: .png, .svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)).*)",
  ],
};
