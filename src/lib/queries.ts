import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import { useRole } from "./role";
import { demoIdentity } from "./mock-data";

export const useSchools = () => useQuery({ queryKey: ["schools"], queryFn: api.schools });
export const useAssessments = () => useQuery({ queryKey: ["assessments"], queryFn: api.assessments });
export const useRequirements = () => useQuery({ queryKey: ["requirements"], queryFn: api.requirements });
export const useActivity = () => useQuery({ queryKey: ["activity"], queryFn: api.activity });
export const useUsers = () => useQuery({ queryKey: ["users"], queryFn: api.users });

/** Demo-mode display scoping only. In live mode the backend returns already-authorized data. */
export function useScope() {
  const { role } = useRole();
  return {
    role,
    schoolIds: (all: { id: string; coordinatorId: string }[]) =>
      role === "SCHOOL" ? [demoIdentity.SCHOOL.schoolId]
      : role === "FIELD_COORDINATOR" ? all.filter((s) => s.coordinatorId === demoIdentity.FIELD_COORDINATOR.userId).map((s) => s.id)
      : all.map((s) => s.id),
  };
}
