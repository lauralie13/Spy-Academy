import { notFound } from "next/navigation";
import Link from "next/link";
import { getMissions } from "@/lib/content";

export default function MissionDetail({ params }: { params: { id: string } }) {
  const mission = getMissions().find((m) => m.id === params.id);
  if (!mission) return notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-100">{mission.title}</h1>
      <p className="text-slate-300 mt-2">{mission.lore}</p>
      {mission.objectives?.length ? (
        <p className="text-slate-400 text-sm mt-2">
          Objectives: {mission.objectives.join(", ")}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
          <h2 className="font-semibold text-slate-100">Step 1 — Study</h2>
          <p className="text-slate-300">Open the Academy topic that matches this mission’s focus.</p>
          <div className="mt-2">
            <Link href="/academy" className="text-emerald-300 underline">
              Go to Academy
            </Link>
          </div>
        </div>
        <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
          <h2 className="font-semibold text-slate-100">Step 2 — Drill</h2>
          <p className="text-slate-300">Answer a short quiz on this domain to reinforce concepts.</p>
          <div className="mt-2">
            <Link href="/placement" className="text-cyan-300 underline">
              Take 5-question spot check
            </Link>
          </div>
        </div>
        <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
          <h2 className="font-semibold text-slate-100">Step 3 — Apply</h2>
          <p className="text-slate-300">We’ll later add a hands-on task (logs, CLI, or scenario). For now, track completion manually.</p>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/missions" className="text-emerald-300 underline">
          ← Back to Missions
        </Link>
      </div>
    </div>
  );
}
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMissions } from "@/lib/content";
import MissionRenderer from "@/components/MissionRenderer";

export default function MissionDetail({ params }: { params: { id: string } }) {
  const mission = getMissions().find((m) => m.id === params.id);
  if (!mission) return notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-100">{mission.title}</h1>
        <Link href="/missions" className="text-emerald-300 underline">← Back to Missions</Link>
      </div>
      {mission.targetDomain && (
        <div className="text-xs text-slate-400 mb-3">Focus: {mission.targetDomain}</div>
      )}
      <MissionRenderer mission={mission} />
    </div>
  );
}

