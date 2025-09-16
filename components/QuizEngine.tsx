'use client';

import { useState } from 'react';
import { type Question } from '@/lib/content';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import ExplanationSwitcher from './ExplanationSwitcher';

interface QuizEngineProps {
  question: Question;
  onAnswer: (correct: boolean, confidence: number) => void;
  showResult?: boolean;
  userAnswer?: number;
}

export default function QuizEngine({ question, onAnswer, showResult, userAnswer }: QuizEngineProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(userAnswer ?? null);
  const [confidence, setConfidence] = useState(50);
  const [isGuessing, setIsGuessing] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(showResult || false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const finalConfidence = isGuessing ? Math.min(30, confidence) : confidence;
    const correct = selectedAnswer === question.answerIndex;
    
    setHasAnswered(true);
    onAnswer(correct, finalConfidence);
  };

  const isCorrect = selectedAnswer === question.answerIndex;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-cyan-300 mb-4">{question.stem}</h3>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !hasAnswered && setSelectedAnswer(index)}
            disabled={hasAnswered}
            className={`w-full p-4 text-left rounded-xl border transition-all ${
              hasAnswered
                ? index === question.answerIndex
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : selectedAnswer === index && index !== question.answerIndex
                  ? 'border-red-500 bg-red-500/10 text-red-300'
                  : 'border-slate-700 bg-slate-800/30 text-slate-400'
                : selectedAnswer === index
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/30 text-slate-200 hover:bg-slate-700/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
              {hasAnswered && (
                <div className="ml-auto">
                  {index === question.answerIndex ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : selectedAnswer === index ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : null}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {!hasAnswered && (
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-200">Confidence Level</label>
              <span className="text-cyan-400 font-medium">{confidence}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Guessing</span>
              <span>Very Confident</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="guessing"
              checked={isGuessing}
              onChange={(e) => setIsGuessing(e.target.checked)}
              className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
            />
            <label htmlFor="guessing" className="text-sm text-slate-300">
              I'm mostly guessing
            </label>
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      )}

      {!hasAnswered ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="w-full py-3 px-6 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:text-slate-400 text-white font-semibold rounded-xl transition-colors"
        >
          Submit Answer
        </button>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${
            isCorrect 
              ? 'border-emerald-500 bg-emerald-500/10' 
              : 'border-red-500 bg-red-500/10'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-semibold ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
          </div>

          <ExplanationSwitcher
            explanations={question.altExplanations}
            initialRationale={question.rationale}
          />
        </div>
      )}
    </div>
  );
}