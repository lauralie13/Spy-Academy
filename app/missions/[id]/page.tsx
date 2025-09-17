import Link from "next/link";
import { notFound } from "next/navigation";
import { getMissions } from "@/lib/content";

type Params = { params: { id: string } };

export default function MissionPage({ params }: Params) {
  const mission = getMissions().find(m => m.id === params.id);
  if (!mission) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-slate-100">{mission.title}</h1>
      <p className="text-slate-300 mt-2">{mission.lore}</p>
      <p className="mt-4">
        <Link href="/missions" className="text-emerald-400 underline">← Back to Missions</Link>
      </p>
    </div>
  );
}
