import cinematics from "@/data/cinematics.json";

export default function Chapter1() {
  const c = (cinematics as any[]).find((x) => x.id === "chapter1_opening");
  if (!c) return null;
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-100">{c.title}</h1>
      <div className="mt-4 whitespace-pre-wrap text-slate-200">{c.body}</div>
    </div>
  );
}
