import { getQuestions, getObjectives, type Objective } from './content';

export type DomainProfile = {
  domain: string;
  correct: number;
  total: number;
  confidence: number;
  mastery: number;
};

export const computeDomainProfile = (results: {
  questionId: string;
  correct: boolean;
  confidence: number;
}[]): DomainProfile[] => {
  const questions = getQuestions();
  const domains = Array.from(new Set(questions.map(q => q.domain)));
  
  return domains.map(domain => {
    const domainQuestions = questions.filter(q => q.domain === domain);
    const domainResults = results.filter(r => {
      const question = questions.find(q => q.id === r.questionId);
      return question?.domain === domain;
    });
    
    if (domainResults.length === 0) {
      return {
        domain,
        correct: 0,
        total: 0,
        confidence: 0,
        mastery: 0
      };
    }
    
    const correct = domainResults.filter(r => r.correct).length;
    const total = domainResults.length;
    const avgConfidence = domainResults.reduce((sum, r) => sum + r.confidence, 0) / total;
    const mastery = (correct / total) * 100;
    
    return {
      domain,
      correct,
      total,
      confidence: avgConfidence,
      mastery
    };
  });
};

export const generatePlacementQuiz = (): string[] => {
  const questions = getQuestions();
  const domains = Array.from(new Set(questions.map(q => q.domain)));
  const selected: string[] = [];
  
  // Select 3 questions per domain, or all available if fewer than 3
  domains.forEach(domain => {
    const domainQuestions = questions.filter(q => q.domain === domain);
    const shuffled = [...domainQuestions].sort(() => Math.random() - 0.5);
    const toSelect = Math.min(3, domainQuestions.length);
    
    for (let i = 0; i < toSelect; i++) {
      selected.push(shuffled[i].id);
    }
  });
  
  return selected.sort(() => Math.random() - 0.5);
};

export const seedInitialObjectives = (profile: DomainProfile[]): Objective[] => {
  const objectives = getObjectives();
  const now = new Date();
  
  return objectives.map(obj => {
    const domainProfile = profile.find(p => p.domain === obj.domain);
    const mastery = domainProfile?.mastery || 0;
    
    let status: 'unseen' | 'learning' | 'mastered' = 'unseen';
    let nextDue = '';
    
    if (mastery >= 80) {
      status = 'mastered';
      nextDue = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (mastery >= 30) {
      status = 'learning';
      nextDue = new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(); // 1 hour
    } else {
      status = 'learning';
      nextDue = now.toISOString(); // Available now for weak areas
    }
    
    return {
      ...obj,
      status,
      mastery,
      nextDue
    };
  });
};