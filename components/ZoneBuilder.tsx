"use client";

import { useMemo, useState } from "react";
import type { Mission } from "@/lib/content";

type Asset = { name: string; correctZone: string; controlHint?: string };

export default function ZoneBuilder({ mission }: { mission: Mission }) {
  const t = (mission.tasks ?? {}) as {
    zones?: string[];
    assets?: Asset[];
  };

  const zones = Array.isArray(t.zones) && t.zones.length ? t.zones : ["Public", "DMZ", "Internal", "Restricted"];
  const assets = Array.isArray(t.assets) ? t.assets : [];

  const [placement, setPlacement] = useState<Record<string, string>>({});
  const [score, setScore] = useState<string>("");

  const total = assets.length;
  const correctCount = useMemo(() => {
    return assets.reduce((acc, a) => acc + (placement[a.name] === a.correctZone ? 1 : 0), 0);
  }, [assets, placement]);

  function submit() {
    const ok = correctCount === total && total > 0;
    const lines = [
      `Placed correctly: ${correctCount} / ${total}`,
      ok ? "✅ All assets placed in the right zones." : "❌ Some assets still misplaced.",
    ];
    if (ok) {
      try { localStorage.setItem(`mission:complete:${mission.id}`, "1"); } catch {}
      lines.push("🎉 Mission marked complete.");
    }
    setScore(lines.join("\n"));
  }

  return (
    <div className="space-y-4">
      {mission.lore && <p className="text-slate-300">{mission.lore}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {assets.map((a) => (
          <div key={a.name} className="border border-slate-800 rounded-lg p-3 bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div className="text-slate-100 font-medium">{a.name}</div>
              <select
                value={placement[a.name] ?? ""}
                onChange={(e) => setPlacement((prev) => ({ ...prev, [a.name]: e.target.value }))}
                className="bg-slate-900 border border-slate-700 text-slate-100 rounded-md px-2 py-1"
              >
                <option value="" disabled>Select zone…</option>
                {zones.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
            {a.controlHint && (
              <div className="text-xs text-slate-400 mt-2">Hint: {a.controlHint}</div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
        disabled={total === 0}
      >
        Check placements
      </button>

      {score && (
        <pre className="whitespace-pre-wrap bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-sm text-slate-200">
{score}
        </pre>
      )}
    </div>
  );
}
