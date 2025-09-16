// lib/content.ts
// Strongly-typed loaders for our JSON content.
// We coerce/validate "status" so it matches the union type.

import objectivesJson from "@/data/objectives.json";
import questionsJson from "@/data/questions.json";
import missionsJson from "@/data/missions.json";

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
  altExplanations?: { mode: "analogy" | "picture" | "steps" | "story" | "table" | "cli"; text: string }[];
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
}

// ---- Coercion helpers ----
const STATUS_SET = new Set<Status>(["unseen", "learning", "mastered"]);
type RawObjective = Omit<Objective, "status"> & { status: string | undefined };

function coerceObjective(raw: RawObjective): Objective {
  const status = STATUS_SET.has((raw.status ?? "").toLowerCase() as Status)
    ? ((raw.status ?? "").toLowerCase() as Status)
    : "unseen";
  return {
    ...raw,
    status,
    nextDue: raw.nextDue ?? "",
    mastery: raw.mastery ?? 0,
  };
}

// ---- Load + coerce + type the arrays ----
const objectives: Objective[] = ((objectivesJson as unknown) as RawObjective[]).map(coerceObjective);
const questions: Question[] = (questionsJson as unknown) as Question[];
const missions: Mission[] = (missionsJson as unknown) as Mission[];

// ---- Exported getters ----
export const getObjectives = (): Objective[] => objectives;
export const getQuestions = (): Question[] => questions;
export const getMissions = (): Mission[] => missions;
