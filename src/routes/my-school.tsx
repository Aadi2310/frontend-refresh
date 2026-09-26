import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader, Panel, LoadingState } from "@/components/app/ui";
import { VerifiedBadge } from "@/components/app/badges";
import { Btn } from "@/components/app/Button";
import { useSchools } from "@/lib/queries";
import { demoIdentity } from "@/lib/mock-data";

export const Route = createFileRoute("/my-school")({
  head: () => ({ meta: [
    { title: "My School — SRGS" },
    { name: "description", content: "Update your school profile, enrolment and contact details." },
    { property: "og:title", content: "My School — SRGS" },
    { property: "og:description", content: "Update your school profile, enrolment and contact details." },
  ] }),
  component: Page,
});

const input = "mt-1 h-9 w-full rounded border border-input bg-background px-2.5 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({ label, req, hint, ...p }: { label: string; req?: boolean; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium">{label}{req && <span className="text-critical"> *</span>}
      <input {...p} required={req} className={input} />
      {hint && <span className="mt-1 block text-xs font-normal text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Page() {
  const s = useSchools();
  const sc = s.data?.find((x) => x.id === demoIdentity.SCHOOL.schoolId);
  return (
    <AppShell crumb="My School">
      {!sc ? <LoadingState /> : (
        <form onSubmit={(e) => { e.preventDefault(); toast.success("School profile saved"); }}>
          <PageHeader title="My School" description="Keep your school profile accurate. Changes may require re-verification."
            actions={<><Btn type="button" variant="outline">Cancel</Btn><Btn type="submit">Save changes</Btn></>} />
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="space-y-4 xl:col-span-2">
              <Panel title="School details"><div className="grid gap-4 sm:grid-cols-2">
                <Field label="School name" req defaultValue={sc.name} />
                <Field label="UDISE code" req defaultValue={sc.udise} hint="11-digit government identifier" pattern="\d{11}" />
                <Field label="District" req defaultValue={sc.district} />
                <Field label="Block" req defaultValue={sc.block} />
              </div></Panel>
              <Panel title="Enrolment & staff"><div className="grid gap-4 sm:grid-cols-3">
                <Field label="Students" req type="number" min={0} defaultValue={sc.students} />
                <Field label="Teachers" req type="number" min={0} defaultValue={sc.teachers} />
                <Field label="Science teachers" type="number" min={0} defaultValue={4} />
              </div></Panel>
            </div>
            <Panel title="Verification">
              <VerifiedBadge v={sc.verified} />
              <p className="mt-2 text-sm text-muted-foreground">Verified by the field coordinator on the last site visit ({sc.lastAssessment}).</p>
            </Panel>
          </div>
        </form>
      )}
    </AppShell>
  );
}
