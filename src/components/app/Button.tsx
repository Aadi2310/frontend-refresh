import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Btn({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "border border-input bg-card text-foreground hover:bg-accent",
    ghost: "text-primary hover:bg-accent",
  }[variant];
  return <button {...p} className={cn("inline-flex h-8 items-center gap-1.5 rounded px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-50", v, className)} />;
}
