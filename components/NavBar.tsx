import Link from "next/link";
export default function NavBar() {
  const link = "text-slate-200 hover:text-emerald-300";
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="text-emerald-400 font-semibold">Spy Academy</Link>
        <Link href="/placement" className={link}>Placement</Link>
        <Link href="/academy" className={link}>Academy</Link>
        <Link href="/missions" className={link}>Missions</Link>
        <Link href="/review" className={link}>Review</Link>
      </div>
    </nav>
  );
}
