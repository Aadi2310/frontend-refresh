import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FlaskConical, ShieldCheck } from "lucide-react";
import { useRole } from "@/lib/role";
import { ROLES, ROLE_LABEL, type Role } from "@/lib/types";
import { API_MODE } from "@/lib/api";
import { Btn } from "@/components/app/Button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Sign in — Science Resource Gap System" },
    { name: "description", content: "Secure sign-in for schools, NGOs, field coordinators and administrators." },
    { property: "og:title", content: "Sign in — Science Resource Gap System" },
    { property: "og:description", content: "Secure sign-in for schools, NGOs, field coordinators and administrators." },
  ] }),
  component: SignIn,
});

function SignIn() {
  const { setRole } = useRole();
  const nav = useNavigate();
  const [role, setR] = useState<Role>("ADMIN");
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_480px]">
      <div className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground"><FlaskConical className="h-5 w-5" /></div>
          <div><p className="font-semibold text-sidebar-primary">SRGS</p><p className="text-[11px] uppercase tracking-wider">Science Resource Gap System</p></div>
        </div>
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-sidebar-primary">Evidence-based allocation of science resources to schools.</h1>
          <p className="mt-3 text-sm">Schools report verified laboratory gaps. Field coordinators validate. NGOs act on prioritised requirements. Administrators oversee the pipeline.</p>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-sidebar-border pt-6 text-sm">
            <div><dt className="text-xs">Roles</dt><dd className="text-lg font-semibold text-sidebar-primary">4</dd></div>
            <div><dt className="text-xs">Assessment stages</dt><dd className="text-lg font-semibold text-sidebar-primary">4</dd></div>
            <div><dt className="text-xs">Priority factors</dt><dd className="text-lg font-semibold text-sidebar-primary">5</dd></div>
          </dl>
        </div>
        <p className="flex items-center gap-1.5 text-xs"><ShieldCheck className="h-3.5 w-3.5" />Authorised use only. Activity is logged.</p>
      </div>
      <div className="flex items-center justify-center bg-background p-6">
        <form className="w-full max-w-sm space-y-4 rounded-md border border-border bg-card p-6" onSubmit={(e) => { e.preventDefault(); setRole(role); nav({ to: "/dashboard" }); }}>
          <div><h2 className="text-lg font-semibold">Sign in</h2><p className="text-sm text-muted-foreground">Use your official account credentials.</p></div>
          <label className="block text-sm font-medium">Email <span className="text-critical">*</span>
            <input required type="email" defaultValue="admin@srgs.gov.in" className="mt-1 h-9 w-full rounded border border-input bg-background px-2.5 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          <label className="block text-sm font-medium">Password <span className="text-critical">*</span>
            <input required type="password" defaultValue="demo1234" className="mt-1 h-9 w-full rounded border border-input bg-background px-2.5 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          {API_MODE === "mock" && (
            <fieldset className="rounded border border-dashed border-secondary/50 bg-accent/60 p-3">
              <legend className="px-1 text-xs font-semibold text-secondary">Demo mode — choose role</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {ROLES.map((r) => (
                  <label key={r} className="flex cursor-pointer items-center gap-1.5 text-xs">
                    <input type="radio" name="role" checked={role === r} onChange={() => setR(r)} className="accent-[var(--primary)]" />{ROLE_LABEL[r]}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <Btn type="submit" className="h-9 w-full justify-center">Sign in</Btn>
        </form>
      </div>
    </div>
  );
}
