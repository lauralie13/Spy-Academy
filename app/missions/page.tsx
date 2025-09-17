"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getMissions } from "@/lib/content";

type DomainRow = { domain: string; correct: number; total: number; acc: number; avgConf: number };
type PlacementPayload = { when: string; results: any[]; domainStats: DomainRow[] };

function getLastPlacement(): PlacementPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem("placement:last");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export default function MissionsPage() {
  const missions = getMissions();
  const [last, setLast] = useState<PlacementPayload | null>(null);

  useEffect(() => {
    setLast(getLastPlacement());
  }, []);

  const weakest = useMemo(() => last?.domainStats?.[0]?.domain ?? null, [last]);

  function isUnlocked(m: any): boolean {
    if (!last?.domainStats) return true; // no placement yet → let them explore
    const row = last.domainStats.find((r) => r.domain === (m.targetDomain || r.domain));
    if (!row) return true; // unknown mapping → don’t block
    if (row.acc >= 0.5) return true; // at least 50% there → unlocked
    if (weakest && m.targetDomain && m.targetDomain === weakest) return true; // recommended path
    return false; // otherwise locked
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-100">Missions</h1>
      {last?.when ? (
        <p className="text-slate-400 text-sm mt-1">
          Based on placement: <span className="text-slate-300">{new Date(last.when).toLocaleString()}</span>
        </p>
      ) : (
        <p className="text-slate-400 text-sm mt-1">Tip: take the placement test to get tailored unlocks.</p>
      )}

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {missions.map((m) => {
          const unlocked = isUnlocked(m);
          return (
            <div key={m.id} className="relative border border-slate-800 rounded-xl p-4 bg-slate-900/40">
              {!unlocked && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm rounded-xl grid place-items-center">
                  <span className="text-slate-300 text-sm">Locked — train this domain in Academy</span>
                </div>
              )}
              <h2 className="text-lg font-semibold text-slate-100">{m.title}</h2>
              {m.targetDomain && (
                <p className="text-slate-400 text-xs mt-1">Focus: {m.targetDomain}</p>
              )}
              <p className="text-slate-300 mt-2 line-clamp-3">{m.lore}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/missions/${m.id}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    unlocked ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 border border-slate-700 pointer-events-none"
                  }`}
                >
                  {unlocked ? "Start mission" : "Locked"}
                </Link>
                {m.targetDomain && (
                  <Link
                    href="/academy"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
                  >
                    Train in Academy
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
