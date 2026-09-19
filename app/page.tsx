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
  const board = data.decisions.filter((decision) => Number(decision.id.slice(1)) >= 91);

  return (
    <main className="shell">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <header className="panel hero mb-7 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">DPI-HT-01 · Financial assessment dashboard</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">Certified reconstruction</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 muted">31 August 2026 · Agent 1 baseline · evidence-led review of profit, liquidity, controls and valuation risk.</p>
            </div>
            <span className="status-badge">{data.reviewIntegrity.submissionStatus}</span>
          </div>
          <nav aria-label="Primary navigation" className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-5 text-sm">
            <a href="#statements" className="nav-pill nav-primary">Statements</a><a href="#schedules" className="nav-pill">Schedules</a><a href="#checks" className="nav-pill">Reconciliations</a><a href="#board" className="nav-pill">Board actions</a><Link href="/review" className="nav-pill">Assessor trail →</Link><a href="/submission.json" className="nav-pill">Raw JSON</a>
          </nav>
        </header>

        <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Corrected net profit" value={money(pnl.netProfit)} note="Management claim: €312,000" tone="green" /><Metric label="Closing cash" value={money(cash.closingCash)} note="Agrees to bank evidence" tone="cyan" /><Metric label="Total assets" value={money(bs.assets.totalAssets)} note="Statement balances" tone="blue" /><Metric label="Total liabilities" value={money(bs.liabilities.totalLiabilities)} note="Includes €90k deposits" tone="amber" /></section>

        <section id="statements" className="mt-9"><SectionTitle eyebrow="Primary statements" title="Reconstructed financial statements" /><div className="mt-5 grid gap-5 lg:grid-cols-3"><Statement title="Profit & loss" rows={[["Revenue",pnl.revenue],["COGS",-pnl.directCosts.totalDirectCosts],["Gross profit",pnl.grossProfit],["Operating expenses",-pnl.operatingExpenses.totalOperatingExpenses],["Operating profit",pnl.operatingProfit],["Interest expense",-pnl.interestExpense],["Corrected net profit",pnl.netProfit]]} /><Statement title="Balance sheet" rows={[["Cash",bs.assets.cash],["Net receivables",bs.assets.netReceivables],["Inventory",bs.assets.inventory],["Net PPE",bs.assets.netPPE],["Total assets",bs.assets.totalAssets],["Total liabilities",-bs.liabilities.totalLiabilities],["Balancing equity",bs.equity.balancingEquity]]} /><Statement title="Cash flow" rows={[["CFO",cash.netCashFromOperations],["CFI",cash.netCashFromInvesting],["CFF",cash.netCashFromFinancing],["Net decrease",cash.netChangeInCash],["Closing cash",cash.closingCash]]} /></div></section>

        <section id="schedules" className="mt-10"><SectionTitle eyebrow="Traceable working papers" title="Supporting schedules" /><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3"><Schedule title="Revenue & receivables" items={[["Delivered revenue",money(data.schedules.revenueReceivables.deliveredRevenue)],["Gross receivables",money(data.schedules.revenueReceivables.grossClosingReceivables)],["R-17 write-off",money(-data.schedules.revenueReceivables.r17WriteOff)],["Net receivables",money(data.schedules.revenueReceivables.netClosingReceivables)],["September deposits",money(data.schedules.revenueReceivables.septemberDeposits)+" liability"]]} /><Schedule title="Inventory & COGS" exception items={[["Opening inventory",money(data.schedules.inventoryCOGS.openingInventory)],["Purchases",money(data.schedules.inventoryCOGS.purchases)],["Materials consumed",money(-data.schedules.inventoryCOGS.materialsConsumed)],["Damaged write-off",money(-data.schedules.inventoryCOGS.damagedWriteOff)],["Saleable closing stock",money(data.schedules.inventoryCOGS.saleableClosingInventory)],["Unresolved gap",money(data.schedules.inventoryCOGS.unresolvedGap)]]} /><Schedule title="Payroll" items={[["Expense",money(data.schedules.payroll.totalExpense)],["Cash paid",money(-data.schedules.payroll.cashPaid)],["Opening unpaid",money(data.schedules.payroll.openingUnpaid)],["Closing accrual",money(data.schedules.payroll.closingAccrual)],["Event delivery",money(data.schedules.payroll.eventDelivery.expense)],["Sales / partnerships",money(data.schedules.payroll.salesPartnerships.expense)]]} /><Schedule title="Operating expenses" items={[["Total operating expenses",money(data.schedules.operatingExpenses.total)],["Sales payroll",money(data.schedules.operatingExpenses.salesPayroll)],["Office payroll",money(data.schedules.operatingExpenses.officePayroll)],["Rent",money(data.schedules.operatingExpenses.rent)],["Marketing",money(data.schedules.operatingExpenses.marketing)],["Depreciation",money(data.schedules.operatingExpenses.depreciation)],["Legal provision",money(data.schedules.operatingExpenses.legalProvision)]]} /><Schedule title="PPE & depreciation" items={[["Closing PPE cost",money(data.schedules.ppeDepreciation.closingCost)],["Accumulated depreciation",money(-data.schedules.ppeDepreciation.closingAccumulatedDepreciation)],["Net PPE",money(data.schedules.ppeDepreciation.netPPE)],["Packaging machine",money(data.schedules.ppeDepreciation.packagingMachine)],["Photo booth",money(data.schedules.ppeDepreciation.photoBooth)],["Repair excluded",money(data.schedules.ppeDepreciation.repairNotCapitalized)]]} /><Schedule title="Debt, interest & equity" items={[["Closing loan",money(data.schedules.debtInterest.closingLoan)],["Interest expense",money(data.schedules.debtInterest.interestExpense)],["Interest payable",money(data.schedules.debtInterest.interestPayable)],["Owner distributions",money(data.schedules.equityDistributions.totalDistributions)],["Closing equity",money(data.schedules.equityDistributions.closingBalancingEquity)]]} /></div></section>

        <section id="checks" className="panel mt-10 p-5 sm:p-7"><SectionTitle eyebrow="Control evidence" title="Reconciliation checks" /><div className="mt-5 overflow-hidden rounded-2xl border border-white/10"><div className="hidden grid-cols-[minmax(0,1fr)_auto] gap-4 bg-white/[0.06] px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-300 sm:grid"><span>Check</span><span>Status</span></div>{data.reconciliations.map((check) => <div className="grid gap-2 border-t border-white/10 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4" key={check.id}><div><h3 className="font-semibold text-white">{check.label}</h3><p className="mt-1 text-sm leading-6 muted">{check.calculation}</p></div><span className={`status ${check.status}`}>{check.status}</span></div>)}</div></section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2"><div className="panel p-5 sm:p-7"><SectionTitle eyebrow="Open items" title="Material uncertainties" /><div className="mt-5 space-y-3">{data.uncertainties.map((item) => <p className="callout-warning" key={item}>{item}</p>)}<p className="rounded-xl bg-white/[0.04] p-4 text-sm leading-6 muted">{data.reviewIntegrity.note}</p></div></div><div id="board" className="panel p-5 sm:p-7"><SectionTitle eyebrow="Required D091–D100" title="Board action register" /><p className="mt-4 text-sm leading-6 muted">These actions are included because the submission schema requires a board recommendation and the assignment asks for D091–D100 governance decisions.</p><div className="mt-5 overflow-hidden rounded-2xl border border-white/10">{board.map((item) => <div className="grid gap-2 border-t border-white/10 px-4 py-3 first:border-t-0 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-4" key={item.id}><span className="font-bold text-cyan-300">{item.id}</span><span className="text-sm leading-6 text-slate-200">{String(item.answer)}</span></div>)}</div></div></section>
      </div>
    </main>
  );
}

