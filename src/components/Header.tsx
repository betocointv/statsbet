"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Bell, ChevronDown, Zap, Menu, X,
  LogIn, UserPlus, LogOut, User, Crown, Settings, Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { planLabel, planColor } from "@/lib/auth";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  }

  const navLinks = [
    { label: "Hoje", href: "/" },
    { label: "Ao Vivo", href: "/live", live: true },
    { label: "Value Bets", href: "/value-bets" },
    { label: "Planos", href: "/planos" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 lg:px-6 border-b"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-6 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: "var(--accent)", color: "#0a0e1a" }}
        >
          SB
        </div>
        <span className="font-bold text-lg hidden sm:block" style={{ color: "var(--text-primary)" }}>
          Stats<span style={{ color: "var(--accent)" }}>Bet</span>
        </span>
      </Link>

      {/* Nav — Desktop */}
      <nav className="hidden lg:flex items-center gap-1 mr-4">
        {navLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: "var(--text-secondary)" }}
          >
            {item.live && (
              <span className="w-2 h-2 rounded-full animate-pulse-live" style={{ backgroundColor: "var(--live)" }} />
            )}
            {item.label}
          </Link>
        ))}
        {user?.isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: "var(--accent)" }}
          >
            <Shield size={14} />
            Admin
          </Link>
        )}
      </nav>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Buscar time, liga..."
              className="w-44 sm:w-56 px-3 py-1.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              onBlur={() => setSearchOpen(false)}
            />
            <button onClick={() => setSearchOpen(false)}>
              <X size={18} style={{ color: "var(--text-secondary)" }} />
            </button>
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Search size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
        )}

        {/* Bell — só para logados */}
        {user && (
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
            <Bell size={18} style={{ color: "var(--text-secondary)" }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--live)" }} />
          </button>
        )}

        {/* === Estado: NÃO logado === */}
        {!user && (
          <>
            <Link
              href="/entrar"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              <LogIn size={15} />
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold"
              style={{ backgroundColor: "var(--accent)", color: "#0a0e1a" }}
            >
              <UserPlus size={15} />
              Cadastrar
            </Link>
          </>
        )}

        {/* === Estado: Logado === */}
        {user && (
          <>
            {/* Upgrade PRO — só se não for pro/premium */}
            {user.plan === "free" && (
              <Link
                href="/planos"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
                style={{ backgroundColor: "var(--accent)", color: "#0a0e1a" }}
              >
                <Zap size={12} />
                Upgrade PRO
              </Link>
            )}

            {/* User dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "rgba(0,230,118,0.15)", color: "var(--accent)" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
                    {user.name.split(" ")[0]}
                  </p>
                  <p className="text-xs leading-none mt-0.5" style={{ color: planColor(user.plan) }}>
                    {planLabel(user.plan)}
                  </p>
                </div>
                <ChevronDown size={14} style={{ color: "var(--text-secondary)" }} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-52 rounded-2xl border py-1 shadow-2xl"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{user.email}</p>
                    <span
                      className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${planColor(user.plan)}20`, color: planColor(user.plan) }}
                    >
                      {planLabel(user.plan).toUpperCase()}
                    </span>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <Link
                      href="/perfil"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={14} />
                      Meu Perfil
                    </Link>
                    <Link
                      href="/planos"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Crown size={14} />
                      {user.plan === "free" ? "Fazer Upgrade" : "Meu Plano"}
                    </Link>
                    <Link
                      href="/configuracoes"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={14} />
                      Configurações
                    </Link>
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                        style={{ color: "var(--accent)" }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield size={14} />
                        Back Office
                      </Link>
                    )}
                  </div>

                  <div className="border-t py-1" style={{ borderColor: "var(--border)" }}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      style={{ color: "var(--live)" }}
                    >
                      <LogOut size={14} />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mobile menu toggle */}
        <button
          className="p-2 rounded-lg hover:bg-white/5 transition-colors lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={18} style={{ color: "var(--text-secondary)" }} />
          ) : (
            <Menu size={18} style={{ color: "var(--text-secondary)" }} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="absolute top-16 left-0 right-0 border-b lg:hidden p-4 flex flex-col gap-1"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.live && (
                <span className="w-2 h-2 rounded-full animate-pulse-live" style={{ backgroundColor: "var(--live)" }} />
              )}
              {item.label}
            </Link>
          ))}

          {/* Auth mobile */}
          <div className="border-t pt-3 mt-1 flex flex-col gap-1" style={{ borderColor: "var(--border)" }}>
            {!user ? (
              <>
                <Link
                  href="/entrar"
                  className="px-3 py-2 rounded-lg text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="px-3 py-2 rounded-lg text-sm font-bold text-center"
                  style={{ backgroundColor: "var(--accent)", color: "#0a0e1a" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Criar conta grátis
                </Link>
              </>
            ) : (
              <>
                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                    style={{ color: "var(--accent)" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield size={14} />
                    Back Office
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-left"
                  style={{ color: "var(--live)" }}
                >
                  Sair da conta
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
