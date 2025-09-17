"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import QuizEngine from "@/components/QuizEngine";
import { getQuestions, getMissions, type Question } from "@/lib/content";

type Result = { id: string; correct: boolean; confidence: number };

export default function PlacementPage() {
  // Load a slice of questions (you can change 15 to whatever)
  const all = getQuestions();
  const sample = useMemo(() => all.slice(0, Math.min(15, all.length)), [all]);

  // Index and results
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);

  const done = index >= sample.length;
  const current = sample[index];

  function handleAnswer(correct: boolean, confidence: number) {
    setResults((prev) => {
      const id = current.id;
      const filtered = prev.filter((r) => r.id !== id);
      return [...filtered, { id, correct, confidence }];
    });
    // Do NOT auto-advance; we advance only when the user clicks Next
  }

  function handleNext() {
    setIndex((i) => i + 1);
  }

  // --- Compute stats when done ---
  const byId = useMemo(
    () => Object.fromEntries(sample.map((q) => [q.id, q] as const)),
    [sample]
  );

  const domainStats = useMemo(() => {
    if (!done) return null;
    // domain -> { correct, total, confSum }
    const map = new Map<
      string,
      { correct: number; total: number; confSum: number }
    >();
    for (const r of results) {
      const q: Question | undefined = byId[r.id];
      if (!q) continue;
      const key = q.domain || "General";
      const cur = map.get(key) ?? { correct: 0, total: 0, confSum: 0 };
      cur.total += 1;
      cur.confSum += r.confidence;
      if (r.correct) cur.correct += 1;
      map.set(key, cur);
    }
    const rows = Array.from(map.entries()).map(([domain, s]) => {
      const acc = s.total ? s.correct / s.total : 0;
      const avgConf = s.total ? Math.round(s.confSum / s.total) : 0;
      return { domain, correct: s.correct, total: s.total, acc, avgConf };
    });
    rows.sort((a, b) => a.acc - b.acc); // weakest first
    return rows;
  }, [done, results, byId]);

  const recommendedDomain = domainStats?.[0]?.domain ?? null;

  // Pick a recommended mission if we have missions (simple seed for now)
  const missions = getMissions();
  const recommendedMission = missions[0] ?? null;

  // Persist results for your own review — LAST RUN + HISTORY (new)
  useEffect(() => {
    if (!done) return;
    const payload = {
      when: new Date().toISOString(),
      results,
      domainStats,
    };
    try {
      // last run
      localStorage.setItem("placement:last", JSON.stringify(payload));
      // history (newest first, keep last 10)
      const raw = localStorage.getItem("placement:history");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(payload);
      localStorage.setItem("placement:history", JSON.stringify(arr.slice(0, 10)));
    } catch {}
  }, [done, results, domainStats]);

  if (done) {
    const correctCount = results.filter((r) => r.correct).length;

    return (
      <div className="max-w-3xl mx-auto bg-slate-900/60 border border-slate-700 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-slate-100">Placement Complete</h1>
        <p className="text-slate-300 mt-2">
          You answered <span className="text-emerald-300 font-semibold">{correctCount}</span> / {sample.length} correctly.
        </p>

        {/* Strengths & weaknesses */}
        {domainStats && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">Domain performance</h2>
            <div className="space-y-3">
              {domainStats.map((row) => {
                const pct = Math.round(row.acc * 100);
                return (
                  <div key={row.domain}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-200">{row.domain}</span>
                      <span className="text-slate-400">
                        {row.correct}/{row.total} · {pct}% · avg conf {row.avgConf}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded overflow-hidden mt-1">
                      <div
                        className={`h-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {recommendedDomain && (
              <p className="text-sm text-slate-400 mt-3">
                Suggested focus first: <span className="text-slate-200">{recommendedDomain}</span>
              </p>
            )}
          </div>
        )}

        {/* Next steps */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {/* Recommended Mission (if we have one) */}
          {recommendedMission && (
            <Link
              href={`/missions/${recommendedMission.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 font-medium"
            >
              Start recommended mission
            </Link>
          )}

          <Link
            href="/academy"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 font-medium"
          >
            Go to Academy plan
          </Link>

          <Link
            href="/missions"
            className="inline-flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-2 font-medium border border-slate-700"
          >
            Explore all missions
          </Link>

          <button
            onClick={() => {
              try { localStorage.clear(); } catch {}
              window.location.href = "/placement";
            }}
            className="inline-flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-2 font-medium border border-slate-700"
          >
            Retake placement
          </button>
        </div>

        {/* Utility links in case you don't have a global navbar yet */}
        <div className="mt-6 flex gap-4 text-sm">
          <Link href="/" className="text-emerald-300 underline">Home</Link>
          <Link href="/review" className="text-cyan-300 underline">Review</Link>
        </div>
      </div>
    );
  }

  // Not done yet: show the quiz
  return (
    <div className="py-8">
      <div className="text-slate-400 text-sm mb-3">
        Question {index + 1} of {sample.length}
      </div>
      <QuizEngine
        key={current.id}               // CRITICAL: reset between questions
        question={current}
        onAnswer={handleAnswer}
        onNext={handleNext}            // show Next and advance
      />
    </div>
  );
}
