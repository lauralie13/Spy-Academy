import objectives from '@/data/objectives.json';
import questions from '@/data/questions.json';
import missions from '@/data/missions.json';

export type Objective = {
  id: string;
  domain: string;
  title: string;
  weight: number;
  status: 'unseen' | 'learning' | 'mastered';
  nextDue: string;
  mastery: number;
  misconception?: boolean;
};

export type Question = {
  id: string;
  objectiveId: string;
  domain: string;
  stem: string;
  options: string[];
  answerIndex: number;
  rationale: string;
  altExplanations: {
    mode: 'analogy' | 'picture' | 'steps' | 'story' | 'table' | 'cli';
    text: string;
  }[];
  difficulty: 1 | 2 | 3;
};

export type Mission = {
  id: string;
  title: string;
  type: 'log-hunt' | 'zone-builder';
  lore: string;
  objectives: string[];
  tasks: any;
  unlocks: string[];
};

export const getObjectives = (): Objective[] => objectives;
export const getQuestions = (): Question[] => questions;
export const getMissions = (): Mission[] => missions;

export const getQuestionsByObjective = (objectiveId: string): Question[] => {
  return questions.filter(q => q.objectiveId === objectiveId);
};

export const getQuestionsByDomain = (domain: string): Question[] => {
  return questions.filter(q => q.domain === domain);
};

export const getMissionById = (id: string): Mission | undefined => {
  return missions.find(m => m.id === id);
};