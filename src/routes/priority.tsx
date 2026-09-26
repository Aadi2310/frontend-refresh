import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader, Panel, LoadingState } from "@/components/app/ui";
import { PriorityBadge, RequirementBadge } from "@/components/app/badges";
import { PriorityBreakdown } from "@/components/app/PriorityBreakdown";
import { RequirementDrawer } from "@/components/app/RequirementDrawer";
import { Btn } from "@/components/app/Button";
import { useRequirements, useSchools, useScope } from "@/lib/queries";
import type { Requirement } from "@/lib/types";

export const Route = createFileRoute("/priority")({
  head: () => ({ meta: [
    { title: "Priority Rankings — SRGS" },
    { name: "description", content: "Requirements ranked by severity, importance, students affected, alternatives and condition." },
    { property: "og:title", content: "Priority Rankings — SRGS" },
    { property: "og:description", content: "Requirements ranked by severity, importance, students affected, alternatives and condition." },
  ] }),
  component: Page,
});

function Page() {
  const r = useRequirements(), s = useSchools(); const scope = useScope();
  const [sel, setSel] = useState<Requirement | null>(null);
  const title = scope.role === "NGO" ? "Priority Requirements" : "Priority Rankings";
  if (!r.data || !s.data) return <AppShell crumb={title}><LoadingState /></AppShell>;
  const ids = scope.role === "FIELD_COORDINATOR" ? scope.schoolIds(s.data) : null;
  const rows = r.data.filter((x) => !["COMPLETED", "CLOSED", "NOT_FEASIBLE"].includes(x.status) && (!ids || ids.includes(x.schoolId))).sort((a, b) => b.score - a.score);
  return (
    <AppShell crumb={title}>
      <PageHeader title={title} description="Score (0–100) combines severity, importance, students affected, alternative availability and condition." />
      <ol className="space-y-3">
        {rows.map((x, i) => (
          <li key={x.id}>
            <Panel bodyClass="grid gap-4 p-4 md:grid-cols-[48px_1fr_320px]">
              <div className="text-2xl font-semibold tabular-nums text-muted-foreground">#{i + 1}</div>
              <div>
                <div className="flex flex-wrap items-center gap-2"><PriorityBadge p={x.priority} /><RequirementBadge s={x.status} /><span className="font-mono text-xs text-muted-foreground">{x.id}</span></div>
                <p className="mt-1.5 font-medium">{x.resource} <span className="font-normal text-muted-foreground">× {x.quantity}</span></p>
                <p className="text-sm text-muted-foreground">{x.schoolName} · {x.district}</p>
                <div className="mt-3 flex items-center gap-3"><span className="text-xl font-semibold tabular-nums">{x.score}</span><span className="text-xs text-muted-foreground">priority score</span><Btn variant="outline" className="ml-auto" onClick={() => setSel(x)}>View requirement</Btn></div>
              </div>
              <PriorityBreakdown b={x.breakdown} />
            </Panel>
          </li>
        ))}
      </ol>
      <RequirementDrawer req={sel} onClose={() => setSel(null)} />
    </AppShell>
  );
}
