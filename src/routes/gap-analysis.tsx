import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader, Panel, Progress, LoadingState } from "@/components/app/ui";
import { PriorityBadge, RequirementBadge } from "@/components/app/badges";
import { useRequirements } from "@/lib/queries";
import { demoIdentity } from "@/lib/mock-data";

export const Route = createFileRoute("/gap-analysis")({
  head: () => ({ meta: [
    { title: "Gap Analysis — SRGS" },
    { name: "description", content: "Category-wise view of your school's science resource gaps." },
    { property: "og:title", content: "Gap Analysis — SRGS" },
    { property: "og:description", content: "Category-wise view of your school's science resource gaps." },
  ] }),
  component: Page,
});

function Page() {
  const r = useRequirements();
  if (!r.data) return <AppShell crumb="Gap Analysis"><LoadingState /></AppShell>;
  const rows = r.data.filter((x) => x.schoolId === demoIdentity.SCHOOL.schoolId);
  const cats = [...new Set(rows.map((x) => x.category))];
  return (
    <AppShell crumb="Gap Analysis">
      <PageHeader title="Gap Analysis" description="Derived from your latest verified assessment." />
      <div className="grid gap-4 lg:grid-cols-2">
        {cats.map((c) => {
          const items = rows.filter((x) => x.category === c);
          const avg = Math.round(items.reduce((s, x) => s + x.score, 0) / items.length);
          return (
            <Panel key={c} title={c} action={<span className="text-xs text-muted-foreground">Avg. score {avg}</span>}>
              <Progress value={avg} tone={avg >= 75 ? "critical" : avg >= 55 ? "high" : "low"} />
              <ul className="mt-3 divide-y divide-border">
                {items.map((x) => (
                  <li key={x.id} className="flex flex-wrap items-center gap-2 py-2 text-sm"><span className="flex-1">{x.resource} <span className="text-muted-foreground">× {x.quantity}</span></span><PriorityBadge p={x.priority} /><RequirementBadge s={x.status} /></li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </AppShell>
  );
}
