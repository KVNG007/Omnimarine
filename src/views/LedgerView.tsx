import { ArrowDownRight, ArrowUpRight, Download, Leaf, Ship, Wallet } from 'lucide-react'
import { PageHeading, Panel, PanelTitle, StatusBadge } from '@/components/DashboardPrimitives'
import { formatUsd } from '@/lib/format'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { terminalSavings } from '@/data/mockMaritimeData'

function LedgerView() {
  const { state } = useMaritimeData()
  const demurrageAvoided = state.ledger.filter((entry) => entry.category === 'Demurrage avoided').reduce((total, entry) => total + entry.amount, 0)
  const portCosts = state.ledger.filter((entry) => entry.category === 'Port cost').reduce((total, entry) => total + entry.amount, 0)
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading eyebrow="Impact / 03" title="Economic & Carbon Ledger" description="An auditable view of port cost exposure, operational savings, and estimated emissions impact." action={<button className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[10px] text-slate-300"><Download className="size-3" /> Export ledger</button>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Wallet} label="Demurrage exposure" value={formatUsd(state.totals.demurrageExposureUsd)} note="−$186K vs. July baseline" tone="amber" />
        <SummaryCard icon={ArrowDownRight} label="Savings captured" value={formatUsd(state.totals.monthlySavingsUsd)} note={`${formatUsd(demurrageAvoided)} demurrage avoided`} tone="emerald" />
        <SummaryCard icon={Leaf} label="Carbon avoided" value={`${state.totals.carbonAvoidedTonnes.toFixed(1)} t`} note="Estimated CO₂ equivalent" tone="cyan" />
        <SummaryCard icon={Ship} label="Port costs tracked" value={formatUsd(portCosts)} note={`${state.ledger.length} ledger events`} tone="slate" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel>
          <PanelTitle title="Value captured over time" detail="Illustrative monthly savings · USD thousands" action={<StatusBadge tone="emerald">+18.6% M/M</StatusBadge>} />
          <div className="px-4 pb-4 pt-5">
            <div className="relative flex h-48 items-end justify-between gap-2 border-b border-l border-slate-700/70 px-2 pb-0 pt-4">
              {[25, 50, 75].map((line) => <div key={line} className="absolute left-0 right-0 border-t border-dashed border-slate-800" style={{ bottom: `${line}%` }} />)}
              {state.weeklySavingsUsd.map((amount, index) => <div key={index} className="group relative z-10 flex h-full flex-1 items-end"><div className={`w-full rounded-t-sm transition-colors ${index > 8 ? 'bg-emerald-400/70 group-hover:bg-emerald-300' : 'bg-cyan-500/55 group-hover:bg-cyan-400/80'}`} style={{ height: `${Math.max(10, Math.min(100, (amount / 120) * 100))}%` }}><span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 rounded bg-slate-800 px-1 text-[8px] text-slate-200 group-hover:block">${Math.round(amount)}K</span></div></div>)}
            </div>
            <div className="ml-2 mt-2 flex justify-between text-[8px] text-slate-600"><span>Wk 1</span><span>Wk 3</span><span>Wk 5</span><span>Wk 7</span><span>Wk 9</span><span>Wk 12</span></div>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-800 pt-4"><MiniStat label="Fuel cost avoided" value="$96.4K" /><MiniStat label="Demurrage avoided" value={formatUsd(demurrageAvoided)} /><MiniStat label="Carbon value est." value="$12.8K" /></div>
          </div>
        </Panel>
        <Panel>
          <PanelTitle title="Savings by port" detail="Distribution across Lagos terminals" />
          <div className="space-y-4 px-4 py-5">
            {terminalSavings.map((item) => <PortSavings key={item.terminal} port={item.terminal} share={item.share} value={formatUsd(item.valueUsd)} tone={item.tone} />)}
            <div className="mt-5 rounded-md border border-emerald-400/15 bg-emerald-400/5 p-3"><p className="flex items-center gap-1.5 text-[9px] font-medium text-emerald-300"><ArrowUpRight className="size-3" /> $284.6K total savings this month</p><p className="mt-1 text-[9px] leading-4 text-slate-500">Applied JIT plans and clearance actions are reflected here in real time.</p></div>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <PanelTitle title="Economic event ledger" detail="Client-side demo ledger · USD and estimated CO₂e" action={<span className="text-[9px] text-slate-500">{state.ledger.length} events</span>} />
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="border-b border-slate-800 text-[8px] uppercase tracking-[0.1em] text-slate-600"><th className="px-4 py-2.5 font-medium">Event</th><th className="px-3 py-2.5 font-medium">Vessel</th><th className="px-3 py-2.5 font-medium">Category</th><th className="px-3 py-2.5 font-medium">Detail</th><th className="px-4 py-2.5 text-right font-medium">Value</th></tr></thead><tbody className="divide-y divide-slate-800/70">{state.ledger.map((entry) => <tr key={entry.id} className="hover:bg-slate-800/25"><td className="whitespace-nowrap px-4 py-3 text-[9px] text-slate-500">{entry.date}</td><td className="px-3 py-3 text-[9px] font-medium text-slate-300">{entry.vesselName}</td><td className="px-3 py-3"><StatusBadge tone={entry.category.includes('Carbon') || entry.category.includes('Fuel') ? 'emerald' : entry.category === 'Port cost' ? 'slate' : 'cyan'}>{entry.category}</StatusBadge></td><td className="px-3 py-3 text-[9px] text-slate-500">{entry.detail}</td><td className={`whitespace-nowrap px-4 py-3 text-right text-[10px] font-semibold tabular-nums ${entry.unit === 'USD' && entry.category !== 'Port cost' || entry.unit !== 'USD' ? 'text-emerald-300' : 'text-slate-300'}`}>{entry.unit === 'USD' ? formatUsd(entry.amount) : `${entry.amount.toFixed(1)} t`}</td></tr>)}</tbody></table></div>
      </Panel>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, note, tone }: { icon: typeof Wallet; label: string; value: string; note: string; tone: 'amber' | 'emerald' | 'cyan' | 'slate' }) {
  const colors = { amber: 'text-amber-300 bg-amber-400/10', emerald: 'text-emerald-300 bg-emerald-400/10', cyan: 'text-cyan-300 bg-cyan-400/10', slate: 'text-slate-300 bg-slate-700/60' }
  return <div className="rounded-lg border border-slate-700/80 bg-slate-900/65 p-3.5"><div className="flex items-center gap-2"><span className={`flex size-7 items-center justify-center rounded-md ${colors[tone]}`}><Icon className="size-3.5" /></span><p className="text-[9px] uppercase tracking-wide text-slate-500">{label}</p></div><p className="mt-3 text-lg font-semibold tabular-nums text-slate-100">{value}</p><p className="mt-1 text-[9px] text-slate-500">{note}</p></div>
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[8px] text-slate-500">{label}</p><p className="mt-1 text-[10px] font-semibold text-slate-200">{value}</p></div>
}

function PortSavings({ port, share, value, tone }: { port: string; share: number; value: string; tone: 'cyan' | 'emerald' | 'slate' }) {
  const color = tone === 'cyan' ? 'bg-cyan-400' : tone === 'emerald' ? 'bg-emerald-400' : 'bg-slate-400'
  return <div><div className="mb-1.5 flex justify-between gap-2 text-[9px]"><span className="text-slate-400">{port}</span><span className="tabular-nums text-slate-300">{value}</span></div><div className="h-1.5 rounded-full bg-slate-800"><div className={`h-full rounded-full ${color}`} style={{ width: `${share}%` }} /></div><p className="mt-1 text-right text-[8px] text-slate-600">{share}% of captured savings</p></div>
}

export default LedgerView
