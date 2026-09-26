import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { DataTable } from "@/components/app/DataTable";
import { reqColumns } from "@/components/app/columns";
import { RequirementDrawer } from "@/components/app/RequirementDrawer";
import { PageHeader, LoadingState, ErrorState } from "@/components/app/ui";
import { useRequirements, useSchools, useScope } from "@/lib/queries";
import type { Requirement } from "@/lib/types";

export const Route = createFileRoute("/requirements")({
  head: () => ({ meta: [
    { title: "Requirements — SRGS" },
    { name: "description", content: "Browse, filter and track science resource requirements." },
    { property: "og:title", content: "Requirements — SRGS" },
    { property: "og:description", content: "Browse, filter and track science resource requirements." },
  ] }),
  component: Page,
});

function Page() {
  const r = useRequirements(), s = useSchools(); const scope = useScope();
  const [sel, setSel] = useState<Requirement | null>(null);
  const label = scope.role === "FIELD_COORDINATOR" ? "Assigned Requirements" : "Requirements";
  let body;
  if (r.error) body = <ErrorState message={(r.error as Error).message} />;
  else if (!r.data || !s.data) body = <LoadingState />;
  else {
    const ids = scope.role === "NGO" ? null : scope.schoolIds(s.data);
    const rows = ids ? r.data.filter((x) => ids.includes(x.schoolId)) : r.data;
    body = (
      <DataTable rows={rows} columns={reqColumns} onRowClick={setSel}
        searchText={(x) => `${x.id} ${x.resource} ${x.schoolName} ${x.district}`}
        filters={[
          { label: "Statuses", options: ["OPEN", "UNDER_REVIEW", "ACCEPTED", "IN_PROGRESS", "PARTIALLY_COMPLETED", "COMPLETED", "NOT_FEASIBLE", "DISPUTED", "CLOSED"], value: (x) => x.status },
          { label: "Priorities", options: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], value: (x) => x.priority },
        ]} />
    );
  }
  return (
    <AppShell crumb={label}>
      <PageHeader title={label} description="Select a row to see details and the priority score breakdown." />
      {body}
      <RequirementDrawer req={sel} onClose={() => setSel(null)} />
    </AppShell>
  );
}
