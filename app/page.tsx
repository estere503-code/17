import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

type Decision = { id: string; answer: unknown };
type Reconciliation = { id: string; label: string; status: string; calculation: string };
type Submission = {
  decisions: Decision[];
  statements: { profitAndLoss: Record<string, any>; cashFlow: Record<string, any>; balanceSheet: any };
  schedules: any;
  reconciliations: Reconciliation[];
  uncertainties: string[];
  boardRecommendation: { recommendation: string };
  reviewIntegrity: { submissionStatus: string; note: string };
};

async function getSubmission(): Promise<Submission> {
  const file = path.join(process.cwd(), "public", "submission.json");
  return JSON.parse(await fs.readFile(file, "utf8")) as Submission;
}

const money = (value: number) => `${value < 0 ? "(" : ""}€${Math.abs(value).toLocaleString("en-IE")}${value < 0 ? ")" : ""}`;

export default async function HomePage() {
  const data = await getSubmission();
  const pnl = data.statements.profitAndLoss;
  const cash = data.statements.cashFlow;
  const bs = data.statements.balanceSheet;
  const board = data.decisions.filter(
    (decision) => Number(decision.id.slice(1)) >= 91,
  );

  return (
    <main className="shell">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        <header className="panel hero mb-6 p-5 sm:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3"><p className="eyebrow">DPI-HT-01</p><span className="top-divider">/</span><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-400">Executive financial review</p></div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Certified reconstruction</h1>
              <p className="mt-2 text-sm muted">31 August 2026 · Agent 1 baseline · profit, liquidity, controls and valuation risk.</p>
            </div>
            <div className="flex items-center gap-3"><span className="status-badge">{data.reviewIntegrity.submissionStatus}</span><Link href="/review" className="nav-pill nav-primary">Assessor trail →</Link></div>
          </div>
          <nav aria-label="Dashboard navigation" className="dashboard-tabs mt-6 flex gap-1 overflow-x-auto border-t border-white/10 pt-4 text-sm"><a href="#overview" className="dashboard-tab active">Overview</a><a href="#statements" className="dashboard-tab">Statements</a><a href="#schedules" className="dashboard-tab">Schedules</a><a href="#checks" className="dashboard-tab">Controls</a><a href="#board" className="dashboard-tab">Board actions</a><a href="/submission.json" className="dashboard-tab">Raw JSON</a></nav>
        </header>

        <section id="overview" aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Corrected net profit" value={money(pnl.netProfit)} note="vs management claim €312,000" tone="green" badge="Certified" />
          <Metric label="Closing cash" value={money(cash.closingCash)} note="Agrees to bank evidence" tone="cyan" badge="Bank confirmed" />
          <Metric label="Total assets" value={money(bs.assets.totalAssets)} note="Statement balances" tone="blue" badge="Reconciled" />
          <Metric label="Total liabilities" value={money(bs.liabilities.totalLiabilities)} note="Includes €90k deposits" tone="amber" badge="Review" />
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-12">
          <div id="statements" className="lg:col-span-8"><SectionTitle eyebrow="Primary statements" title="Reconstructed financial statements" /><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Statement title="Profit & loss" rows={[["Revenue",pnl.revenue],["COGS",-pnl.directCosts.totalDirectCosts],["Gross profit",pnl.grossProfit],["Operating expenses",-pnl.operatingExpenses.totalOperatingExpenses],["Operating profit",pnl.operatingProfit],["Interest expense",-pnl.interestExpense],["Corrected net profit",pnl.netProfit]]} /><Statement title="Balance sheet" rows={[["Cash",bs.assets.cash],["Net receivables",bs.assets.netReceivables],["Inventory",bs.assets.inventory],["Net PPE",bs.assets.netPPE],["Total assets",bs.assets.totalAssets],["Total liabilities",-bs.liabilities.totalLiabilities],["Balancing equity",bs.equity.balancingEquity]]} /><Statement title="Cash flow" rows={[["CFO",cash.netCashFromOperations],["CFI",cash.netCashFromInvesting],["CFF",cash.netCashFromFinancing],["Net decrease",cash.netChangeInCash],["Closing cash",cash.closingCash]]} /></div></div>
          <div id="checks" className="panel p-5 lg:col-span-4"><SectionTitle eyebrow="Control centre" title="Reconciliation status" /><div className="mt-4 space-y-2">{data.reconciliations.map((check) => <div className="control-row" key={check.id}><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-white">{check.label}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 muted">{check.calculation}</p></div><StatusBadge status={check.status} /></div>)}</div></div>
        </section>

        <section id="schedules" className="mt-8"><div className="flex flex-wrap items-end justify-between gap-3"><SectionTitle eyebrow="Traceable working papers" title="Supporting schedules" /><span className="text-xs muted">Amounts in EUR · as at 31 August 2026</span></div><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Schedule title="Revenue & receivables" items={[["Delivered revenue",money(data.schedules.revenueReceivables.deliveredRevenue)],["Gross receivables",money(data.schedules.revenueReceivables.grossClosingReceivables)],["R-17 write-off",money(-data.schedules.revenueReceivables.r17WriteOff)],["Net receivables",money(data.schedules.revenueReceivables.netClosingReceivables)],["September deposits",money(data.schedules.revenueReceivables.septemberDeposits)+" liability"]} badge="Deferred deposit" /><Schedule title="Inventory & COGS" exception items={[["Opening inventory",money(data.schedules.inventoryCOGS.openingInventory)],["Purchases",money(data.schedules.inventoryCOGS.purchases)],["Materials consumed",money(-data.schedules.inventoryCOGS.materialsConsumed)],["Damaged write-off",money(-data.schedules.inventoryCOGS.damagedWriteOff)],["Saleable closing stock",money(data.schedules.inventoryCOGS.saleableClosingInventory)],["Unresolved gap",money(data.schedules.inventoryCOGS.unresolvedGap)]]} badge="€9k exception" /><Schedule title="Payroll" items={[["Expense",money(data.schedules.payroll.totalExpense)],["Cash paid",money(-data.schedules.payroll.cashPaid)],["Opening unpaid",money(data.schedules.payroll.openingUnpaid)],["Closing accrual",money(data.schedules.payroll.closingAccrual)],["Event delivery",money(data.schedules.payroll.eventDelivery.expense)],["Sales / partnerships",money(data.schedules.payroll.salesPartnerships.expense)]]} /><Schedule title="Operating expenses" items={[["Total operating expenses",money(data.schedules.operatingExpenses.total)],["Sales payroll",money(data.schedules.operatingExpenses.salesPayroll)],["Office payroll",money(data.schedules.operatingExpenses.officePayroll)],["Rent",money(data.schedules.operatingExpenses.rent)],["Marketing",money(data.schedules.operatingExpenses.marketing)],["Depreciation",money(data.schedules.operatingExpenses.depreciation)],["Legal provision",money(data.schedules.operatingExpenses.legalProvision)]]} /><Schedule title="PPE & depreciation" items={[["Closing PPE cost",money(data.schedules.ppeDepreciation.closingCost)],["Accumulated depreciation",money(-data.schedules.ppeDepreciation.closingAccumulatedDepreciation)],["Net PPE",money(data.schedules.ppeDepreciation.netPPE)],["Packaging machine",money(data.schedules.ppeDepreciation.packagingMachine)],["Photo booth",money(data.schedules.ppeDepreciation.photoBooth)],["Repair excluded",money(data.schedules.ppeDepreciation.repairNotCapitalized)]]} /><Schedule title="Debt, interest & equity" items={[["Closing loan",money(data.schedules.debtInterest.closingLoan)],["Interest expense",money(data.schedules.debtInterest.interestExpense)],["Interest payable",money(data.schedules.debtInterest.interestPayable)],["Owner distributions",money(data.schedules.equityDistributions.totalDistributions)],["Closing equity",money(data.schedules.equityDistributions.closingBalancingEquity)]]} /></div></section>

        <section className="mt-8 grid gap-5 lg:grid-cols-12"><div className="panel p-5 lg:col-span-4"><SectionTitle eyebrow="Open items" title="Material uncertainties" /><div className="mt-4 space-y-3">{data.uncertainties.map((item) => <p className="callout-warning" key={item}>{item}</p>)}<p className="rounded-xl bg-white/[0.04] p-4 text-xs leading-5 muted">{data.reviewIntegrity.note}</p></div></div><div id="board" className="panel p-5 lg:col-span-8"><div className="flex flex-wrap items-start justify-between gap-3"><SectionTitle eyebrow="Required D091–D100" title="Board action register" /><StatusBadge status="review" /></div><p className="mt-3 text-sm leading-6 muted">Use the corrected accounts for valuation and earn-out decisions, subject to resolving or transparently disclosing the open exceptions.</p><div className="mt-4 grid gap-2 md:grid-cols-2">{board.map((item) => <div className="board-row" key={item.id}><span className="font-bold text-indigo-300">{item.id}</span><span className="text-sm leading-5 text-slate-200">{String(item.answer)}</span></div>)}</div></div></section>
      </div>
    </main>
  );
}

function Metric({label,value,note,tone,badge}:{label:string;value:string;note:string;tone:string;badge:string}) { return <div className={`metric-card tone-${tone}`}><div className="flex items-start justify-between gap-2"><p className="text-sm muted">{label}</p><span className="mini-badge">{badge}</span></div><p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p><p className="mt-2 text-xs muted">{note}</p></div>; }
function Statement({title,rows}:{title:string;rows:[string,number][]}) { return <div className="panel overflow-hidden"><div className="border-b border-white/10 px-4 py-4"><h2 className="text-base font-semibold text-white">{title}</h2></div><div className="table-scroll"><table className="financial-table"><thead><tr><th>Line item</th><th>EUR</th></tr></thead><tbody>{rows.map(([label,value]) => <tr className={label.includes("profit") || label.includes("Total") || label.includes("equity") || label.includes("Closing") ? "total-row" : ""} key={label}><th scope="row">{label}</th><td className={value < 0 ? "negative" : ""}>{money(value)}</td></tr>)}</tbody></table></div></div>; }
function Schedule({title,items,exception=false,badge}:{title:string;items:[string,string][];exception?:boolean;badge?:string}) { return <div className={`panel overflow-hidden ${exception ? "exception-panel" : ""}`}><div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-4"><h3 className="text-base font-semibold text-white">{title}</h3>{badge && <span className={`mini-badge ${exception ? "warning" : ""}`}>{badge}</span>}</div><div className="table-scroll"><table className="financial-table compact"><thead><tr><th>Line item</th><th>EUR</th></tr></thead><tbody>{items.map(([label,value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table></div></div>; }
function StatusBadge({status}:{status:string}) { return <span className={`status ${status}`}>{status === "pass" ? "Pass" : status === "exception" ? "Exception" : "Review"}</span>; }
function SectionTitle({eyebrow,title}:{eyebrow:string;title:string}) { return <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">{title}</h2></div>; }

// JSX syntax normalized for Vercel build
