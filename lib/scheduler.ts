export const computeNextDue = (
  correct: boolean,
  consecutiveCorrect: number,
  highConfidenceWrong: boolean
): Date => {
  const now = new Date();
  
  if (!correct) {
    // Miss -> retry in 24 hours
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
  
  if (highConfidenceWrong) {
    // Need to build confidence - shorter interval
    return new Date(now.getTime() + 12 * 60 * 60 * 1000);
  }
  
  // Progressive spacing for correct answers
  switch (consecutiveCorrect) {
    case 1:
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
    case 2:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    default:
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
  }
};

export const updateMastery = (
  currentMastery: number,
  correct: boolean,
  confidence: number
): number => {
  if (correct) {
    const gain = Math.min(15, 5 + (confidence / 10));
    return Math.min(100, currentMastery + gain);
  } else {
    const loss = Math.min(10, 3 + ((100 - confidence) / 20));
    return Math.max(0, currentMastery - loss);
  }
};

export const shouldBeMastered = (mastery: number, consecutiveCorrect: number): boolean => {
  return mastery >= 80 && consecutiveCorrect >= 2;
};