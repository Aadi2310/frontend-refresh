import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { DataTable } from "@/components/app/DataTable";
import { reqColumns } from "@/components/app/columns";
import { RequirementDrawer } from "@/components/app/RequirementDrawer";
import { PageHeader, LoadingState, Kpi } from "@/components/app/ui";
import { useRequirements } from "@/lib/queries";
import { demoIdentity } from "@/lib/mock-data";
import type { Requirement } from "@/lib/types";

export const Route = createFileRoute("/interventions")({
  head: () => ({ meta: [
    { title: "Interventions — SRGS" },
    { name: "description", content: "Track accepted requirements and intervention progress." },
    { property: "og:title", content: "Interventions — SRGS" },
    { property: "og:description", content: "Track accepted requirements and intervention progress." },
  ] }),
  component: Page,
});

function Page() {
  const r = useRequirements(); const [sel, setSel] = useState<Requirement | null>(null);
  if (!r.data) return <AppShell crumb="Interventions"><LoadingState /></AppShell>;
  const rows = r.data.filter((x) => x.ngo === demoIdentity.NGO.org);
  const c = (s: string[]) => rows.filter((x) => s.includes(x.status)).length;
  return (
    <AppShell crumb="Interventions">
      <PageHeader title="Interventions" description={`Requirements accepted by ${demoIdentity.NGO.org}.`} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Kpi label="Accepted" value={c(["ACCEPTED"])} accent="secondary" />
        <Kpi label="In progress" value={c(["IN_PROGRESS", "PARTIALLY_COMPLETED"])} accent="high" />
        <Kpi label="Completed" value={c(["COMPLETED", "CLOSED"])} accent="low" />
      </div>
      <DataTable rows={rows} columns={reqColumns} onRowClick={setSel} searchText={(x) => `${x.id} ${x.resource} ${x.schoolName}`} />
      <RequirementDrawer req={sel} onClose={() => setSel(null)} />
    </AppShell>
  );
}
