'use client';

import { useState } from 'react';
import { RotateCcw, BookOpen } from 'lucide-react';

interface ExplanationSwitcherProps {
  explanations: {
    mode: 'analogy' | 'picture' | 'steps' | 'story' | 'table' | 'cli';
    text: string;
  }[];
  initialRationale: string;
}

export default function ExplanationSwitcher({ explanations, initialRationale }: ExplanationSwitcherProps) {
  const [currentMode, setCurrentMode] = useState<string>('rationale');

  const allExplanations = [
    { mode: 'rationale', text: initialRationale },
    ...explanations
  ];

  const nextMode = () => {
    const currentIndex = allExplanations.findIndex(exp => exp.mode === currentMode);
    const nextIndex = (currentIndex + 1) % allExplanations.length;
    setCurrentMode(allExplanations[nextIndex].mode);
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'rationale': return 'Standard';
      case 'analogy': return 'Analogy';
      case 'picture': return 'Visual';
      case 'steps': return 'Step-by-step';
      case 'story': return 'Story';
      case 'table': return 'Summary';
      case 'cli': return 'Technical';
      default: return 'Unknown';
    }
  };

  const currentExplanation = allExplanations.find(exp => exp.mode === currentMode);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-slate-200">
            Explanation: {getModeLabel(currentMode)}
          </span>
        </div>
        <button
          onClick={nextMode}
          className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg text-cyan-400 text-sm transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Explain differently</span>
        </button>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">
        {currentExplanation?.text || initialRationale}
      </p>
    </div>
  );
}