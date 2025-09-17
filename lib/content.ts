// lib/content.ts
// Strongly-typed loaders for our JSON content.
// We coerce/validate "status" so it matches the union type.

import objectivesJson from "@/data/objectives.json";
import questionsJson from "@/data/questions.json";
import missionsJson from "@/data/missions.json";
import lessonsJson from "@/data/lessons.json";

// ---- Types (exported so components can import) ----
export type Status = "unseen" | "learning" | "mastered";

export interface Objective {
  id: string;
  domain: string;
  title: string;
  weight: number;
  status: Status;
  nextDue: string;
  mastery: number;
  misconception?: boolean;
}

export interface Question {
  id: string;
  objectiveId: string;
  domain: string;
  stem: string;
  options: string[];
  answerIndex: number;
  rationale: string;
  altExplanations?: {
    mode: "analogy" | "picture" | "steps" | "story" | "table" | "cli";
    text: string;
  }[];
  difficulty?: 1 | 2 | 3;
}

export interface Mission {
  id: string;
  title: string;
  type: "log-hunt" | "zone-builder";
  objectives: string[];
  lore: string;
  tasks: any;
  unlocks: string[];
  // NEW: optional so older JSON still type-checks
  targetDomain?: string;
}

export interface Lesson {
  id: string;
  domain: string;
  title: string;
  objectiveIds?: string[];
  body: string; // plain text with \n\n breaks
}

// ---- Coercion helpers ----
const STATUS_SET = new Set<Status>(["unseen", "learning", "mastered"]);

function coerceObjective(raw: any): Objective {
  const status: Status = STATUS_SET.has(String(raw.status).toLowerCase() as Status)
    ? (String(raw.status).toLowerCase() as Status)
    : "unseen";

  return {
    id: raw.id || "",
    domain: raw.domain || "",
    title: raw.title || "",
    weight: typeof raw.weight === "number" ? raw.weight : 1,
    status,
    nextDue: raw.nextDue || "",
    mastery: typeof raw.mastery === "number" ? raw.mastery : 0,
    misconception: Boolean(raw.misconception),
  };
}

// ---- Load + coerce + type the arrays ----
const objectives: Objective[] = (objectivesJson as any[]).map(coerceObjective);
const questions: Question[] = questionsJson as Question[];
const missions: Mission[] = missionsJson as unknown as Mission[];
const lessons: Lesson[] = lessonsJson as unknown as Lesson[];

// ---- Exported getters ----
export const getObjectives = (): Objective[] => objectives;
export const getQuestions = (): Question[] => questions;
export const getMissions = (): Mission[] => missions;

export const getLessons = (): Lesson[] => lessons;
export const getLesson = (id: string): Lesson | undefined =>
  lessons.find((l) => l.id === id);
