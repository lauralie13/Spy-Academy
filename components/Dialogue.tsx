"use client";

import { useState } from "react";
import type { Mission } from "@/lib/content";

export default function Dialogue({ mission }: { mission: Mission }) {
  const [done, setDone] = useState(false);

  return (
    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40">
      <h2 className="text-lg font-semibold text-slate-100 mb-2">Dialogue Simulation</h2>
      <p className="text-slate-300">
        This is a placeholder for the social-engineering roleplay (“{mission.title}”). 
        We’ll replace it with branching choices and scoring. For now, you can mark it complete.
      </p>

      {!done ? (
        <button
          onClick={() => {
            setDone(true);
            try {
              // naive local “completion” flag; your unlock logic can read this
              localStorage.setItem(`mission:complete:${mission.id}`, "1");
            } catch {}
          }}
          className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
        >
          Mark Mission Complete
        </button>
      ) : (
        <div className="mt-3 text-emerald-400 font-semibold">Mission marked complete.</div>
      )}
    </div>
  );
}
