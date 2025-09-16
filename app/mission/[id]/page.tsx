// app/mission/[id]/page.tsx
import Link from "next/link";

export default function MissionPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-slate-100">Mission {id}</h1>
      <p className="text-slate-300 mt-2">
        Mission view is loading. Head back to the Missions screen for now.
      </p>
      <p className="mt-4">
        <Link href="/missions" className="text-emerald-400 underline">
          ← Back to Missions
        </Link>
      </p>
    </div>
  );
}