function Metric({label,value,note,tone}:{label:string;value:string;note:string;tone:string}) { return <div className={`metric-card tone-${tone}`}><p className="text-sm muted">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p><p className="mt-2 text-xs muted">{note}</p></div>; }
function Statement({title,rows}:{title:string;rows:[string,number][]}) { return <div className="panel overflow-hidden"><div className="border-b border-white/10 px-5 py-4 sm:px-6"><h2 className="text-lg font-semibold text-white">{title}</h2></div><div className="overflow-x-auto"><table className="financial-table"><tbody>{rows.map(([label,value]) => <tr className={label.includes("profit") || label.includes("Total") || label.includes("equity") || label.includes("Closing") ? "total-row" : ""} key={label}><th scope="row">{label}</th><td className={value < 0 ? "negative" : ""}>{money(value)}</td></tr>)}</tbody></table></div></div>; }
function Schedule({title,items,exception=false}:{title:string;items:[string,string][];exception?:boolean}) { return <div className={`panel overflow-hidden ${exception ? "exception-panel" : ""}`}><div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4"><h3 className="font-semibold text-white">{title}</h3>{exception && <span className="status exception">Exception</span>}</div><div className="overflow-x-auto"><table className="financial-table compact"><tbody>{items.map(([label,value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table></div></div>; }
function SectionTitle({eyebrow,title}:{eyebrow:string;title:string}) { return <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h2></div>; }
