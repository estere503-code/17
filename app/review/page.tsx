import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

type Decision = { id: string; question: string; answer: unknown; evidence: string[]; confidence: string; reviewTier: string; statementEffect?: Record<string, unknown>; independentChallenge?: string; studentReasoning?: string };

async function getSubmission(): Promise<{ decisions: Decision[] }> {
  const file = path.join(process.cwd(), "public", "submission.json");
  return JSON.parse(await fs.readFile(file, "utf8")) as { decisions: Decision[] };
}

export default async function ReviewPage() {
  const submission = await getSubmission();
  return <main className="shell"><div className="mx-auto max-w-6xl px-6 py-12"><Link href="/" className="text-sm text-cyan-300">← Back to dashboard</Link><h1 className="mt-6 text-4xl font-bold text-white">Assessor Review Trail</h1><p className="mt-3 muted">Decision register D001–D100 from the certified Agent 1 submission.</p><div className="mt-8 space-y-3">{submission.decisions.map((decision) => <article className="panel p-5" key={decision.id}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold text-cyan-300">{decision.id} <span className="font-normal text-white">— {decision.question}</span></h2><span className="text-xs uppercase text-emerald-300">{decision.confidence} confidence</span></div><p className="mt-3 text-slate-200">{String(decision.answer)}</p><p className="mt-3 text-xs muted">Evidence: {decision.evidence.join(" · ")}</p>{decision.reviewTier === "material_judgment" && <div className="mt-4 grid gap-3 border-t border-slate-700 pt-4 text-sm md:grid-cols-3"><p><strong className="text-slate-200">Review challenge</strong><br />{decision.independentChallenge}</p><p><strong className="text-slate-200">Certified reasoning</strong><br />{decision.studentReasoning}</p><p><strong className="text-slate-200">Statement effect</strong><br />{JSON.stringify(decision.statementEffect)}</p></div>}</article>)}</div></div></main>;
}
