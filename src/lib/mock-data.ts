// Centralised demo data. Used only when API mode is "mock". Never used for authorization.
import type { Activity, Assessment, Requirement, School, User, Priority, RequirementStatus } from "./types";

export const schools: School[] = [
  { id: "SCH-101", name: "Govt. High School, Wardha", udise: "27100304501", district: "Wardha", block: "Arvi", students: 642, teachers: 22, verified: true, coordinatorId: "U-4", lastAssessment: "2026-09-14", gapScore: 71 },
  { id: "SCH-102", name: "ZP Secondary School, Hinganghat", udise: "27100502211", district: "Wardha", block: "Hinganghat", students: 418, teachers: 14, verified: true, coordinatorId: "U-4", lastAssessment: "2026-09-02", gapScore: 58 },
  { id: "SCH-103", name: "Municipal School No. 7, Nagpur", udise: "27090100712", district: "Nagpur", block: "Nagpur Urban", students: 905, teachers: 31, verified: true, coordinatorId: "U-5", lastAssessment: "2026-08-28", gapScore: 44 },
  { id: "SCH-104", name: "Ashram Shala, Gadchiroli", udise: "27150900134", district: "Gadchiroli", block: "Aheri", students: 276, teachers: 9, verified: false, coordinatorId: "U-4", lastAssessment: "2026-09-19", gapScore: 86 },
  { id: "SCH-105", name: "Govt. Girls High School, Chandrapur", udise: "27130200458", district: "Chandrapur", block: "Ballarpur", students: 531, teachers: 18, verified: true, coordinatorId: "U-5", lastAssessment: "2026-07-30", gapScore: 39 },
  { id: "SCH-106", name: "ZP School, Yavatmal", udise: "27120700321", district: "Yavatmal", block: "Pusad", students: 367, teachers: 12, verified: false, coordinatorId: "U-4", lastAssessment: "2026-09-21", gapScore: 77 },
];

export const assessments: Assessment[] = [
  { id: "ASM-2041", schoolId: "SCH-101", schoolName: schools[0].name, status: "VERIFIED", submittedOn: "2026-09-14", items: 48, gaps: 11, assessor: "R. Deshmukh" },
  { id: "ASM-2042", schoolId: "SCH-104", schoolName: schools[3].name, status: "SUBMITTED", submittedOn: "2026-09-19", items: 48, gaps: 19, assessor: "S. Madavi" },
  { id: "ASM-2043", schoolId: "SCH-106", schoolName: schools[5].name, status: "SUBMITTED", submittedOn: "2026-09-21", items: 48, gaps: 15, assessor: "P. Rathod" },
  { id: "ASM-2044", schoolId: "SCH-102", schoolName: schools[1].name, status: "VERIFIED", submittedOn: "2026-09-02", items: 48, gaps: 8, assessor: "A. Kale" },
  { id: "ASM-2045", schoolId: "SCH-103", schoolName: schools[2].name, status: "REJECTED", submittedOn: "2026-08-28", items: 42, gaps: 6, assessor: "M. Shaikh" },
  { id: "ASM-2046", schoolId: "SCH-101", schoolName: schools[0].name, status: "DRAFT", submittedOn: "—", items: 20, gaps: 3, assessor: "R. Deshmukh" },
  { id: "ASM-2047", schoolId: "SCH-105", schoolName: schools[4].name, status: "VERIFIED", submittedOn: "2026-07-30", items: 48, gaps: 5, assessor: "K. Patil" },
];

function req(id: string, s: School, resource: string, category: string, quantity: number, priority: Priority, score: number, status: RequirementStatus, b: [number, number, number, number, number], ngo?: string): Requirement {
  return { id, schoolId: s.id, schoolName: s.name, district: s.district, resource, category, quantity, priority, score, status, ngo, createdOn: "2026-09-10", updatedOn: "2026-09-24",
    breakdown: { severity: b[0], importance: b[1], studentsAffected: b[2], alternativeAvailability: b[3], condition: b[4] } };
}

