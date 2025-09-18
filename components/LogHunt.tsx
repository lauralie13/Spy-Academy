"use client";

import { useState } from "react";
import type { Mission } from "@/lib/content";

export default function LogHunt({ mission }: { mission: Mission }) {
  const t = (mission.tasks ?? {}) as {
    logText?: string;
    question?: string;
    answer?: number;
    mitigationOptions?: string[];
    mitigationIndex?: number;
    minWords?: number;
    maxWords?: number;
  };

  const [count, setCount] = useState<string>("");
  const [choice, setChoice] = useState<number | null>(null);
  const [explain, setExplain] = useState("");
  const [result, setResult] = useState<string>("");

  function handleSubmit() {
    const expected = typeof t.answer === "number" ? t.answer : null;
    const asNum = Number(count);
    const parts: string[] = [];

    if (expected !== null) {
      if (!Number.isFinite(asNum)) {
        parts.push("Please enter a number for the failed-attempt count.");
      } else {
        parts.push(asNum === expected ? "✅ Count is correct." : `❌ Count is ${asNum}, expected ${expected}.`);
      }
    }

    if (t.mitigationOptions && typeof t.mitigationIndex === "number") {
      if (choice === t.mitigationIndex) {
        parts.push("✅ Mitigation choice is correct.");
      } else {
        parts.push("❌ Mitigation choice isn’t the best option.");
      }
    }

    if (t.minWords || t.maxWords) {
      const words = explain.trim().split(/\s+/).filter(Boolean).length;
      const min = t.minWords ?? 0;
      const max = t.maxWords ?? Infinity;
      if (words < min) parts.push(`❌ Explanation too short (${words} words). Need at least ${min}.`);
      else if (words > max) parts.push(`❌ Explanation too long (${words} words). Keep under ${max}.`);
      else parts.push(`✅ Explanation length OK (${words} words).`);
    }

    const ok = parts.every(p => p.startsWith("✅"));
    if (ok) {
      try { localStorage.setItem(`mission:complete:${mission.id}`, "1"); } catch {}
      parts.push("🎉 Mission marked complete.");
    }
    setResult(parts.join("\n"));
  }

  return (
    <div className="space-y-4">
      {mission.lore && <p className="text-slate-300">{mission.lore}</p>}

      {t.logText && (
        <div>
          <h3 className="text-slate-100 font-semibold mb-1">Log excerpt</h3>
          <pre className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 overflow-auto text-xs leading-relaxed whitespace-pre-wrap">
{t.logText}
          </pre>
        </div>
      )}

      {t.question && (
        <div>
          <label className="block text-slate-200 mb-1">{t.question}</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-40 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
            placeholder="e.g., 3"
          />
        </div>
      )}

      {Array.isArray(t.mitigationOptions) && (
        <div>
          <h4 className="text-slate-200 font-medium mb-2">Pick a mitigation</h4>
          <div className="space-y-2">
            {t.mitigationOptions.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-slate-200">
                <input
                  type="radio"
                  name="mit"
                  checked={choice === i}
                  onChange={() => setChoice(i)}
                  className="accent-emerald-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {(t.minWords || t.maxWords) && (
        <div>
          <label className="block text-slate-200 mb-1">Explain your mitigation</label>
          <textarea
            value={explain}
            onChange={(e) => setExplain(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
            placeholder="Propose SSH hardening steps, lockout policy, key-only auth, etc."
          />
          <div className="text-xs text-slate-400 mt-1">
            {t.minWords ? `Min ${t.minWords} words` : null}
            {t.minWords && t.maxWords ? " · " : null}
            {t.maxWords ? `Max ${t.maxWords} words` : null}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
      >
        Submit
      </button>

      {result && (
        <pre className="whitespace-pre-wrap bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-sm text-slate-200">
{result}
        </pre>
      )}
    </div>
  );
}
