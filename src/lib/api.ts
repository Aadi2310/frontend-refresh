// API layer. In "live" mode it calls your existing backend (VITE_API_BASE_URL);
// in "mock" mode it returns centralised demo data. Swap endpoint paths to match your backend.
import * as mock from "./mock-data";
import type { Assessment, Requirement, School, User, Activity } from "./types";

export const API_MODE: "mock" | "live" = import.meta.env.VITE_API_MODE === "live" ? "live" : "mock";
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

async function get<T>(path: string, fallback: T): Promise<T> {
  if (API_MODE === "mock") return structuredClone(fallback);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${BASE}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export const api = {
  schools: () => get<School[]>("/schools", mock.schools),
  assessments: () => get<Assessment[]>("/assessments", mock.assessments),
  requirements: () => get<Requirement[]>("/requirements", mock.requirements),
  activity: () => get<Activity[]>("/activity", mock.activity),
  users: () => get<User[]>("/users", mock.users),
};
