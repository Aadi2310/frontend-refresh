import { useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Bell, ChevronRight, ClipboardCheck, FileBarChart, FlaskConical, LayoutDashboard, ListChecks, LogOut, Menu, School, Settings, ShieldCheck, Users, Wrench, Search, Target, Building2, X } from "lucide-react";
import { useRole } from "@/lib/role";
import { ROLES, ROLE_LABEL, type Role } from "@/lib/types";
import { demoIdentity } from "@/lib/mock-data";
import { API_MODE } from "@/lib/api";
import { cn } from "@/lib/utils";

type Nav = { to: string; label: string; icon: typeof School };
export const NAV: Record<Role, Nav[]> = {
  SCHOOL: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/my-school", label: "My School", icon: Building2 },
    { to: "/assessments", label: "Assessments", icon: ClipboardCheck },
    { to: "/requirements", label: "Requirements", icon: ListChecks },
    { to: "/gap-analysis", label: "Gap Analysis", icon: Target },
    { to: "/reports", label: "Reports", icon: FileBarChart },
  ],
  NGO: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/priority", label: "Priority Requirements", icon: ShieldCheck },
    { to: "/requirements", label: "Requirements", icon: ListChecks },
    { to: "/interventions", label: "Interventions", icon: Wrench },
    { to: "/reports", label: "Reports", icon: FileBarChart },
  ],
  ADMIN: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/schools", label: "Schools", icon: School },
    { to: "/assessments", label: "Assessments", icon: ClipboardCheck },
    { to: "/requirements", label: "Requirements", icon: ListChecks },
    { to: "/priority", label: "Priority Rankings", icon: ShieldCheck },
    { to: "/reports", label: "Reports", icon: FileBarChart },
    { to: "/users", label: "User Management", icon: Users },
  ],
  FIELD_COORDINATOR: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/schools", label: "Assigned Schools", icon: School },
    { to: "/assessments", label: "Assessments", icon: ClipboardCheck },
    { to: "/requirements", label: "Assigned Requirements", icon: ListChecks },
    { to: "/priority", label: "Priority Rankings", icon: ShieldCheck },
  ],
};

export function AppShell({ children, crumb }: { children: ReactNode; crumb: string }) {
  const { role, setRole } = useRole();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const id = demoIdentity[role];

  const sidebar = (
    <nav aria-label="Primary" className="flex h-full w-60 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground"><FlaskConical className="h-4 w-4" /></div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-primary">SRGS</p>
          <p className="text-[10px] uppercase tracking-wider">Science Resource Gap System</p>
        </div>
      </div>
      <p className="px-4 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider opacity-60">{ROLE_LABEL[role]} workspace</p>
      <ul className="flex-1 space-y-0.5 px-2">
        {NAV[role].map((n) => {
          const active = loc.pathname === n.to;
          return (
            <li key={n.to}>
              <Link to={n.to} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-2.5 rounded px-2.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary",
                  active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-[inset_3px_0_0_var(--secondary)]" : "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground")}>
                <n.icon className="h-4 w-4" aria-hidden />{n.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-0.5 border-t border-sidebar-border p-2">
        <button className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-sm hover:bg-sidebar-accent/60"><Settings className="h-4 w-4" />Settings</button>
        <Link to="/" className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-sm hover:bg-sidebar-accent/60"><LogOut className="h-4 w-4" />Logout</Link>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="relative h-full w-60">{sidebar}</div>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute left-64 top-3 rounded bg-card p-1.5"><X className="h-4 w-4" /></button>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded p-1.5 hover:bg-accent lg:hidden"><Menu className="h-5 w-5" /></button>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{ROLE_LABEL[role]}</span>
            <ChevronRight className="hidden h-3.5 w-3.5 sm:inline" />
            <span className="font-medium text-foreground">{crumb}</span>
          </nav>
          <label className="relative ml-auto hidden md:block">
            <span className="sr-only">Search records</span>
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search schools, requirements…" className="h-8 w-64 rounded border border-input bg-background pl-7 pr-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          {API_MODE === "mock" && (
            <select aria-label="Demo role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="h-8 rounded border border-dashed border-secondary/50 bg-accent px-2 text-xs font-medium text-secondary">
              {ROLES.map((r) => <option key={r} value={r}>Demo: {r}</option>)}
            </select>
          )}
          <button aria-label="Notifications" className="relative rounded p-1.5 hover:bg-accent">
            <Bell className="h-4 w-4" /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-critical" />
          </button>
          <div className="hidden items-center gap-2 border-l border-border pl-3 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {id.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div className="leading-tight">
              <p className="text-xs font-medium">{id.name}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{role}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
