import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { DataTable } from "@/components/app/DataTable";
import { asmColumns } from "@/components/app/columns";
import { PageHeader, LoadingState } from "@/components/app/ui";
import { Btn } from "@/components/app/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAssessments, useSchools, useScope } from "@/lib/queries";

export const Route = createFileRoute("/assessments")({
  head: () => ({ meta: [
    { title: "Assessments — SRGS" },
    { name: "description", content: "Create, submit and verify school science resource assessments." },
    { property: "og:title", content: "Assessments — SRGS" },
    { property: "og:description", content: "Create, submit and verify school science resource assessments." },
  ] }),
  component: Page,
});

function Page() {
  const a = useAssessments(), s = useSchools(); const scope = useScope();
  const [open, setOpen] = useState(false);
  if (!a.data || !s.data) return <AppShell crumb="Assessments"><LoadingState /></AppShell>;
  const ids = scope.schoolIds(s.data);
  const rows = a.data.filter((x) => ids.includes(x.schoolId));
  return (
    <AppShell crumb="Assessments">
      <PageHeader title="Assessments" description={scope.role === "SCHOOL" ? "Your school's laboratory and resource assessments." : "Submitted assessments awaiting or past verification."}
        actions={scope.role === "SCHOOL" && <Btn onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Create assessment</Btn>} />
      <DataTable rows={rows} columns={asmColumns} searchText={(x) => `${x.id} ${x.schoolName} ${x.assessor}`}
        filters={[{ label: "Statuses", options: ["DRAFT", "SUBMITTED", "VERIFIED", "REJECTED"], value: (x) => x.status }]} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create assessment</DialogTitle><DialogDescription>Starts a new draft. You can save progress and submit later.</DialogDescription></DialogHeader>
          <form id="asm" className="space-y-3" onSubmit={(e) => { e.preventDefault(); setOpen(false); toast.success("Draft assessment created"); }}>
            <label className="block text-sm font-medium">Academic year <span className="text-critical">*</span>
              <select required className="mt-1 h-9 w-full rounded border border-input bg-background px-2 text-sm font-normal"><option>2026–27</option><option>2025–26</option></select>
            </label>
            <label className="block text-sm font-medium">Assessor name <span className="text-critical">*</span>
              <input required className="mt-1 h-9 w-full rounded border border-input bg-background px-2.5 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <span className="mt-1 block text-xs font-normal text-muted-foreground">Staff member responsible for the inventory check.</span>
            </label>
          </form>
          <DialogFooter><Btn variant="outline" onClick={() => setOpen(false)}>Cancel</Btn><Btn type="submit" form="asm">Create draft</Btn></DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
