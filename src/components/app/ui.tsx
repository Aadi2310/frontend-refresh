import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Activity } from "@/lib/types";

export function Panel({ title, action, children, className, bodyClass }: { title?: string; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={cn("rounded-md border border-border bg-card shadow-[0_1px_2px_0_oklch(0.2_0.02_260/0.04)]", className)}>
      {title && (
        <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <h2 className="text-[13px] font-semibold text-foreground">{title}</h2>
          {action}
        </header>
      )}
      <div className={cn("p-4", bodyClass)}>{children}</div>
    </section>
  );
}

export function Kpi({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: ReactNode; accent?: "critical" | "high" | "low" | "primary" | "secondary" }) {
  const bar = { critical: "bg-critical", high: "bg-high", low: "bg-low", primary: "bg-primary", secondary: "bg-secondary" }[accent ?? "primary"];
  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-card px-4 py-3">
      <span className={cn("absolute inset-y-0 left-0 w-[3px]", bar)} aria-hidden />
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Progress({ value, tone = "primary" }: { value: number; tone?: "primary" | "secondary" | "critical" | "high" | "low" }) {
  const c = { primary: "bg-primary", secondary: "bg-secondary", critical: "bg-critical", high: "bg-high", low: "bg-low" }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full", c)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function AlertBox({ kind, title, children }: { kind: "error" | "warning" | "info" | "success"; title: string; children?: ReactNode }) {
  const m = {
    error: ["border-critical/30 bg-critical-soft", "text-critical", XCircle],
    warning: ["border-high/30 bg-high-soft", "text-high", AlertTriangle],
    info: ["border-medium/25 bg-medium-soft", "text-medium", Info],
    success: ["border-low/25 bg-low-soft", "text-low", CheckCircle2],
  } as const;
  const [box, ic, Icon] = m[kind];
  return (
    <div role="alert" className={cn("flex gap-2.5 rounded-md border px-3 py-2.5", box)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", ic)} aria-hidden />
      <div className="text-sm"><p className="font-medium text-foreground">{title}</p>{children && <p className="text-xs text-muted-foreground">{children}</p>}</div>
    </div>
  );
}

export function Timeline({ items }: { items: Activity[] }) {
  const dot = { info: "bg-medium", success: "bg-low", warning: "bg-high", error: "bg-critical" };
  return (
    <ol className="relative space-y-3 border-l border-border pl-4">
      {items.map((a) => (
        <li key={a.id} className="relative">
          <span className={cn("absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ring-2 ring-card", dot[a.kind])} aria-hidden />
          <p className="text-sm text-foreground">{a.text}</p>
          <p className="text-xs text-muted-foreground">{a.actor} · {a.at}</p>
        </li>
      ))}
    </ol>
  );
}

export const EmptyState = ({ title, text }: { title: string; text?: string }) => (
  <div className="flex flex-col items-center py-10 text-center"><Inbox className="h-8 w-8 text-muted-foreground" aria-hidden /><p className="mt-2 text-sm font-medium">{title}</p>{text && <p className="text-xs text-muted-foreground">{text}</p>}</div>
);
export const LoadingState = () => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>
);
export const ErrorState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-critical"><AlertCircle className="h-4 w-4" />{message}</div>
);

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
