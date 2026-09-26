import type { Column } from "./DataTable";
import type { Assessment, Requirement, School } from "@/lib/types";
import { AssessmentBadge, PriorityBadge, RequirementBadge, VerifiedBadge } from "./badges";
import { Progress } from "./ui";

export const reqColumns: Column<Requirement>[] = [
  { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span>, sort: (r) => r.id },
  { key: "res", header: "Resource", cell: (r) => <div><p className="font-medium">{r.resource}</p><p className="text-xs text-muted-foreground">{r.category} · Qty {r.quantity}</p></div>, sort: (r) => r.resource },
  { key: "school", header: "School", cell: (r) => <div><p>{r.schoolName}</p><p className="text-xs text-muted-foreground">{r.district}</p></div>, sort: (r) => r.schoolName },
  { key: "prio", header: "Priority", cell: (r) => <PriorityBadge p={r.priority} />, sort: (r) => r.score },
  { key: "score", header: "Score", cell: (r) => <div className="flex w-24 items-center gap-2"><span className="w-6 text-xs font-semibold tabular-nums">{r.score}</span><Progress value={r.score} tone={r.score >= 85 ? "critical" : r.score >= 70 ? "high" : "primary"} /></div>, sort: (r) => r.score },
  { key: "status", header: "Status", cell: (r) => <RequirementBadge s={r.status} />, sort: (r) => r.status },
  { key: "upd", header: "Updated", cell: (r) => <span className="text-xs text-muted-foreground">{r.updatedOn}</span>, sort: (r) => r.updatedOn },
];

export const asmColumns: Column<Assessment>[] = [
  { key: "id", header: "ID", cell: (a) => <span className="font-mono text-xs text-muted-foreground">{a.id}</span>, sort: (a) => a.id },
  { key: "school", header: "School", cell: (a) => <span className="font-medium">{a.schoolName}</span>, sort: (a) => a.schoolName },
  { key: "assessor", header: "Assessor", cell: (a) => a.assessor },
  { key: "items", header: "Items", cell: (a) => <span className="tabular-nums">{a.items}</span>, sort: (a) => a.items },
  { key: "gaps", header: "Gaps", cell: (a) => <span className="tabular-nums">{a.gaps}</span>, sort: (a) => a.gaps },
  { key: "sub", header: "Submitted", cell: (a) => <span className="text-xs text-muted-foreground">{a.submittedOn}</span>, sort: (a) => a.submittedOn },
  { key: "status", header: "Status", cell: (a) => <AssessmentBadge s={a.status} />, sort: (a) => a.status },
];

export const schoolColumns: Column<School>[] = [
  { key: "name", header: "School", cell: (s) => <div><p className="font-medium">{s.name}</p><p className="font-mono text-xs text-muted-foreground">UDISE {s.udise}</p></div>, sort: (s) => s.name },
  { key: "dist", header: "District / Block", cell: (s) => <div><p>{s.district}</p><p className="text-xs text-muted-foreground">{s.block}</p></div>, sort: (s) => s.district },
  { key: "stu", header: "Students", cell: (s) => <span className="tabular-nums">{s.students}</span>, sort: (s) => s.students },
  { key: "gap", header: "Gap score", cell: (s) => <div className="flex w-28 items-center gap-2"><span className="w-6 text-xs font-semibold tabular-nums">{s.gapScore}</span><Progress value={s.gapScore} tone={s.gapScore >= 75 ? "critical" : s.gapScore >= 55 ? "high" : "low"} /></div>, sort: (s) => s.gapScore },
  { key: "last", header: "Last assessment", cell: (s) => <span className="text-xs text-muted-foreground">{s.lastAssessment}</span>, sort: (s) => s.lastAssessment },
  { key: "ver", header: "Verification", cell: (s) => <VerifiedBadge v={s.verified} /> },
];
