"use client";
import { useMemo, useState } from "react";
import type { Mission } from "@/lib/content";

// Tiny helpers
function cls(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function MissionRenderer({ mission }: { mission: Mission }) {
  switch (mission.type) {
    case "log-hunt":
      return <LogHunt mission={mission} />;
    case "dialogue":
      return <Dialogue mission={mission} />;
    case "zone-builder":
      return <ZoneBuilder mission={mission} />;
    case "detector":
      return <Detector mission={mission} />;
    case "phishing-forensics":
      return <PhishingForensics mission={mission} />;
    default:
      return <div className="text-slate-300">This mission type isn’t implemented yet.</div>;
  }
}

/* =============== LOG HUNT =============== */
function LogHunt({ mission }: { mission: Mission }) {
  const t = mission.tasks as any;
  const [ip, setIp] = useState("");
  const [failCount, setFailCount] = useState<number | null>(null);
  const [mitigation, setMitigation] = useState<number | null>(null);
  const [writeup, setWriteup] = useState("");

  function runCount() {
    const lines = String(t.logText).split("\n");
    const fails = lines.filter((ln) => /Failed password/i.test(ln));
    const groupByIp: Record<string, number> = {};
    fails.forEach((ln) => {
      const m = ln.match(/from ([0-9.]+)/i);
      if (m) groupByIp[m[1]] = (groupByIp[m[1]] || 0) + 1;
    });
    const count = ip && groupByIp[ip] ? groupByIp[ip] : Math.max(...Object.values(groupByIp));
    setFailCount(isFinite(count) ? count : 0);
  }

  const correct = failCount === t.answer;
  const mitOk = mitigation === t.mitigationIndex;
  const writeOk = writeup.trim().length >= (t.minWords || 50);

  return (
    <div className="space-y-4">
      <p className="text-slate-300 whitespace-pre-wrap">{mission.lore}</p>

      <div className="grid md:grid-cols-2 gap-4">
        <textarea
          className="w-full h-48 bg-slate-900 border border-slate-700 rounded p-2 font-mono text-xs text-slate-200"
          readOnly
          value={t.logText}
        />
        <div className="space-y-2">
          <label className="block text-sm text-slate-400">Focus IP (optional)</label>
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="203.0.113.7"
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
          />
          <button onClick={runCount} className="mt-2 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white">
            Count failed attempts
          </button>
          {failCount !== null && (
            <div className={cls("mt-2 text-sm", correct ? "text-emerald-400" : "text-red-400")}>
              {t.question} <b>{failCount}</b> {correct ? "✓" : "✗ (try again)"}
            </div>
          )}

          <div className="mt-3">
            <div className="text-sm text-slate-400 mb-1">Mitigation</div>
            <div className="space-y-1">
              {t.mitigationOptions.map((opt: string, i: number) => (
                <label key={i} className="flex items-center gap-2 text-slate-200">
                  <input
                    type="radio"
                    name="mit"
                    checked={mitigation === i}
                    onChange={() => setMitigation(i)}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {mitigation !== null && (
              <div className={cls("text-sm mt-1", mitOk ? "text-emerald-400" : "text-red-400")}>
                {mitOk ? "Good hardening choice." : "Consider key-based auth + lockout policy."}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm text-slate-400 mb-1">Write a brief incident note</div>
        <textarea
          value={writeup}
          onChange={(e) => setWriteup(e.target.value)}
          placeholder="What happened, indicators, and the change you’ll make…"
          className="w-full h-28 bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
        />
        <div className="text-xs text-slate-500 mt-1">
          {writeup.trim().split(/\s+/).filter(Boolean).length} words (aim {t.minWords}–{t.maxWords})
        </div>
      </div>

      <div className="pt-2">
        <BadgeBar ok={correct && mitOk && writeOk} />
      </div>
    </div>
  );
}

/* =============== DIALOGUE =============== */
function Dialogue({ mission }: { mission: Mission }) {
  const t = mission.tasks as any;
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const step = t.steps[idx];
  const done = idx >= t.steps.length;

  function choose(opt: any) {
    setScore((s) => s + (opt.score || 0));
    setIdx((i) => i + 1);
  }

  if (done) {
    const pass = score >= (t.passScore || 3);
    return (
      <div className="space-y-3">
        <p className="text-slate-300">{mission.lore}</p>
        <div className={cls("p-3 rounded border", pass ? "border-emerald-500 bg-emerald-500/10" : "border-yellow-500 bg-yellow-500/10")}>
          Final score: {score} / pass ≥ {t.passScore}. {pass ? "✅ Passed" : "⚠ Needs improvement"}
        </div>
        <p className="text-slate-400 text-sm">Artifact unlocked: {t.artifact}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-slate-400 text-sm">{step.speaker}</div>
      <div className="text-slate-200">{step.text}</div>
      <div className="space-y-2 mt-2">
        {step.options.map((o: any, i: number) => (
          <button
            key={i}
            onClick={() => choose(o)}
            className="block w-full text-left px-3 py-2 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100"
            title={o.note}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="text-xs text-slate-500">Progress {idx + 1}/{t.steps.length}</div>
    </div>
  );
}

/* =============== ZONE BUILDER (simplified) =============== */
function ZoneBuilder({ mission }: { mission: Mission }) {
  const t = mission.tasks as any;
  const [assign, setAssign] = useState<Record<string, string>>({});

  const score = useMemo(() => {
    let ok = 0;
    for (const a of t.assets) if (assign[a.name] === a.correctZone) ok++;
    return ok;
  }, [assign, t.assets]);

  return (
    <div className="space-y-4">
      <p className="text-slate-300">{mission.lore}</p>
      <div className="grid md:grid-cols-2 gap-4">
        {t.assets.map((a: any) => (
          <div key={a.name} className="p-3 rounded border border-slate-700 bg-slate-900">
            <div className="text-slate-100">{a.name}</div>
            <div className="text-xs text-slate-400 mb-2">{a.controlHint}</div>
            <select
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
              value={assign[a.name] || ""}
              onChange={(e) => setAssign({ ...assign, [a.name]: e.target.value })}
            >
              <option value="">Pick a zone…</option>
              {t.zones.map((z: string) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="text-sm text-slate-300">Correct placements: {score}/{t.assets.length}</div>
      <BadgeBar ok={score === t.assets.length} />
    </div>
  );
}

/* =============== DETECTOR (threshold) =============== */
function Detector({ mission }: { mission: Mission }) {
  const t = mission.tasks as any;
  const [threshold, setThreshold] = useState<number>(t.defaultThreshold || 20);

  const rows = useMemo(() => {
    const lines = String(t.datasetCsv).trim().split("\n");
    const head = lines.shift()!.split(",");
    return lines.map((ln) => {
      const cols = ln.split(",");
      const o: any = {};
      head.forEach((h, i) => (o[h] = isNaN(+cols[i]) ? cols[i] : +cols[i]));
      return o;
    });
  }, [t.datasetCsv]);

  const suspects = rows.filter((r: any) => (r[t.thresholdField] || 0) > threshold && (r.likes ?? 0) < 2);
  return (
    <div className="space-y-3">
      <p className="text-slate-300">{mission.lore}</p>
      <div className="flex items-center gap-3">
        <div className="text-slate-400 text-sm">Threshold ({t.thresholdField})</div>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(parseInt(e.target.value || "0"))}
          className="w-24 bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
        />
      </div>
      <div className="text-slate-300 text-sm">Flagged accounts: {suspects.length}</div>
      <ul className="text-slate-200 text-sm space-y-1">
        {suspects.map((s: any) => (
          <li key={s.user} className="border border-slate-700 rounded px-2 py-1 bg-slate-900">
            {s.user} — posts {s.posts}, likes {s.likes}, follows {s.follows}
          </li>
        ))}
      </ul>
      <div className="text-slate-400 text-xs">{t.explain}</div>
      <BadgeBar ok={suspects.length >= 2} />
    </div>
  );
}

/* =============== PHISHING =============== */
function PhishingForensics({ mission }: { mission: Mission }) {
  const t = mission.tasks as any;
  const [answers, setAnswers] = useState<string[]>(Array(t.questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    setSubmitted(true);
  }
  const correct = submitted && answers.every((a, i) => a.toLowerCase().trim() === String(t.questions[i].answer).toLowerCase());

  return (
    <div className="space-y-3">
      <p className="text-slate-300">{mission.lore}</p>
      <textarea readOnly className="w-full h-40 bg-slate-900 border border-slate-700 rounded p-2 font-mono text-xs text-slate-200" value={t.headers} />
      <div className="space-y-2">
        {t.questions.map((q: any, i: number) => (
          <div key={i} className="space-y-1">
            <div className="text-slate-200">{q.prompt}</div>
            <select
              className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              value={answers[i]}
              onChange={(e) => {
                const next = [...answers];
                next[i] = e.target.value;
                setAnswers(next);
              }}
            >
              <option value="">Choose…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}
      </div>
      <button onClick={submit} className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white">Submit</button>
      {submitted && (
        <div className={cls("text-sm", correct ? "text-emerald-400" : "text-red-400")}>
          {correct ? "Good catch. SPF fail + no DKIM." : "Recheck SPF/DKIM and sender domain."}
        </div>
      )}
      <div className="text-xs text-slate-400">{t.explain}</div>
      <BadgeBar ok={!!correct} />
    </div>
  );
}

/* =============== Shared: badge =============== */
function BadgeBar({ ok }: { ok: boolean }) {
  return (
    <div className={cls("px-3 py-2 rounded border text-sm", ok ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : "border-slate-700 bg-slate-900 text-slate-400")}>
      {ok ? "✅ Mission objectives met — artifact unlocked." : "Complete all checks to unlock the artifact."}
    </div>
  );
}
