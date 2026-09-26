import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { Requirement } from "@/lib/types";
import { useRole } from "@/lib/role";
import { PriorityBadge, RequirementBadge } from "./badges";
import { PriorityBreakdown } from "./PriorityBreakdown";
import { Btn } from "./Button";
import { toast } from "sonner";

export function RequirementDrawer({ req, onClose }: { req: Requirement | null; onClose: () => void }) {
  const { role } = useRole();
  return (
    <Sheet open={!!req} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {req && (
          <>
            <SheetHeader>
              <p className="font-mono text-xs text-muted-foreground">{req.id}</p>
              <SheetTitle>{req.resource}</SheetTitle>
              <SheetDescription>{req.schoolName} · {req.district}</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 px-4 pb-6">
              <div className="flex gap-2"><PriorityBadge p={req.priority} /><RequirementBadge s={req.status} /></div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-xs text-muted-foreground">Category</dt><dd>{req.category}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Quantity</dt><dd>{req.quantity}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Created</dt><dd>{req.createdOn}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Assigned NGO</dt><dd>{req.ngo ?? "—"}</dd></div>
              </dl>
              <div className="rounded-md border border-border p-3">
                <div className="mb-3 flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold">Priority score breakdown</h3>
                  <span className="text-lg font-semibold tabular-nums">{req.score}<span className="text-xs text-muted-foreground">/100</span></span>
                </div>
                <PriorityBreakdown b={req.breakdown} />
              </div>
              {role === "NGO" && req.status === "OPEN" && (
                <Btn className="w-full justify-center" onClick={() => { toast.success(`Acceptance request sent for ${req.id}`); onClose(); }}>Accept requirement</Btn>
              )}
              {role === "NGO" && ["ACCEPTED", "IN_PROGRESS", "PARTIALLY_COMPLETED"].includes(req.status) && (
                <Btn variant="secondary" className="w-full justify-center" onClick={() => toast.info("Intervention status update submitted")}>Update intervention status</Btn>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
