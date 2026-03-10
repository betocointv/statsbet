"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Crown, BarChart2, Search, Shield, ShieldOff,
  X, Check, LayoutDashboard, ChevronDown,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
  type PieLabelRenderProps,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUsers, adminUpdateUser,
  type User, type Plan, planLabel,
} from "@/lib/auth";

// ─── helpers ─────────────────────────────────────────────────────────────────

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function fmtMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

type UserRow = Omit<User & { password: string }, never>;

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color?: string }) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>{label}</p>
      <p className="text-3xl font-black" style={{ color: color ?? "var(--text-primary)" }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{sub}</p>}
    </div>
  );
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────

const PLAN_STYLE: Record<Plan, { bg: string; text: string }> = {
  free:    { bg: "rgba(160,160,180,0.15)", text: "var(--text-secondary)" },
  pro:     { bg: "rgba(0,230,118,0.15)",   text: "var(--accent)" },
  premium: { bg: "rgba(168,85,247,0.15)",  text: "#a855f7" },
};

function PlanBadge({ plan }: { plan: Plan }) {
  const s = PLAN_STYLE[plan];
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {planLabel(plan).toUpperCase()}
    </span>
  );
}

// ─── Modal "Alterar Plano" ────────────────────────────────────────────────────

const DURATIONS = [1, 2, 3, 6, 12];

