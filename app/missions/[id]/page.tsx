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
      {mission.lore && <p className="text-slate-300 mb-4">{mission.lore}</p>}

      <MissionRenderer mission={mission} />
    </div>
  );
}
