'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { getQuestions } from '@/lib/content';
import QuizEngine from '@/components/QuizEngine';

export default function ReviewPage() {
  const router = useRouter();
  const { 
    initializeData,
    getDueObjectives,
    updateQuestionResult,
    scheduleNext,
    dyslexiaMode,
    reduceMotion 
  } = useGameStore();
  
  const [drillQuestions, setDrillQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    initializeData();
    
    const dueObjectives = getDueObjectives();
    const allQuestions = getQuestions();
    const questionsToReview: string[] = [];
    
    // Select up to 2 questions per due objective, max 10 total
    dueObjectives.slice(0, 5).forEach(objective => {
      const objectiveQuestions = allQuestions
        .filter(q => q.objectiveId === objective.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      
      questionsToReview.push(...objectiveQuestions.map(q => q.id));
    });
    
    setDrillQuestions(questionsToReview.slice(0, 10));
  }, [initializeData, getDueObjectives]);

  const handleAnswer = (correct: boolean, confidence: number) => {
    const questionId = drillQuestions[currentIndex];
    const result = { questionId, correct, confidence };
    
    const newResults = [...results, result];
    setResults(newResults);
    
    updateQuestionResult(questionId, correct, confidence);
    
    // Find the question to get its objective ID
    const question = getQuestions().find(q => q.id === questionId);
    if (question) {
      scheduleNext(question.objectiveId, correct, confidence);
    }

    if (currentIndex < drillQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 2000);
    } else {
      setTimeout(() => {
        setIsComplete(true);
      }, 2000);
    }
  };

  if (drillQuestions.length === 0) {
    return (
      <div className={`min-h-screen p-4 ${dyslexiaMode ? 'dyslexia-font' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/academy')}
              className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Academy</span>
            </button>
          </div>
          
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">All Caught Up!</h2>
            <p className="text-slate-400 mb-6">
              No objectives are due for review right now. Check back later or take the placement test to get started.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/academy')}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-colors"
              >
                Back to Academy
              </button>
              <button
                onClick={() => router.push('/placement')}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl transition-colors"
              >
                Take Placement Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = getQuestions().find(q => q.id === drillQuestions[currentIndex]);
  const progress = ((currentIndex + (results.length > currentIndex ? 1 : 0)) / drillQuestions.length) * 100;

  if (isComplete) {
    const correctCount = results.filter(r => r.correct).length;
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    
    return (
      <div className={`min-h-screen p-4 ${dyslexiaMode ? 'dyslexia-font' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-emerald-300 mb-4">Drill Complete</h1>
            <p className="text-slate-300">
              You answered {correctCount} out of {results.length} questions correctly
            </p>
            <p className="text-slate-400 text-sm">
              Average confidence: {Math.round(avgConfidence)}%
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4">Performance Summary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {Math.round((correctCount / results.length) * 100)}%
                </div>
                <div className="text-sm text-slate-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {Math.round(avgConfidence)}%
                </div>
                <div className="text-sm text-slate-400">Avg Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {results.filter(r => !r.correct && r.confidence >= 70).length}
                </div>
                <div className="text-sm text-slate-400">High-Confidence Errors</div>
              </div>
            </div>
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={() => router.push('/academy')}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-colors"
            >
              Back to Academy
            </button>
            <button
              onClick={() => router.push('/missions')}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl transition-colors"
            >
              Try Missions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading drill...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${dyslexiaMode ? 'dyslexia-font' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/academy')}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Academy</span>
          </button>
          
          <div className="text-right">
            <div className="text-sm text-slate-400">Daily Drill</div>
            <div className="text-cyan-300 font-medium">
              Question {currentIndex + 1} of {drillQuestions.length}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-slate-400">
            {Math.round(progress)}% Complete
          </div>
        </div>

        <QuizEngine
          question={currentQuestion}
          onAnswer={handleAnswer}
          showResult={results.length > currentIndex}
          userAnswer={results[currentIndex]?.questionId === currentQuestion.id ? 
            (results[currentIndex].correct ? currentQuestion.answerIndex : 
            undefined) : undefined}
        />
      </div>
    </div>
  );
}