export const requirements: Requirement[] = [
  req("REQ-3301", schools[3], "Compound microscopes", "Biology Lab", 10, "CRITICAL", 92, "OPEN", [95, 90, 88, 96, 90]),
  req("REQ-3302", schools[3], "Physics lab bench set", "Physics Lab", 4, "CRITICAL", 89, "UNDER_REVIEW", [90, 92, 85, 88, 90]),
  req("REQ-3303", schools[0], "Chemistry reagent kit", "Chemistry Lab", 6, "HIGH", 78, "ACCEPTED", [80, 82, 74, 70, 84], "Vigyan Ashram Trust"),
  req("REQ-3304", schools[5], "Fire extinguishers (CO₂)", "Safety", 3, "CRITICAL", 87, "OPEN", [96, 88, 80, 90, 81]),
  req("REQ-3305", schools[1], "Digital weighing balance", "Physics Lab", 2, "MEDIUM", 61, "IN_PROGRESS", [60, 65, 58, 55, 67], "Pratham Science Fund"),
  req("REQ-3306", schools[0], "Human anatomy models", "Biology Lab", 3, "HIGH", 74, "PARTIALLY_COMPLETED", [72, 78, 76, 66, 78], "Vigyan Ashram Trust"),
  req("REQ-3307", schools[2], "Projector for science room", "ICT", 1, "LOW", 38, "COMPLETED", [35, 40, 42, 30, 43], "Pratham Science Fund"),
  req("REQ-3308", schools[4], "Glassware replacement set", "Chemistry Lab", 1, "MEDIUM", 55, "OPEN", [58, 60, 50, 48, 59]),
  req("REQ-3309", schools[5], "Electricity circuit kits", "Physics Lab", 12, "HIGH", 76, "OPEN", [74, 80, 72, 78, 76]),
  req("REQ-3310", schools[2], "Fume hood repair", "Safety", 1, "HIGH", 70, "DISPUTED", [78, 70, 60, 72, 70]),
  req("REQ-3311", schools[1], "Periodic table charts", "Teaching Aids", 5, "LOW", 29, "NOT_FEASIBLE", [25, 30, 32, 20, 38]),
  req("REQ-3312", schools[4], "Lab safety goggles", "Safety", 40, "MEDIUM", 58, "CLOSED", [62, 55, 60, 50, 63], "Pratham Science Fund"),
];

export const activity: Activity[] = [
  { id: "A1", at: "2026-09-26 09:40", actor: "S. Madavi", text: "Submitted assessment ASM-2042 for Ashram Shala, Gadchiroli", kind: "info" },
  { id: "A2", at: "2026-09-25 17:12", actor: "Vigyan Ashram Trust", text: "Accepted requirement REQ-3303 (Chemistry reagent kit)", kind: "success" },
  { id: "A3", at: "2026-09-25 11:05", actor: "System", text: "REQ-3304 flagged CRITICAL — safety equipment missing", kind: "error" },
  { id: "A4", at: "2026-09-24 15:30", actor: "Admin", text: "Rejected assessment ASM-2045 — incomplete inventory section", kind: "warning" },
  { id: "A5", at: "2026-09-24 10:18", actor: "Pratham Science Fund", text: "Updated REQ-3305 to IN_PROGRESS", kind: "info" },
  { id: "A6", at: "2026-09-23 14:02", actor: "Admin", text: "Verified school SCH-102, Hinganghat", kind: "success" },
];

export const users: User[] = [
  { id: "U-1", name: "Meera Joshi", email: "admin@srgs.gov.in", role: "ADMIN", org: "State Education Dept.", active: true, lastLogin: "2026-09-26" },
  { id: "U-2", name: "Principal R. Deshmukh", email: "ghs.wardha@srgs.gov.in", role: "SCHOOL", org: schools[0].name, active: true, lastLogin: "2026-09-25" },
  { id: "U-3", name: "Anil Kulkarni", email: "anil@vigyanashram.org", role: "NGO", org: "Vigyan Ashram Trust", active: true, lastLogin: "2026-09-25" },
  { id: "U-4", name: "Sunita Madavi", email: "s.madavi@srgs.gov.in", role: "FIELD_COORDINATOR", org: "Vidarbha Region", active: true, lastLogin: "2026-09-26" },
  { id: "U-5", name: "Karan Patil", email: "k.patil@srgs.gov.in", role: "FIELD_COORDINATOR", org: "Vidarbha Region", active: false, lastLogin: "2026-08-11" },
  { id: "U-6", name: "Farah Shaikh", email: "farah@prathamsf.org", role: "NGO", org: "Pratham Science Fund", active: true, lastLogin: "2026-09-22" },
];

// Demo identity per role (display only)
export const demoIdentity = {
  SCHOOL: { name: "R. Deshmukh", org: schools[0].name, schoolId: "SCH-101" },
  NGO: { name: "Anil Kulkarni", org: "Vigyan Ashram Trust" },
  ADMIN: { name: "Meera Joshi", org: "State Education Dept." },
  FIELD_COORDINATOR: { name: "Sunita Madavi", org: "Vidarbha Region", userId: "U-4" },
} as const;
