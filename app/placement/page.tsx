"use client";
import React, { useMemo, useState } from "react";
import QuizEngine from "@/components/QuizEngine";
import { getQuestions } from "@/lib/content"; // or import your JSON directly

export default function PlacementPage() {
  const all = getQuestions(); // or however you load questions
  const sample = useMemo(() => all.slice(0, Math.min(15, all.length)), [all]);

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ id: string; correct: boolean; confidence: number }[]>(
    []
  );

  const done = index >= sample.length;
  const current = sample[index];

  function handleAnswer(correct: boolean, confidence: number) {
    setResults((prev) => {
      const id = current.id;
      const filtered = prev.filter((r) => r.id !== id);
      return [...filtered, { id, correct, confidence }];
    });
    // IMPORTANT: do NOT advance here; we only advance when the user clicks Next
  }

  function handleNext() {
    setIndex((i) => i + 1);
  }

  if (done) {
    const correctCount = results.filter((r) => r.correct).length;
    return (
      <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-700 rounded-2xl p-6">
        <h1 className="text-xl font-semibold text-slate-100">Placement Complete</h1>
        <p className="text-slate-300 mt-2">
          You answered {correctCount} / {sample.length} correctly.
        </p>
        {/* TODO: per-domain summary/heatmap */}
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="text-slate-400 text-sm mb-3">
        Question {index + 1} of {sample.length}
      </div>
      <QuizEngine
        key={current.id}                 // CRITICAL: forces reset between questions
        question={current}
        onAnswer={handleAnswer}
        onNext={handleNext}              // NEW: shows Next and advances when clicked
      />
    </div>
  );
}
