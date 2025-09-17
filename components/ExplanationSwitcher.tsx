"use client";
import React, { useState } from "react";

type Mode = "analogy" | "picture" | "steps" | "story" | "table" | "cli";
export interface Explanation { mode: Mode; text: string; }

interface Props {
  explanations?: Explanation[];    // optional
  initialRationale: string;
}

const btnBase =
  "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition border";
const btnSecondary =
  `${btnBase} bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-600`;

export default function ExplanationSwitcher({ explanations, initialRationale }: Props) {
  // Ensure we always have a safe array
  const exps = Array.isArray(explanations) ? explanations : [];
  if (exps.length === 0) return null; // nothing to show

  const [i, setI] = useState(0);
  const current = exps[i % exps.length];

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-300 text-sm">
          Alternate explanation ({current.mode})
        </p>
        <button
          type="button"
          onClick={() => setI((x) => x + 1)}
          className={btnSecondary}
        >
          Explain differently
        </button>
      </div>
      <p className="text-slate-100 mt-2 whitespace-pre-wrap">{current.text}</p>
      <p className="text-slate-400 text-xs mt-3">
        Original rationale: {initialRationale}
      </p>
    </div>
  );
}
