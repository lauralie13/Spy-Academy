export type MissionScore = {
  detection: number;
  decision: number;
  reporting: number;
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
};

export const scoreLogHunt = (
  answerCorrect: boolean,
  mitigationCorrect: boolean,
  reportWordCount: number,
  minWords: number,
  maxWords: number
): MissionScore => {
  let detection = answerCorrect ? 30 : 0;
  let decision = mitigationCorrect ? 35 : 0;
  let reporting = 0;
  
  if (reportWordCount >= minWords && reportWordCount <= maxWords) {
    reporting = 35;
  } else if (reportWordCount >= minWords * 0.8) {
    reporting = 25;
  } else if (reportWordCount >= minWords * 0.5) {
    reporting = 15;
  }
  
  const total = detection + decision + reporting;
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (total >= 90) grade = 'A';
  else if (total >= 80) grade = 'B';
  else if (total >= 70) grade = 'C';
  else if (total >= 60) grade = 'D';
  else grade = 'F';
  
  return { detection, decision, reporting, total, grade };
};

export const scoreZoneBuilder = (
  correctPlacements: number,
  totalAssets: number
): MissionScore => {
  const accuracy = correctPlacements / totalAssets;
  const detection = Math.round(accuracy * 40);
  const decision = Math.round(accuracy * 40);
  const reporting = Math.round(accuracy * 20);
  const total = detection + decision + reporting;
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (total >= 90) grade = 'A';
  else if (total >= 80) grade = 'B';
  else if (total >= 70) grade = 'C';
  else if (total >= 60) grade = 'D';
  else grade = 'F';
  
  return { detection, decision, reporting, total, grade };
};