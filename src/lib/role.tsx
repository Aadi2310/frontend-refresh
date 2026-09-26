import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role } from "./types";
import { ROLES } from "./types";

// Demo-mode role selection only. The backend remains the authority for permissions.
const Ctx = createContext<{ role: Role; setRole: (r: Role) => void }>({ role: "ADMIN", setRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("ADMIN");
  useEffect(() => {
    const r = localStorage.getItem("srgs.role") as Role | null;
    if (r && ROLES.includes(r)) setRoleState(r);
  }, []);
  const setRole = (r: Role) => { localStorage.setItem("srgs.role", r); setRoleState(r); };
  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>;
}
export const useRole = () => useContext(Ctx);
