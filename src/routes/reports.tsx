import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader, Panel } from "@/components/app/ui";
import { Btn } from "@/components/app/Button";
import { useScope } from "@/lib/queries";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports — SRGS" },
    { name: "description", content: "Download assessment, requirement and intervention reports." },
    { property: "og:title", content: "Reports — SRGS" },
    { property: "og:description", content: "Download assessment, requirement and intervention reports." },
  ] }),
  component: Page,
});

const REPORTS: Record<Role, [string, string][]> = {
  SCHOOL: [["School assessment summary", "Latest verified assessment with item-level findings"], ["Requirement status report", "All requirements raised by your school"]],
  NGO: [["Intervention progress", "Status of all accepted requirements"], ["Impact summary", "Students reached and resources delivered"]],
  ADMIN: [["State-wide gap report", "Gaps by district, category and priority"], ["Assessment pipeline", "Submission and verification turnaround"], ["NGO performance", "Acceptance and completion rates by organisation"]],
  FIELD_COORDINATOR: [["Assigned schools report", "Status of your assigned schools"]],
};

function Page() {
  const { role } = useScope();
  return (
    <AppShell crumb="Reports">
      <PageHeader title="Reports" description="Reports are generated from current data at the time of download." />
      <Panel bodyClass="p-0">
        <ul className="divide-y divide-border">
          {REPORTS[role].map(([t, d]) => (
            <li key={t} className="flex items-center gap-3 px-4 py-3">
              <FileText className="h-5 w-5 text-secondary" aria-hidden />
              <div className="flex-1"><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
              <Btn variant="outline" onClick={() => toast.info(`Preparing “${t}”`)}><Download className="h-4 w-4" />PDF</Btn>
              <Btn variant="ghost" onClick={() => toast.info(`Preparing “${t}”`)}>CSV</Btn>
            </li>
          ))}
        </ul>
      </Panel>
    </AppShell>
  );
}