function PlanModal({
  user,
  onClose,
  onSave,
}: {
  user: UserRow;
  onClose: () => void;
  onSave: (userId: string, plan: Plan, months?: number) => void;
}) {
  const [plan, setPlan] = useState<Plan>(user.plan);
  const [months, setMonths] = useState(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-sm rounded-2xl border p-6 space-y-5"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg" style={{ color: "var(--text-primary)" }}>Alterar Plano</h3>
          <button onClick={onClose}><X size={18} style={{ color: "var(--text-secondary)" }} /></button>
        </div>

        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Usuário</p>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user.name}</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{user.email}</p>
        </div>

        {/* Plan select */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Plano</p>
          <div className="relative">
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as Plan)}
              className="w-full appearance-none px-4 py-2.5 rounded-xl text-sm outline-none pr-9"
              style={{
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <option value="free">Grátis</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-secondary)" }} />
          </div>
        </div>

        {/* Duration — só se não for free */}
        {plan !== "free" && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
              Duração <span style={{ color: "var(--accent)" }}>({months} {months === 1 ? "mês" : "meses"})</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setMonths(d)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    backgroundColor: months === d ? "var(--accent)" : "var(--surface-2)",
                    color: months === d ? "#000" : "var(--text-secondary)",
                    border: `1px solid ${months === d ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {d}m
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
              Expira em: <strong style={{ color: "var(--text-primary)" }}>
                {fmtDate(addMonths(new Date(), months).toISOString())}
              </strong>
            </p>
          </div>
        )}

        <button
          onClick={() => onSave(user.id, plan, plan !== "free" ? months : undefined)}
          className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ backgroundColor: "var(--accent)", color: "#000" }}
        >
          <Check size={15} />
          Confirmar
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab({ allUsers }: { allUsers: UserRow[] }) {
  const total   = allUsers.length;
  const free    = allUsers.filter(u => u.plan === "free").length;
  const pro     = allUsers.filter(u => u.plan === "pro").length;
  const premium = allUsers.filter(u => u.plan === "premium").length;

  const pieData = [
    { name: "Grátis",   value: free,    color: "var(--text-secondary)" },
    { name: "Pro",      value: pro,     color: "var(--accent)" },
    { name: "Premium",  value: premium, color: "#a855f7" },
  ].filter(d => d.value > 0);

  // Últimos 6 meses
  const monthKeys = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: fmtMonth(d.toISOString()) };
  });

  const areaData = monthKeys.map(({ key, label }) => ({
    label,
    cadastros: allUsers.filter(u => u.createdAt.startsWith(key)).length,
  }));

  const barData = monthKeys.map(({ key, label }) => {
    const month = allUsers.filter(u => u.createdAt.startsWith(key));
    return {
      label,
      free:    month.filter(u => u.plan === "free").length,
      pro:     month.filter(u => u.plan === "pro").length,
      premium: month.filter(u => u.plan === "premium").length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de usuários" value={total} />
        <StatCard label="Plano Grátis"  value={free}    color="var(--text-secondary)" />
        <StatCard label="Plano Pro"     value={pro}     color="var(--accent)"  sub={pro > 0 ? `${Math.round(pro / total * 100)}%` : undefined} />
        <StatCard label="Plano Premium" value={premium} color="#a855f7"        sub={premium > 0 ? `${Math.round(premium / total * 100)}%` : undefined} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie */}
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>Distribuição por Plano</h3>
          {total === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--text-secondary)" }}>Sem usuários ainda</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }: PieLabelRenderProps) => `${String(name ?? "")} ${Math.round(((percent as number) ?? 0) * 100)}%`} labelLine={false} fontSize={11}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} usuários`]} contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Area */}
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>Cadastros por Mês</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="cadastros" stroke="var(--accent)" strokeWidth={2} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>Plano por Mês</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="free"    name="Grátis"  fill="var(--text-secondary)" radius={[3, 3, 0, 0]} stackId="a" />
            <Bar dataKey="pro"     name="Pro"     fill="var(--accent)"         radius={[3, 3, 0, 0]} stackId="a" />
            <Bar dataKey="premium" name="Premium" fill="#a855f7"               radius={[3, 3, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab({
  allUsers,
  currentUserId,
  onPlanChange,
  onToggleAdmin,
}: {
  allUsers: UserRow[];
  currentUserId: string;
  onPlanChange: (user: UserRow) => void;
  onToggleAdmin: (user: UserRow) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allUsers;
    return allUsers.filter(u => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
  }, [allUsers, query]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--surface-2)" }}>
                {["#", "Nome", "E-mail", "Plano", "Expira", "Criado", "Admin", "Ações"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
                    {query ? "Nenhum usuário encontrado" : "Sem usuários cadastrados"}
                  </td>
                </tr>
              )}
              {filtered.map((u, i) => (
                <tr
                  key={u.id}
                  className="border-t transition-colors hover:bg-white/[0.02]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{i + 1}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
                    {u.name}
                    {u.id === currentUserId && (
                      <span className="ml-1 text-xs" style={{ color: "var(--text-secondary)" }}>(você)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                  <td className="px-4 py-3"><PlanBadge plan={u.plan} /></td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                    {u.planExpiresAt ? fmtDate(u.planExpiresAt) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                    {fmtDate(u.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {u.isAdmin ? (
                      <Shield size={14} style={{ color: "var(--accent)" }} />
                    ) : (
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPlanChange(u)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: "var(--surface-2)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                      >
                        <Crown size={11} className="inline mr-1" />
                        Plano
                      </button>
                      <button
                        onClick={() => onToggleAdmin(u)}
                        disabled={u.id === currentUserId}
                        title={u.id === currentUserId ? "Não pode alterar seu próprio admin" : u.isAdmin ? "Remover admin" : "Tornar admin"}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: u.isAdmin ? "rgba(255,68,68,0.1)" : "rgba(0,230,118,0.1)",
                          color: u.isAdmin ? "var(--live)" : "var(--accent)",
                          border: `1px solid ${u.isAdmin ? "rgba(255,68,68,0.2)" : "rgba(0,230,118,0.2)"}`,
                        }}
                      >
                        {u.isAdmin ? <ShieldOff size={11} className="inline mr-1" /> : <Shield size={11} className="inline mr-1" />}
                        {u.isAdmin ? "Remover" : "Admin"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {filtered.length} de {allUsers.length} usuário(s)
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "dashboard" | "usuarios";

export default function AdminClient() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("dashboard");
  const [allUsers, setAllUsers] = useState<UserRow[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  // Auth guard
  useEffect(() => {
    if (user === null) return; // ainda carregando
    if (!user?.isAdmin) {
      router.replace("/");
    }
  }, [user, router]);

  // Carrega usuários
  useEffect(() => {
    const raw = getUsers();
    setAllUsers(Object.values(raw));
  }, []);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  function handleSavePlan(userId: string, plan: Plan, months?: number) {
    const planExpiresAt = months
      ? addMonths(new Date(), months).toISOString()
      : undefined;

    const result = adminUpdateUser(userId, { plan, planExpiresAt });
    if ("error" in result) {
      showToast(`Erro: ${result.error}`);
    } else {
      // Atualizar lista local
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, plan, planExpiresAt } : u));
      refreshUser();
      showToast(`Plano atualizado para ${planLabel(plan)}!`);
    }
    setSelectedUser(null);
  }

  function handleToggleAdmin(targetUser: UserRow) {
    if (targetUser.id === user?.id) return;
    const result = adminUpdateUser(targetUser.id, { isAdmin: !targetUser.isAdmin });
    if ("error" in result) {
      showToast(`Erro: ${result.error}`);
    } else {
      setAllUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, isAdmin: !u.isAdmin } : u));
      showToast(targetUser.isAdmin ? "Admin removido." : "Usuário promovido a admin!");
    }
  }

  if (!user?.isAdmin) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
    { id: "usuarios",  label: "Usuários",  icon: <Users size={15} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,230,118,0.1)" }}
        >
          <BarChart2 size={20} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>Back Office</h1>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Painel administrativo — StatsBet</p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ backgroundColor: "var(--surface)" }}
      >
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: tab === t.id ? "var(--accent)" : "transparent",
              color: tab === t.id ? "#000" : "var(--text-secondary)",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "dashboard" && <DashboardTab allUsers={allUsers} />}
      {tab === "usuarios" && (
        <UsersTab
          allUsers={allUsers}
          currentUserId={user.id}
          onPlanChange={setSelectedUser}
          onToggleAdmin={handleToggleAdmin}
        />
      )}

      {/* Plan Modal */}
      {selectedUser && (
        <PlanModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSavePlan}
        />
      )}

      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl"
          style={{ backgroundColor: "var(--accent)", color: "#000" }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
