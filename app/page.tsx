import fs from "fs/promises";
import path from "path";

const money = (value: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

type AnyData = any;

async function loadData(): Promise<AnyData> {
  const file = path.join(process.cwd(), "public", "submission.json");
  return JSON.parse(await fs.readFile(file, "utf8"));
}

function Table({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <table><tbody>{rows.map(([label, value]) => <tr key={label}><td>{label}</td><td className="amount">{money(value)}</td></tr>)}</tbody></table>
    </section>
  );
}

export default async function HomePage() {
  const data = await loadData();
  const pnl = data.statements.profitAndLoss;
  const bs = data.statements.balanceSheet;
  const cash = data.statements.cashFlow;
  const board = data.decisions.filter((decision: AnyData) => Number(decision.id.slice(1)) >= 91);

  return (
    <main className="shell"><style>{`:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f7eee8;color:#433536;font-family:Inter,ui-sans-serif,system-ui,sans-serif}.shell{min-height:100vh;background:linear-gradient(135deg,#f8eee8 0%,#f8e7ea 52%,#f3e8df 100%)}.wrap{max-width:1400px;margin:0 auto;padding:28px 20px 64px}.panel,.metric-card{background:#fffaf5;border:1px solid #e7cfc8;border-radius:18px;box-shadow:0 14px 34px rgba(104,64,66,.11)}.panel{padding:22px}.hero{padding:30px}.eyebrow{color:#b04a73;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}h1{font-size:clamp(30px,5vw,58px);line-height:1.05;margin:12px 0;color:#433536}h2{font-size:20px;margin:0 0 16px;color:#433536}.muted{color:#766666;line-height:1.6}nav{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;padding-top:18px;border-top:1px solid #ead8d1}nav a{color:#9d3f68;text-decoration:none;padding:9px 13px;border-radius:999px;background:#f7dfe5}nav a:hover{background:#d9779b;color:white}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:20px 0}.metric-card{padding:20px}.metric-card span,.metric-card small{display:block;color:#766666}.metric-card strong{display:block;color:#a33f6c;font-size:30px;margin:12px 0}.grid{display:grid;gap:16px}.three{grid-template-columns:repeat(3,1fr)}.section{margin-top:24px}table{width:100%;border-collapse:collapse}td{padding:11px 0;border-bottom:1px solid #ead8d1}td:last-child{text-align:right;font-variant-numeric:tabular-nums}.amount{color:#433536;font-weight:700}.checks{display:grid;gap:10px}.check{display:flex;justify-content:space-between;gap:18px;padding:14px;border:1px solid #e7cfc8;border-radius:12px;background:#fff3ee}.check p{margin:5px 0 0}.check b{color:#a33f6c;text-transform:uppercase;font-size:12px}.board{display:grid;gap:10px}.board-row{display:flex;justify-content:space-between;gap:18px;padding:14px;border:1px solid #f1b8cb;border-radius:12px;background:#fff0f3;color:#4b2636}.board-row strong{color:#b42367;min-width:42px}@media(max-width:950px){.metrics,.three{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.wrap{padding:16px 12px 40px}.hero{padding:20px}.metrics,.three{grid-template-columns:1fr}.metric-card strong{font-size:25px}.board-row{display:block}.board-row strong{display:block;margin-bottom:6px}}`}</style>
      <div className="wrap">
        <header className="panel hero">
          <p className="eyebrow">DPI HT 01 · Agent 1 certified baseline</p>
          <h1>DPI HT 01 Financial Reconciliations</h1>
          <p className="muted">Corrected accounts and evidence-led decision register at 31 August 2026.</p>
          <nav><a href="#statements">Statements</a><a href="#schedules">Schedules</a><a href="#checks">Checks</a><a href="#board">Board actions</a><a href="/review">Review trail</a><a href="/submission.json">Raw JSON</a></nav>
        </header>

        <section className="metrics">
          <div className="metric-card"><span>Corrected net profit</span><strong>{money(pnl.netProfit)}</strong><small>Management claim: €312,000</small></div>
          <div className="metric-card"><span>Closing cash</span><strong>{money(bs.assets.cash)}</strong><small>Bank-reconciled balance</small></div>
          <div className="metric-card"><span>Total assets</span><strong>{money(bs.assets.totalAssets)}</strong><small>Receivables, inventory and PPE included</small></div>
          <div className="metric-card"><span>Total liabilities</span><strong>{money(bs.liabilities.totalLiabilities)}</strong><small>Including provisions and deposits</small></div>
        </section>

        <section id="statements" className="grid three">
          <Table title="Profit & loss" rows={[["Revenue", pnl.revenue],["COGS", -pnl.directCosts.totalDirectCosts],["Gross profit", pnl.grossProfit],["Operating expenses", -pnl.operatingExpenses.totalOperatingExpenses],["Operating profit", pnl.operatingProfit],["Interest expense", -pnl.interestExpense],["Corrected net profit", pnl.netProfit]]} />
          <Table title="Balance sheet" rows={[["Cash", bs.assets.cash],["Net receivables", bs.assets.netReceivables],["Inventory", bs.assets.inventory],["Net PPE", bs.assets.netPPE],["Total assets", bs.assets.totalAssets],["Total liabilities", -bs.liabilities.totalLiabilities],["Balancing equity", bs.equity.balancingEquity]]} />
          <Table title="Cash flow" rows={[["CFO", cash.netCashFromOperations],["CFI", cash.netCashFromInvesting],["CFF", cash.netCashFromFinancing],["Net decrease", cash.netChangeInCash],["Closing cash", cash.closingCash]]} />
        </section>

        <section id="schedules" className="panel section">
          <p className="eyebrow">Traceable working papers</p><h2>Supporting schedules</h2>
          <div className="grid three">
            <Table title="Revenue & receivables" rows={[["Delivered revenue", data.schedules.revenueReceivables.deliveredRevenue],["Gross receivables", data.schedules.revenueReceivables.grossClosingReceivables],["R-17 write-off", -data.schedules.revenueReceivables.r17WriteOff],["Net receivables", data.schedules.revenueReceivables.netClosingReceivables],["September deposits", data.schedules.revenueReceivables.septemberDeposits]]} />
            <Table title="Inventory & COGS · €9k exception" rows={[["Opening inventory", data.schedules.inventoryCOGS.openingInventory],["Purchases", data.schedules.inventoryCOGS.purchases],["Materials consumed", -data.schedules.inventoryCOGS.materialsConsumed],["Damaged write-off", -data.schedules.inventoryCOGS.damagedWriteOff],["Saleable closing stock", data.schedules.inventoryCOGS.saleableClosingInventory],["Unresolved gap", data.schedules.inventoryCOGS.unresolvedGap]]} />
            <Table title="Payroll" rows={[["Expense", data.schedules.payroll.totalExpense],["Cash paid", -data.schedules.payroll.cashPaid],["Opening unpaid", data.schedules.payroll.openingUnpaid],["Closing accrual", data.schedules.payroll.closingAccrual]]} />
            <Table title="Operating expenses" rows={[["Total operating expenses", data.schedules.operatingExpenses.total],["Sales payroll", data.schedules.operatingExpenses.salesPayroll],["Office payroll", data.schedules.operatingExpenses.officePayroll],["Rent", data.schedules.operatingExpenses.rent],["Marketing", data.schedules.operatingExpenses.marketing],["Depreciation", data.schedules.operatingExpenses.depreciation],["Legal provision", data.schedules.operatingExpenses.legalProvision]]} />
            <Table title="PPE & depreciation" rows={[["Closing PPE cost", data.schedules.ppeDepreciation.closingCost],["Accumulated depreciation", -data.schedules.ppeDepreciation.closingAccumulatedDepreciation],["Net PPE", data.schedules.ppeDepreciation.netPPE]]} />
            <Table title="Debt, interest & equity" rows={[["Closing loan", data.schedules.debtInterest.closingLoan],["Interest expense", data.schedules.debtInterest.interestExpense],["Interest payable", data.schedules.debtInterest.interestPayable],["Owner distributions", data.schedules.equityDistributions.totalDistributions],["Closing equity", data.schedules.equityDistributions.closingBalancingEquity]]} />
          </div>
        </section>

        <section id="checks" className="panel section"><p className="eyebrow">Control evidence</p><h2>Reconciliation checks</h2><div className="checks">{data.reconciliations.map((check: AnyData) => <div className="check" key={check.id}><div><strong>{check.label}</strong><p className="muted">{check.calculation}</p></div><b>{check.status}</b></div>)}</div></section>

        <section id="board" className="panel section"><p className="eyebrow">Required D091–D100</p><h2>Board action register</h2><p className="muted">Use corrected accounts for valuation and earn-out decisions, subject to resolving or disclosing open exceptions.</p><div className="board">{board.map((item: AnyData) => <div className="board-row" key={item.id}><strong>{item.id}</strong><span>{String(item.answer)}</span></div>)}</div></section>
      </div>
    </main>
  );
}
