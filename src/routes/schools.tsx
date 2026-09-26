import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { DataTable } from "@/components/app/DataTable";
import { schoolColumns } from "@/components/app/columns";
import { PageHeader, LoadingState } from "@/components/app/ui";
import { useSchools, useScope } from "@/lib/queries";

export const Route = createFileRoute("/schools")({
  head: () => ({ meta: [
    { title: "Schools — SRGS" },
    { name: "description", content: "Registered schools, verification status and resource gap scores." },
    { property: "og:title", content: "Schools — SRGS" },
    { property: "og:description", content: "Registered schools, verification status and resource gap scores." },
  ] }),
  component: Page,
});

function Page() {
  const s = useSchools(); const scope = useScope();
  const title = scope.role === "FIELD_COORDINATOR" ? "Assigned Schools" : "Schools";
  if (!s.data) return <AppShell crumb={title}><LoadingState /></AppShell>;
  const ids = scope.schoolIds(s.data);
  const rows = s.data.filter((x) => ids.includes(x.id));
  return (
    <AppShell crumb={title}>
      <PageHeader title={title} description={`${rows.length} schools · ${rows.filter((x) => x.verified).length} verified`} />
      <DataTable rows={rows} columns={schoolColumns} searchText={(x) => `${x.name} ${x.udise} ${x.district} ${x.block}`}
        filters={[{ label: "Districts", options: [...new Set(rows.map((x) => x.district))], value: (x) => x.district }]} />
    </AppShell>
  );
}
