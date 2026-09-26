import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app/AppShell";
import { AlertBox, Kpi, PageHeader, Panel, Progress, Timeline, LoadingState } from "@/components/app/ui";
import { AssessmentBadge, PriorityBadge, RequirementBadge, VerifiedBadge } from "@/components/app/badges";
import { PriorityBreakdown } from "@/components/app/PriorityBreakdown";
import { RequirementDrawer } from "@/components/app/RequirementDrawer";
import { Btn } from "@/components/app/Button";
import { useActivity, useAssessments, useRequirements, useSchools, useScope } from "@/lib/queries";
import type { Requirement, RequirementStatus } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — SRGS" },
    { name: "description", content: "Role-specific overview of schools, assessments and resource requirements." },
    { property: "og:title", content: "Dashboard — SRGS" },
    { property: "og:description", content: "Role-specific overview of schools, assessments and resource requirements." },
  ] }),
  component: Dashboard,
});

const OPENISH: RequirementStatus[] = ["OPEN", "UNDER_REVIEW", "ACCEPTED", "IN_PROGRESS", "PARTIALLY_COMPLETED", "DISPUTED"];

function Dashboard() {
  const { role } = useScope();
  return (
    <AppShell crumb="Dashboard">
      {role === "SCHOOL" && <SchoolDash />}
      {role === "NGO" && <NgoDash />}
      {role === "ADMIN" && <AdminDash />}
      {role === "FIELD_COORDINATOR" && <FcDash />}
    </AppShell>
  );
}

function useData() {
  const s = useSchools(), a = useAssessments(), r = useRequirements(), act = useActivity();
  const scope = useScope();
  if (!s.data || !a.data || !r.data || !act.data) return null;
  const ids = scope.schoolIds(s.data);
  return {
    schools: s.data.filter((x) => ids.includes(x.id)),
    assessments: a.data.filter((x) => ids.includes(x.schoolId)),
    requirements: r.data.filter((x) => ids.includes(x.schoolId)),
    allRequirements: r.data,
    activity: act.data,
  };
}

