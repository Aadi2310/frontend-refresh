import type { PriorityBreakdown as B } from "@/lib/types";
import { Progress } from "./ui";

const LABELS: [keyof B, string][] = [
  ["severity", "Severity"], ["importance", "Importance"], ["studentsAffected", "Students affected"],
  ["alternativeAvailability", "Alternative availability"], ["condition", "Condition"],
];
export function PriorityBreakdown({ b }: { b: B }) {
  return (
    <dl className="space-y-2">
      {LABELS.map(([k, l]) => (
        <div key={k} className="grid grid-cols-[140px_1fr_28px] items-center gap-2 text-xs">
          <dt className="text-muted-foreground">{l}</dt>
          <dd><Progress value={b[k]} tone="secondary" /></dd>
          <dd className="text-right font-semibold tabular-nums">{b[k]}</dd>
        </div>
      ))}
    </dl>
  );
}
