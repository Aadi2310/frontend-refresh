import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { EmptyState } from "./ui";
import { cn } from "@/lib/utils";

export interface Column<T> { key: string; header: string; cell: (row: T) => ReactNode; sort?: (row: T) => string | number; className?: string; }

export function DataTable<T>({ rows, columns, searchText, filters, pageSize = 8, onRowClick, toolbar }: {
  rows: T[]; columns: Column<T>[]; searchText?: (row: T) => string;
  filters?: { label: string; options: string[]; value: (row: T) => string }[];
  pageSize?: number; onRowClick?: (row: T) => void; toolbar?: ReactNode;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [fv, setFv] = useState<Record<number, string>>({});
  const [page, setPage] = useState(0);

  const data = useMemo(() => {
    let d = rows.filter((r) => (!q || !searchText || searchText(r).toLowerCase().includes(q.toLowerCase())) &&
      (filters ?? []).every((f, i) => !fv[i] || f.value(r) === fv[i]));
    const col = sort && columns.find((c) => c.key === sort.key);
    if (col?.sort) d = [...d].sort((a, b) => (col.sort!(a) > col.sort!(b) ? 1 : -1) * sort!.dir);
    return d;
  }, [rows, q, fv, sort, columns, filters, searchText]);
  const pages = Math.max(1, Math.ceil(data.length / pageSize));
  const view = data.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="rounded-md border border-border bg-card">
      {(searchText || filters || toolbar) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          {searchText && (
            <label className="relative">
              <span className="sr-only">Search</span>
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search…" className="h-8 w-56 rounded border border-input bg-background pl-7 pr-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
          )}
          {filters?.map((f, i) => (
            <select key={f.label} aria-label={f.label} value={fv[i] ?? ""} onChange={(e) => { setFv({ ...fv, [i]: e.target.value }); setPage(0); }} className="h-8 rounded border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">All {f.label.toLowerCase()}</option>
              {f.options.map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
            </select>
          ))}
          <div className="ml-auto flex gap-2">{toolbar}</div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", c.className)}>
                  {c.sort ? (
                    <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSort({ key: c.key, dir: sort?.key === c.key ? (-sort.dir as 1 | -1) : 1 })}>
                      {c.header}<ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={i} onClick={onRowClick ? () => onRowClick(r) : undefined} className={cn("border-b border-border/70 last:border-0 hover:bg-accent/50", onRowClick && "cursor-pointer")}>
                {columns.map((c) => <td key={c.key} className={cn("px-3 py-2 align-middle", c.className)}>{c.cell(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {view.length === 0 && <EmptyState title="No records found" text="Adjust search or filters." />}
      </div>
      <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <span>{data.length} record{data.length === 1 ? "" : "s"}</span>
        <div className="flex items-center gap-1">
          <button aria-label="Previous page" disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded p-1 hover:bg-accent disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <span>Page {page + 1} of {pages}</span>
          <button aria-label="Next page" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="rounded p-1 hover:bg-accent disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
