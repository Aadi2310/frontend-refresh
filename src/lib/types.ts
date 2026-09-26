export type Role = "SCHOOL" | "NGO" | "ADMIN" | "FIELD_COORDINATOR";
export const ROLES: Role[] = ["SCHOOL", "NGO", "ADMIN", "FIELD_COORDINATOR"];
export const ROLE_LABEL: Record<Role, string> = {
  SCHOOL: "School",
  NGO: "NGO",
  ADMIN: "Administrator",
  FIELD_COORDINATOR: "Field Coordinator",
};

export type AssessmentStatus = "DRAFT" | "SUBMITTED" | "VERIFIED" | "REJECTED";
export type RequirementStatus =
  | "OPEN" | "UNDER_REVIEW" | "ACCEPTED" | "IN_PROGRESS" | "PARTIALLY_COMPLETED"
  | "COMPLETED" | "NOT_FEASIBLE" | "DISPUTED" | "CLOSED";
export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface School {
  id: string; name: string; udise: string; district: string; block: string;
  students: number; teachers: number; verified: boolean; coordinatorId: string;
  lastAssessment: string; gapScore: number;
}
export interface Assessment {
  id: string; schoolId: string; schoolName: string; status: AssessmentStatus;
  submittedOn: string; items: number; gaps: number; assessor: string;
}
export interface PriorityBreakdown {
  severity: number; importance: number; studentsAffected: number;
  alternativeAvailability: number; condition: number;
}
export interface Requirement {
  id: string; schoolId: string; schoolName: string; district: string;
  resource: string; category: string; quantity: number; priority: Priority;
  score: number; breakdown: PriorityBreakdown; status: RequirementStatus;
  ngo?: string; createdOn: string; updatedOn: string;
}
export interface Activity { id: string; at: string; actor: string; text: string; kind: "info" | "success" | "warning" | "error"; }
export interface User { id: string; name: string; email: string; role: Role; org: string; active: boolean; lastLogin: string; }