function ReqList({ rows, onOpen }: { rows: Requirement[]; onOpen: (r: Requirement) => void }) {
  return (
    <ul className="divide-y divide-border">
      {rows.map((r) => (
        <li key={r.id}>
          <button onClick={() => onOpen(r)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/50 focus-visible:bg-accent focus-visible:outline-none">
            <span className="w-8 text-sm font-semibold tabular-nums">{r.score}</span>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{r.resource}</p><p className="truncate text-xs text-muted-foreground">{r.schoolName}</p></div>
            <PriorityBadge p={r.priority} /><span className="hidden sm:inline"><RequirementBadge s={r.status} /></span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- SCHOOL ---------------- */
function SchoolDash() {
  const d = useData(); const [sel, setSel] = useState<Requirement | null>(null);
  if (!d) return <LoadingState />;
  const school = d.schools[0]; const latest = d.assessments.find((a) => a.status !== "DRAFT");
  const draft = d.assessments.find((a) => a.status === "DRAFT");
  const open = d.requirements.filter((r) => OPENISH.includes(r.status));
  const byCat = Object.entries(d.requirements.reduce<Record<string, number>>((m, r) => ((m[r.category] = (m[r.category] ?? 0) + 1), m), {}));
  return (
    <>
      <PageHeader title={school.name} description={`UDISE ${school.udise} · ${school.district}, ${school.block}`}
        actions={<><Link to="/my-school"><Btn variant="outline">Manage my school</Btn></Link><Link to="/assessments"><Btn>Create assessment</Btn></Link></>} />
      {draft && <div className="mb-4"><AlertBox kind="warning" title={`Assessment ${draft.id} is still in draft`}>{draft.items} of 48 items completed. Submit it for verification to update your gap analysis.</AlertBox></div>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Latest assessment" value={latest ? <AssessmentBadge s={latest.status} /> : "—"} sub={latest ? `${latest.id} · ${latest.submittedOn}` : undefined} />
        <Kpi label="Gap score" value={school.gapScore} sub="Higher means larger gap" accent="high" />
        <Kpi label="Open requirements" value={open.length} sub={`${d.requirements.length} total raised`} accent="secondary" />
        <Kpi label="Students served" value={school.students} sub={`${school.teachers} teachers`} accent="low" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Requirements" className="xl:col-span-2" bodyClass="p-0" action={<Link to="/requirements" className="text-xs font-medium text-primary hover:underline">View all</Link>}>
          <ReqList rows={d.requirements} onOpen={setSel} />
        </Panel>
        <Panel title="Resource gap summary">
          <ul className="space-y-3">
            {byCat.map(([c, n]) => (
              <li key={c}><div className="mb-1 flex justify-between text-xs"><span>{c}</span><span className="font-semibold">{n} gap{n > 1 ? "s" : ""}</span></div><Progress value={n * 34} tone="secondary" /></li>
            ))}
          </ul>
          <Link to="/gap-analysis" className="mt-4 inline-block text-xs font-medium text-primary hover:underline">Open gap analysis →</Link>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Recent activity"><Timeline items={d.activity.slice(0, 4)} /></Panel>
        <Panel title="Quick actions">
          <div className="grid grid-cols-2 gap-2">
            {[["/assessments", "Create assessment"], ["/requirements", "View requirements"], ["/gap-analysis", "View gap analysis"], ["/reports", "View reports"]].map(([to, l]) => (
              <Link key={to} to={to} className="rounded border border-border px-3 py-3 text-sm font-medium hover:border-primary/40 hover:bg-accent">{l}</Link>
            ))}
          </div>
        </Panel>
      </div>
      <RequirementDrawer req={sel} onClose={() => setSel(null)} />
    </>
  );
}

/* ---------------- NGO ---------------- */
function NgoDash() {
  const d = useData(); const [sel, setSel] = useState<Requirement | null>(null);
  if (!d) return <LoadingState />;
  const r = d.allRequirements; const mine = r.filter((x) => x.ngo === "Vigyan Ashram Trust");
  const openR = r.filter((x) => x.status === "OPEN").sort((a, b) => b.score - a.score);
  const top = openR[0];
  return (
    <>
      <PageHeader title="Requirements to act on" description="Verified requirements ranked by priority score. Accept those your organisation can fulfil." actions={<Link to="/priority"><Btn>Priority requirements</Btn></Link>} />
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Open" value={openR.length} />
        <Kpi label="Critical" value={r.filter((x) => x.priority === "CRITICAL" && OPENISH.includes(x.status)).length} accent="critical" />
        <Kpi label="High priority" value={r.filter((x) => x.priority === "HIGH" && OPENISH.includes(x.status)).length} accent="high" />
        <Kpi label="Accepted" value={mine.filter((x) => x.status === "ACCEPTED").length} accent="secondary" />
        <Kpi label="In progress" value={mine.filter((x) => ["IN_PROGRESS", "PARTIALLY_COMPLETED"].includes(x.status)).length} accent="high" />
        <Kpi label="Completed" value={r.filter((x) => x.status === "COMPLETED" && x.ngo).length} accent="low" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Prioritised open requirements" className="xl:col-span-2" bodyClass="p-0"><ReqList rows={openR} onOpen={setSel} /></Panel>
        {top && (
          <Panel title="Why this is ranked first">
            <p className="text-sm font-medium">{top.resource}</p>
            <p className="mb-3 text-xs text-muted-foreground">{top.schoolName}</p>
            <div className="mb-3 flex items-center gap-2"><PriorityBadge p={top.priority} /><span className="text-sm font-semibold">Score {top.score}/100</span></div>
            <PriorityBreakdown b={top.breakdown} />
            <Btn className="mt-4 w-full justify-center" onClick={() => setSel(top)}>View requirement</Btn>
          </Panel>
        )}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Our interventions" bodyClass="p-0"><ReqList rows={mine} onOpen={setSel} /></Panel>
        <Panel title="Recent intervention activity"><Timeline items={d.activity.filter((a) => a.kind !== "warning").slice(0, 4)} /></Panel>
      </div>
      <RequirementDrawer req={sel} onClose={() => setSel(null)} />
    </>
  );
}

/* ---------------- ADMIN ---------------- */
function AdminDash() {
  const d = useData();
  if (!d) return <LoadingState />;
  const statusData = (["OPEN", "UNDER_REVIEW", "ACCEPTED", "IN_PROGRESS", "PARTIALLY_COMPLETED", "COMPLETED", "DISPUTED", "NOT_FEASIBLE", "CLOSED"] as RequirementStatus[])
    .map((s) => ({ s: s.replace(/_/g, " "), n: d.requirements.filter((r) => r.status === s).length }));
  const pipe = (["DRAFT", "SUBMITTED", "VERIFIED", "REJECTED"] as const).map((s) => ({ s, n: d.assessments.filter((a) => a.status === s).length }));
  const prio = (["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((p) => ({ p, n: d.requirements.filter((r) => r.priority === p && OPENISH.includes(r.status)).length }));
  const prioColor = ["var(--critical)", "var(--high)", "var(--medium)", "var(--low)"];
  const done = d.requirements.filter((r) => r.status === "COMPLETED" || r.status === "CLOSED").length;
  const withNgo = d.requirements.filter((r) => r.ngo).length;
  return (
    <>
      <PageHeader title="System overview" description="State-wide status of schools, assessments, requirements and interventions." actions={<><Link to="/reports"><Btn variant="outline">Reports</Btn></Link><Link to="/assessments"><Btn>Review submissions</Btn></Link></>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Total schools" value={d.schools.length} sub={`${d.schools.filter((s) => s.verified).length} verified`} />
        <Kpi label="Awaiting verification" value={pipe[1].n} sub="Submitted assessments" accent="high" />
        <Kpi label="Open requirements" value={d.requirements.filter((r) => OPENISH.includes(r.status)).length} accent="secondary" />
        <Kpi label="Critical / high gaps" value={prio[0].n + prio[1].n} sub={`${prio[0].n} critical`} accent="critical" />
        <Kpi label="Intervention completion" value={`${Math.round((done / Math.max(1, withNgo)) * 100)}%`} sub={`${done} of ${withNgo} with NGO`} accent="low" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Requirement status distribution" className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer><BarChart data={statusData} margin={{ left: -20 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="s" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid var(--border)" }} />
              <Bar dataKey="n" name="Requirements" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
            </BarChart></ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Open gaps by priority">
          <div className="h-40"><ResponsiveContainer><PieChart><Pie data={prio} dataKey="n" nameKey="p" innerRadius={42} outerRadius={64} paddingAngle={2}>{prio.map((_, i) => <Cell key={i} fill={prioColor[i]} />)}</Pie><Tooltip contentStyle={{ fontSize: 12 }} /></PieChart></ResponsiveContainer></div>
          <ul className="mt-2 space-y-1.5">{prio.map((x) => <li key={x.p} className="flex items-center justify-between text-xs"><PriorityBadge p={x.p} /><span className="font-semibold tabular-nums">{x.n}</span></li>)}</ul>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Assessment pipeline">
          <ol className="space-y-3">{pipe.map((p) => (
            <li key={p.s}><div className="mb-1 flex items-center justify-between"><AssessmentBadge s={p.s} /><span className="text-sm font-semibold tabular-nums">{p.n}</span></div><Progress value={(p.n / d.assessments.length) * 100} tone={p.s === "REJECTED" ? "critical" : p.s === "VERIFIED" ? "low" : "primary"} /></li>
          ))}</ol>
        </Panel>
        <Panel title="Administrative alerts">
          <div className="space-y-2">
            <AlertBox kind="error" title="2 critical safety gaps unassigned">REQ-3304 and REQ-3301 have no NGO after 14 days.</AlertBox>
            <AlertBox kind="warning" title="2 schools pending verification">SCH-104 and SCH-106 submitted profiles.</AlertBox>
            <AlertBox kind="info" title="1 disputed requirement">REQ-3310 requires review.</AlertBox>
          </div>
        </Panel>
        <Panel title="System activity"><Timeline items={d.activity.slice(0, 5)} /></Panel>
      </div>
    </>
  );
}

/* ---------------- FIELD COORDINATOR ---------------- */
function FcDash() {
  const d = useData(); const [sel, setSel] = useState<Requirement | null>(null);
  if (!d) return <LoadingState />;
  const pending = d.assessments.filter((a) => a.status === "SUBMITTED");
  const attention = [...d.schools].sort((a, b) => b.gapScore - a.gapScore);
  const reqs = d.requirements.filter((r) => OPENISH.includes(r.status)).sort((a, b) => b.score - a.score);
  return (
    <>
      <PageHeader title="My assigned schools" description="Schools, assessments and requirements assigned to you." actions={<Link to="/assessments"><Btn>Review assessments</Btn></Link>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Assigned schools" value={d.schools.length} sub={`${d.schools.filter((s) => !s.verified).length} pending verification`} />
        <Kpi label="Assessments to review" value={pending.length} accent="high" />
        <Kpi label="Assigned open gaps" value={reqs.length} accent="secondary" />
        <Kpi label="Critical in my schools" value={reqs.filter((r) => r.priority === "CRITICAL").length} accent="critical" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Schools needing attention" className="xl:col-span-2" bodyClass="p-0">
          <ul className="divide-y divide-border">{attention.map((s) => {
            const pa = pending.find((a) => a.schoolId === s.id);
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1"><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.block} · last visit {s.lastAssessment}</p></div>
                <div className="flex w-28 items-center gap-2"><span className="text-xs font-semibold tabular-nums">{s.gapScore}</span><Progress value={s.gapScore} tone={s.gapScore >= 75 ? "critical" : "high"} /></div>
                <VerifiedBadge v={s.verified} />
                {pa && <AssessmentBadge s={pa.status} />}
              </li>
            );
          })}</ul>
        </Panel>
        <Panel title="Assessment workload">
          <ul className="space-y-2">{pending.map((a) => (
            <li key={a.id} className="rounded border border-border p-2.5"><div className="flex justify-between"><span className="font-mono text-xs text-muted-foreground">{a.id}</span><AssessmentBadge s={a.status} /></div><p className="mt-1 text-sm font-medium">{a.schoolName}</p><p className="text-xs text-muted-foreground">{a.gaps} gaps reported · {a.submittedOn}</p></li>
          ))}</ul>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Assigned requirements" bodyClass="p-0"><ReqList rows={reqs} onOpen={setSel} /></Panel>
        <Panel title="Recent field activity"><Timeline items={d.activity.slice(0, 4)} /></Panel>
      </div>
      <RequirementDrawer req={sel} onClose={() => setSel(null)} />
    </>
  );
}
