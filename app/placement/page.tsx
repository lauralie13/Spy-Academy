'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { generatePlacementQuiz, computeDomainProfile, seedInitialObjectives } from '@/lib/placement';
import { getQuestions } from '@/lib/content';
import QuizEngine from '@/components/QuizEngine';
import HeatmapProgress from '@/components/HeatmapProgress';

export default function PlacementPage() {
  const router = useRouter();
  const { initializeData, updateQuestionResult, dyslexiaMode, reduceMotion } = useGameStore();
  const [quizQuestions, setQuizQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<{ questionId: string; correct: boolean; confidence: number; }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [domainProfiles, setDomainProfiles] = useState<any[]>([]);

  useEffect(() => {
    initializeData();
    const questions = generatePlacementQuiz();
    setQuizQuestions(questions);
  }, [initializeData]);

  const handleAnswer = (correct: boolean, confidence: number) => {
    const questionId = quizQuestions[currentQuestionIndex];
    const result = { questionId, correct, confidence };
    
    const newResults = [...results, result];
    setResults(newResults);
    updateQuestionResult(questionId, correct, confidence);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 2000);
    } else {
      // Complete the quiz
      setTimeout(() => {
        const profiles = computeDomainProfile(newResults);
        setDomainProfiles(profiles);
        const objectives = seedInitialObjectives(profiles);
        useGameStore.setState({ objectives });
        setIsComplete(true);
      }, 2000);
    }
  };

  if (!quizQuestions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Initializing placement assessment...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = getQuestions().find(q => q.id === quizQuestions[currentQuestionIndex]);
  const progress = ((currentQuestionIndex + (results.length > currentQuestionIndex ? 1 : 0)) / quizQuestions.length) * 100;

  if (isComplete) {
    return (
      <div className={`min-h-screen p-4 ${dyslexiaMode ? 'dyslexia-font' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-emerald-300 mb-4">Assessment Complete</h1>
            <p className="text-slate-300">
              Your personalized learning path has been generated based on your performance.
            </p>
          </div>

          <HeatmapProgress domainProfiles={domainProfiles} />

          <div className="mt-8 text-center space-x-4">
            <button
              onClick={() => router.push('/academy')}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-colors"
            >
              Start Learning
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl transition-colors"
            >
              Return Home
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
          <p className="text-red-400">Error loading question</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${dyslexiaMode ? 'dyslexia-font' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <div className="text-right">
            <div className="text-sm text-slate-400">Placement Assessment</div>
            <div className="text-cyan-300 font-medium">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
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
          showResult={results.length > currentQuestionIndex}
          userAnswer={results[currentQuestionIndex]?.questionId === currentQuestion.id ? 
            (results[currentQuestionIndex].correct ? currentQuestion.answerIndex : 
            results.findIndex(r => r.questionId === currentQuestion.id && !r.correct)) : undefined}
        />
      </div>
    </div>
  );
}