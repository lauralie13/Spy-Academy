// lib/content.ts
// Loads content from JSON and returns strongly-typed objects,
// coercing objective.status to the allowed union so TS is happy.

import objectivesJson from "@/data/objectives.json";
import questionsJson from "@/data/questions.json";
import missionsJson from "@/data/missions.json";

// ---- Types (keep in sync with your store if you have duplicates) ----
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

type RawObjective = Omit<Objective, "status"> & { status: string };

function coerceObjective(raw: RawObjective): Objective {
  const status = STATUS_SET.has(raw.status as Status) ? (raw.status as Status) : "unseen";
  return {
    ...raw,
    status,
    nextDue: raw.nextDue ?? "", // tolerate missing field
    mastery: raw.mastery ?? 0,
  };
}

// ---- Exported getters ----
const rawObjectives = objectivesJson as unknown as RawObjective[];
const objectives: Objective[] = rawObjectives.map(coerceObjective);

const questions = questionsJson as unknown as Question[];
const missions = missionsJson as unknown as Mission[];

export const getObjectives = (): Objective[] => objectives;
export const getQuestions = (): Question[] => questions;
export const getMissions = (): Mission[] => missions;
