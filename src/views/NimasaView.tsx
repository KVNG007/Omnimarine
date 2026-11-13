import { ArrowUpRight, Building2, Landmark, ShieldCheck, Ship, TrendingDown } from 'lucide-react'
import { PageHeading, Panel, PanelTitle, RiskBadge, StatusBadge } from '@/components/DashboardPrimitives'
import { formatUsd } from '@/lib/format'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { agencyConnections, getPendingDocumentCount, terminals } from '@/data/mockMaritimeData'

function NimasaView() {
  const { state } = useMaritimeData()
  const pendingDocs = getPendingDocumentCount(state)
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading eyebrow="National intelligence / 05" title="NIMASA National Catalyst View" description="A national-scale view of maritime flow, port performance, regulatory coordination, and seafarer outcomes." action={<StatusBadge tone="cyan"><Landmark className="mr-1 size-3" /> POLICY & SECTOR VIEW</StatusBadge>} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <NationalMetric icon={Ship} label="Vessels waiting · Lagos" value={String(state.totals.waitingVessels)} note="July 2026 baseline: 39" tone="cyan" />
        <NationalMetric icon={TrendingDown} label="Demurrage exposure" value={formatUsd(state.totals.demurrageExposureUsd)} note="Baseline: $3.38M" tone="amber" />
        <NationalMetric icon={Building2} label="Port calls · month to date" value={String(state.totals.portCallsMonthToDate)} note="Apapa · Tin Can · Lekki" tone="slate" />
        <NationalMetric icon={ShieldCheck} label="Pre-arrival clearance" value={`${Math.max(62, 100 - pendingDocs * 5)}%`} note={`${pendingDocs} documents in review`} tone="emerald" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <PanelTitle title="Lagos port system snapshot" detail="Three strategic gateways · July 2026 baseline context" action={<span className="text-[9px] text-slate-500">LAGOS STATE</span>} />
          <div className="grid divide-y divide-slate-800/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {terminals.map((terminal, index) => <div key={terminal.code} className="p-4">
              <div className="flex items-center justify-between"><span className="flex size-7 items-center justify-center rounded-md border border-slate-700 bg-slate-800/70 text-[9px] font-semibold text-cyan-200">0{index + 1}</span><RiskBadge risk={terminal.occupancy > 80 ? 'Elevated' : terminal.occupancy > 70 ? 'Watch' : 'Low'} /></div>
              <h3 className="mt-4 text-[10px] font-semibold text-slate-200">{terminal.short}</h3><p className="mt-1 text-[8px] text-slate-500">{terminal.zone}</p>
              <div className="mt-4 flex items-end justify-between"><div><p className="text-[8px] uppercase tracking-wide text-slate-600">Berth utilization</p><p className="mt-1 text-xl font-semibold tabular-nums text-slate-100">{terminal.occupancy}<span className="text-xs text-slate-500">%</span></p></div><p className="text-right text-[8px] text-slate-500">{terminal.vessels}<br />vessels</p></div>
              <div className="mt-2 h-1 rounded-full bg-slate-800"><div className={`h-full rounded-full ${terminal.occupancy > 80 ? 'bg-amber-400' : 'bg-cyan-400'}`} style={{ width: `${terminal.occupancy}%` }} /></div>
            </div>)}
          </div>
          <div className="mx-4 mb-4 flex items-center gap-2 border-t border-slate-800 pt-3 text-[9px] text-slate-500"><span className="size-1.5 rounded-full bg-cyan-400" />National port performance dashboard · Illustrative Lagos subset</div>
        </Panel>

        <Panel>
          <PanelTitle title="Sector impact indicators" detail="Illustrative national catalyst outcomes" />
          <div className="space-y-4 px-4 py-4">
            <Impact label="Average vessel waiting time" metric={`${state.totals.averageWaitHours.toFixed(1)}h`} sub="Baseline: 74.5h · Regional comparator: 96h" value={78} tone="amber" />
            <Impact label="Monthly demurrage savings" metric={formatUsd(state.totals.monthlySavingsUsd)} sub="JIT coordination and pre-arrival clearance" value={68} tone="emerald" />
            <Impact label="Carbon avoided" metric={`${state.totals.carbonAvoidedTonnes.toFixed(1)} t`} sub="Estimated through reduced anchorage idle" value={42} tone="cyan" />
            <div className="rounded-md border border-cyan-400/15 bg-cyan-400/5 p-3"><p className="flex items-center gap-1.5 text-[9px] font-medium text-cyan-200"><ArrowUpRight className="size-3" /> Coordinated visibility unlocks capacity</p><p className="mt-1 text-[8px] leading-4 text-slate-500">Shared arrival, documentation, and crew signals can help align national policy with day-to-day port operations.</p></div>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <PanelTitle title="Regulatory coordination layer" detail="Illustrative interoperability map · No live agency connection" action={<span className="text-[9px] text-slate-500">DEMO CONFIGURATION</span>} />
        <div className="grid divide-y divide-slate-800/70 md:grid-cols-2 md:divide-x md:divide-y-0">
          {agencyConnections.map((agency) => <div key={agency.abbr} className="flex items-center gap-3 px-4 py-3.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-800/70 text-[8px] font-semibold text-slate-300">{agency.abbr}</span><div className="min-w-0 flex-1"><p className="truncate text-[9px] font-medium text-slate-200">{agency.name}</p><p className="mt-1 truncate text-[8px] text-slate-500">{agency.focus}</p></div><StatusBadge tone={agency.tone}>{agency.status}</StatusBadge></div>)}
        </div>
      </Panel>
      <p className="mt-3 px-1 text-[8px] leading-4 text-slate-600">All national and agency indicators on this page are fictional presentation data for product demonstration and should not be interpreted as official statistics or active integrations.</p>
    </div>
  )
}

function NationalMetric({ icon: Icon, label, value, note, tone }: { icon: typeof Ship; label: string; value: string; note: string; tone: 'cyan' | 'amber' | 'slate' | 'emerald' }) {
  const colors = { cyan: 'text-cyan-300', amber: 'text-amber-300', slate: 'text-slate-100', emerald: 'text-emerald-300' }
  return <div className="rounded-lg border border-slate-700/80 bg-slate-900/65 p-3.5"><div className="flex items-center gap-2"><Icon className={`size-3.5 ${colors[tone]}`} /><p className="text-[9px] uppercase tracking-wide text-slate-500">{label}</p></div><p className={`mt-3 text-xl font-semibold tabular-nums ${colors[tone]}`}>{value}</p><p className="mt-1 text-[9px] text-slate-600">{note}</p></div>
}

function Impact({ label, metric, sub, value, tone }: { label: string; metric: string; sub: string; value: number; tone: 'amber' | 'emerald' | 'cyan' }) {
  const color = tone === 'amber' ? 'bg-amber-400' : tone === 'emerald' ? 'bg-emerald-400' : 'bg-cyan-400'
  const textColor = tone === 'amber' ? 'text-amber-300' : tone === 'emerald' ? 'text-emerald-300' : 'text-cyan-300'
  return <div><div className="flex items-end justify-between gap-2"><div><p className="text-[9px] text-slate-400">{label}</p><p className="mt-1 text-[8px] text-slate-600">{sub}</p></div><p className={`whitespace-nowrap text-sm font-semibold tabular-nums ${textColor}`}>{metric}</p></div><div className="mt-2 h-1 rounded-full bg-slate-800"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div></div>
}

export default NimasaView
