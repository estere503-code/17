import Link from "next/link";

const metrics = [
  ["Corrected Net Profit", "€65,000", "Agent 1 Baseline"],
  ["Cash", "€60,000", "31 August 2026"],
  ["Receivables", "€168,000", "Net of R-17"],
  ["Inventory", "€121,000", "Saleable closing stock"],
] as const;

export default function HomePage() {
  return (
    <main className="shell">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">DPI-HT-01 · Certified review</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">DPI HT 01 Financial Reconciliations</h1>
        <p className="mt-5 max-w-2xl text-lg muted">Agent 1’s corrected baseline for the reporting date of 31 August 2026.</p>
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([label, value, note]) => <div className="panel p-5" key={label}><p className="text-sm muted">{label}</p><p className="mt-3 text-3xl font-bold text-white">{value}</p><p className="mt-2 text-xs muted">{note}</p></div>)}
        </section>
        <section className="panel mt-8 p-6">
          <h2 className="text-xl font-bold text-white">Reconciled baseline</h2>
          <div className="mt-5 grid gap-4 text-sm text-slate-300 md:grid-cols-3">
            <p><span className="block muted">Revenue</span><strong className="text-lg text-white">€960,000</strong></p>
            <p><span className="block muted">Gross profit</span><strong className="text-lg text-white">€475,000</strong></p>
            <p><span className="block muted">Total assets</span><strong className="text-lg text-white">€540,000</strong></p>
            <p><span className="block muted">Total liabilities</span><strong className="text-lg text-white">€406,000</strong></p>
            <p><span className="block muted">Balancing equity</span><strong className="text-lg text-white">€134,000</strong></p>
            <p><span className="block muted">Net cash movement</span><strong className="text-lg text-white">(€20,000)</strong></p>
          </div>
        </section>
        <div className="mt-8 flex flex-wrap gap-4"><Link href="/review" className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300">Open assessor review trail</Link><a href="/submission.json" className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-white hover:border-cyan-300">View raw submission JSON</a></div>
      </div>
    </main>
  );
}
