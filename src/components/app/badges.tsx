import { AlertOctagon, ArrowDown, ArrowUp, Minus, Circle, CheckCircle2, Clock, XCircle, FileEdit, Send, Eye, Handshake, Loader, PieChart, Ban, AlertTriangle, Lock } from "lucide-react";
import type { AssessmentStatus, Priority, RequirementStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const tone = {
  critical: "bg-critical-soft text-critical border-critical/25",
  high: "bg-high-soft text-high border-high/30",
  medium: "bg-medium-soft text-medium border-medium/25",
  low: "bg-low-soft text-low border-low/25",
  neutral: "bg-neutral-soft text-muted-foreground border-border",
  teal: "bg-accent text-secondary border-secondary/25",
};
type Tone = keyof typeof tone;

function Pill({ t, icon: Icon, children }: { t: Tone; icon: typeof Circle; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", tone[t])}>
      <Icon className="h-3 w-3" aria-hidden />
      {children}
    </span>
  );
}

const P: Record<Priority, [Tone, typeof Circle]> = {
  CRITICAL: ["critical", AlertOctagon], HIGH: ["high", ArrowUp], MEDIUM: ["medium", Minus], LOW: ["low", ArrowDown],
};
export const PriorityBadge = ({ p }: { p: Priority }) => <Pill t={P[p][0]} icon={P[p][1]}>{p}</Pill>;

const A: Record<AssessmentStatus, [Tone, typeof Circle]> = {
  DRAFT: ["neutral", FileEdit], SUBMITTED: ["medium", Send], VERIFIED: ["low", CheckCircle2], REJECTED: ["critical", XCircle],
};
export const AssessmentBadge = ({ s }: { s: AssessmentStatus }) => <Pill t={A[s][0]} icon={A[s][1]}>{s}</Pill>;

const R: Record<RequirementStatus, [Tone, typeof Circle]> = {
  OPEN: ["medium", Circle], UNDER_REVIEW: ["neutral", Eye], ACCEPTED: ["teal", Handshake], IN_PROGRESS: ["high", Loader],
  PARTIALLY_COMPLETED: ["high", PieChart], COMPLETED: ["low", CheckCircle2], NOT_FEASIBLE: ["neutral", Ban],
  DISPUTED: ["critical", AlertTriangle], CLOSED: ["neutral", Lock],
};
export const RequirementBadge = ({ s }: { s: RequirementStatus }) => <Pill t={R[s][0]} icon={R[s][1]}>{s.replace(/_/g, " ")}</Pill>;

export const VerifiedBadge = ({ v }: { v: boolean }) =>
  v ? <Pill t="low" icon={CheckCircle2}>Verified</Pill> : <Pill t="high" icon={Clock}>Pending</Pill>;
