import { notFound } from "next/navigation";
import Link from "next/link";
import { getLesson } from "@/lib/content";

export default function LessonPage({ params }: { params: { id: string } }) {
  const lesson = getLesson(params.id);
  if (!lesson) return notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-100">{lesson.title}</h1>
      <p className="text-slate-400 text-sm mt-1">{lesson.domain}</p>

      <div className="mt-4 whitespace-pre-wrap text-slate-200">
        {lesson.body}
      </div>

      <div className="mt-6 flex gap-4">
        <Link href="/academy" className="text-emerald-300 underline">
          ← Back to Academy
        </Link>
        <Link href="/missions" className="text-cyan-300 underline">
          Missions
        </Link>
      </div>
    </div>
  );
}
