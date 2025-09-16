import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getObjectives, getQuestions, getMissions, type Objective, type Question, type Mission } from '@/lib/content';
import { computeNextDue, updateMastery, shouldBeMastered } from '@/lib/scheduler';

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  confidence: number;
  timestamp: string;
}

export interface MissionResult {
  missionId: string;
  score: number;
  completed: boolean;
  timestamp: string;
}

export interface GameState {
  // Data
  objectives: Objective[];
  questions: Question[];
  missions: Mission[];
  
  // Results
  questionResults: { [questionId: string]: QuestionResult };
  missionResults: { [missionId: string]: MissionResult };
  
  // Settings
  ethicsAccepted: boolean;
  dyslexiaMode: boolean;
  reduceMotion: boolean;
  
  // Stats
  streak: number;
  totalIntel: number;
  rank: string;
  
  // Actions
  initializeData: () => void;
  updateQuestionResult: (questionId: string, correct: boolean, confidence: number) => void;
  updateMissionResult: (missionId: string, score: number) => void;
  scheduleNext: (objectiveId: string, correct: boolean, confidence: number) => void;
  getDueObjectives: () => Objective[];
  markEthicsAccepted: () => void;
  toggleDyslexiaMode: () => void;
  toggleReduceMotion: () => void;
  getCompletedMissions: () => string[];
  reset: () => void;
}

const calculateRank = (intel: number): string => {
  if (intel >= 10000) return 'Operator';
  if (intel >= 5000) return 'Analyst';
  if (intel >= 1000) return 'Agent';
  return 'Cadet';
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      objectives: [],
      questions: [],
      missions: [],
      questionResults: {},
      missionResults: {},
      ethicsAccepted: false,
      dyslexiaMode: false,
      reduceMotion: false,
      streak: 0,
      totalIntel: 0,
      rank: 'Cadet',
      
      initializeData: () => {
        const state = get();
        if (state.objectives.length === 0) {
          set({
            objectives: getObjectives(),
            questions: getQuestions(),
            missions: getMissions()
          });
        }
      },
      
      updateQuestionResult: (questionId, correct, confidence) => {
        const result: QuestionResult = {
          questionId,
          correct,
          confidence,
          timestamp: new Date().toISOString()
        };
        
        set(state => {
          const intel = correct ? 10 + Math.round(confidence / 10) : 5;
          const newTotalIntel = state.totalIntel + intel;
          const newStreak = correct ? state.streak + 1 : 0;
          
          return {
            questionResults: {
              ...state.questionResults,
              [questionId]: result
            },
            totalIntel: newTotalIntel,
            streak: newStreak,
            rank: calculateRank(newTotalIntel)
          };
        });
      },
      
      updateMissionResult: (missionId, score) => {
        const result: MissionResult = {
          missionId,
          score,
          completed: true,
          timestamp: new Date().toISOString()
        };
        
        set(state => {
          const intel = Math.round(score * 2); // Missions give more intel
          const newTotalIntel = state.totalIntel + intel;
          
          return {
            missionResults: {
              ...state.missionResults,
              [missionId]: result
            },
            totalIntel: newTotalIntel,
            rank: calculateRank(newTotalIntel)
          };
        });
      },
      
      scheduleNext: (objectiveId, correct, confidence) => {
        set(state => {
          const objective = state.objectives.find(o => o.id === objectiveId);
          if (!objective) return state;
          
          // Count consecutive correct answers for this objective
          const objectiveResults = Object.values(state.questionResults)
            .filter(r => {
              const question = state.questions.find(q => q.id === r.questionId);
              return question?.objectiveId === objectiveId;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          let consecutiveCorrect = 0;
          for (const result of objectiveResults) {
            if (result.correct) {
              consecutiveCorrect++;
            } else {
              break;
            }
          }
          
          const highConfidenceWrong = !correct && confidence >= 70;
          const nextDue = computeNextDue(correct, consecutiveCorrect, highConfidenceWrong);
          const newMastery = updateMastery(objective.mastery, correct, confidence);
          
          let newStatus = objective.status;
          if (shouldBeMastered(newMastery, consecutiveCorrect) && !objective.misconception) {
            newStatus = 'mastered';
          } else if (newStatus === 'unseen') {
            newStatus = 'learning';
          }
          
          const updatedObjectives = state.objectives.map(o => 
            o.id === objectiveId 
              ? {
                  ...o,
                  nextDue: nextDue.toISOString(),
                  mastery: newMastery,
                  status: newStatus,
                  misconception: highConfidenceWrong || o.misconception
                }
              : o
          );
          
          return { objectives: updatedObjectives };
        });
      },
      
      getDueObjectives: () => {
        const state = get();
        const now = new Date();
        return state.objectives.filter(obj => {
          if (!obj.nextDue) return false;
          return new Date(obj.nextDue) <= now;
        });
      },
      
      markEthicsAccepted: () => set({ ethicsAccepted: true }),
      toggleDyslexiaMode: () => set(state => ({ dyslexiaMode: !state.dyslexiaMode })),
      toggleReduceMotion: () => set(state => ({ reduceMotion: !state.reduceMotion })),
      
      getCompletedMissions: () => {
        const state = get();
        return Object.values(state.missionResults)
          .filter(r => r.completed)
          .map(r => r.missionId);
      },
      
      reset: () => set({
        objectives: [],
        questions: [],
        missions: [],
        questionResults: {},
        missionResults: {},
        ethicsAccepted: false,
        dyslexiaMode: false,
        reduceMotion: false,
        streak: 0,
        totalIntel: 0,
        rank: 'Cadet'
      })
    }),
    {
      name: 'arclight-academy-storage',
      partialize: (state) => ({
        objectives: state.objectives,
        questionResults: state.questionResults,
        missionResults: state.missionResults,
        ethicsAccepted: state.ethicsAccepted,
        dyslexiaMode: state.dyslexiaMode,
        reduceMotion: state.reduceMotion,
        streak: state.streak,
        totalIntel: state.totalIntel,
        rank: state.rank
      })
    }
  )
);