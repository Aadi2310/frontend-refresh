import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { DataTable } from "@/components/app/DataTable";
import { PageHeader, LoadingState } from "@/components/app/ui";
import { useUsers } from "@/lib/queries";
import { ROLES, ROLE_LABEL, type User } from "@/lib/types";
import type { Column } from "@/components/app/DataTable";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [
    { title: "User Management — SRGS" },
    { name: "description", content: "Manage accounts and roles across schools, NGOs and coordinators." },
    { property: "og:title", content: "User Management — SRGS" },
    { property: "og:description", content: "Manage accounts and roles across schools, NGOs and coordinators." },
  ] }),
  component: Page,
});

const cols: Column<User>[] = [
  { key: "n", header: "Name", cell: (u) => <div><p className="font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>, sort: (u) => u.name },
  { key: "r", header: "Role", cell: (u) => <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">{u.role}</span>, sort: (u) => u.role },
  { key: "o", header: "Organisation", cell: (u) => u.org },
  { key: "l", header: "Last login", cell: (u) => <span className="text-xs text-muted-foreground">{u.lastLogin}</span>, sort: (u) => u.lastLogin },
  { key: "a", header: "Status", cell: (u) => <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.active ? "text-low" : "text-muted-foreground"}`}><span className={`h-1.5 w-1.5 rounded-full ${u.active ? "bg-low" : "bg-muted-foreground"}`} />{u.active ? "Active" : "Inactive"}</span> },
];

function Page() {
  const u = useUsers();
  return (
    <AppShell crumb="User Management">
      <PageHeader title="User Management" description="Accounts are managed by the backend; role values are fixed." />
      {!u.data ? <LoadingState /> : (
        <DataTable rows={u.data} columns={cols} searchText={(x) => `${x.name} ${x.email} ${x.org}`}
          filters={[{ label: "Roles", options: ROLES, value: (x) => x.role }]} />
      )}
      <p className="mt-2 text-xs text-muted-foreground">Roles: {ROLES.map((r) => ROLE_LABEL[r]).join(" · ")}</p>
    </AppShell>
  );
}
