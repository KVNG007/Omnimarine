import { ArrowUpRight, LocateFixed, Radar, Route, Ship, Waves } from 'lucide-react'
import { PageHeading, Panel, PanelTitle, RiskBadge, StatusBadge } from '@/components/DashboardPrimitives'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { terminals } from '@/data/mockMaritimeData'

function TrafficView() {
  const { state, dispatch } = useMaritimeData()
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading eyebrow="Operations / 01" title="Live Traffic & JIT Arrival" description="Lagos approaches · Vessel movements, berth readiness, and just-in-time arrival planning." action={<div className="flex items-center gap-2"><StatusBadge tone="emerald"><span className="mr-1.5 size-1.5 rounded-full bg-emerald-400" />AIS FEED ACTIVE</StatusBadge><button className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[10px] text-slate-300"><LocateFixed className="size-3" /> Lagos domain</button></div>} />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <Panel className="overflow-hidden">
          <PanelTitle title="Lagos coastal picture" detail="AIS positions · Gulf of Guinea · Simulation view" action={<span className="flex items-center gap-1.5 text-[9px] text-slate-500"><Radar className="size-3.5 text-cyan-400" /> LIVE SIMULATION</span>} />
          <div className="relative min-h-[300px] overflow-hidden bg-[#0b1e34] sm:min-h-[365px]">
            <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'linear-gradient(rgba(56,189,248,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.12) 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
            <div className="absolute -right-8 -top-8 h-[115%] w-[44%] rotate-[18deg] border-l border-cyan-300/20 bg-[#102c40]/80" />
            <div className="absolute right-[15%] top-[15%] h-[65%] w-px rotate-[18deg] bg-cyan-300/15" />
            <div className="absolute right-[23%] top-[25%] h-[55%] w-px rotate-[18deg] bg-cyan-300/15" />
            <div className="absolute bottom-6 left-5 flex items-center gap-2 rounded border border-cyan-400/20 bg-[#0a192f]/80 px-2.5 py-1.5"><Waves className="size-3.5 text-cyan-300" /><span className="text-[9px] font-medium tracking-wide text-cyan-100">GULF OF GUINEA</span></div>
            <div className="absolute right-[12%] top-[20%] rounded border border-slate-600/60 bg-[#0a192f]/80 px-2 py-1 text-[9px] text-slate-400">LEKKI PORT</div>
            <div className="absolute right-[18%] top-[52%] rounded border border-slate-600/60 bg-[#0a192f]/80 px-2 py-1 text-[9px] text-slate-400">TIN CAN ISLAND</div>
            <div className="absolute right-[27%] top-[70%] rounded border border-slate-600/60 bg-[#0a192f]/80 px-2 py-1 text-[9px] text-slate-400">APAPA</div>
            <div className="absolute right-[32%] top-[31%] h-[42%] w-px rotate-[44deg] border-l border-dashed border-cyan-300/40" />
            {state.vessels.slice(0, 5).map((vessel, index) => {
              const spots = [
                'left-[27%] top-[24%]', 'left-[42%] top-[48%]', 'left-[61%] top-[26%]', 'left-[36%] top-[70%]', 'left-[19%] top-[58%]',
              ]
              const active = vessel.jitApplied
              return <div key={vessel.id} className={`group absolute ${spots[index]} z-10`}>
                <span className={`absolute -inset-2 animate-ping rounded-full opacity-25 ${active ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                <span className={`relative flex size-5 rotate-45 items-center justify-center rounded-sm border ${active ? 'border-emerald-300 bg-emerald-400/20' : 'border-cyan-300 bg-cyan-400/20'}`}><Ship className={`size-3 -rotate-45 ${active ? 'text-emerald-200' : 'text-cyan-200'}`} /></span>
                <span className="absolute left-6 top-0 hidden whitespace-nowrap rounded bg-[#071323]/90 px-1.5 py-1 text-[8px] text-slate-200 group-hover:block">{vessel.name}</span>
              </div>
            })}
            <div className="absolute left-4 top-4 flex flex-col gap-1 rounded border border-slate-700/70 bg-[#071323]/80 p-2 text-[8px] text-slate-500"><span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-cyan-300" />At anchorage</span><span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-emerald-300" />JIT window set</span></div>
          </div>
        </Panel>

        <Panel>
          <PanelTitle title="Terminal readiness" detail="Operational snapshot · Lagos ports" action={<button aria-label="Open terminal detail" className="text-slate-500 hover:text-cyan-300"><ArrowUpRight className="size-4" /></button>} />
          <div className="divide-y divide-slate-800/80">
            {terminals.map((terminal) => <div key={terminal.code} className="px-4 py-4">
              <div className="flex items-start justify-between gap-2"><div><h3 className="text-[11px] font-medium text-slate-200">{terminal.short}</h3><p className="mt-1 text-[9px] text-slate-500">{terminal.zone} · {terminal.code}</p></div><StatusBadge tone={terminal.signal === 'Congested' ? 'amber' : terminal.signal === 'On plan' ? 'emerald' : 'cyan'}>{terminal.signal}</StatusBadge></div>
              <div className="mt-3 flex items-center justify-between text-[9px] text-slate-500"><span>Berth utilization</span><span className="text-slate-300">{terminal.occupancy}%</span></div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${terminal.occupancy > 80 ? 'bg-amber-400' : 'bg-cyan-400'}`} style={{ width: `${terminal.occupancy}%` }} /></div>
              <div className="mt-2 text-[9px] text-slate-500">{terminal.vessels} vessels alongside / scheduled</div>
            </div>)}
          </div>
          <div className="mx-4 mb-4 flex items-center gap-2 rounded-md border border-amber-400/15 bg-amber-400/5 px-3 py-2.5 text-[9px] text-amber-200/80"><span className="size-1.5 rounded-full bg-amber-400" />Apapa berth congestion risk · 6h 20m forecast</div>
        </Panel>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <PanelTitle title="Vessel arrival queue" detail={`${state.vessels.length} representative vessels · ${state.totals.waitingVessels} total waiting at Lagos approaches`} action={<button className="flex items-center gap-1.5 rounded-md border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1.5 text-[9px] font-medium text-cyan-200"><Route className="size-3" /> Optimize arrival plan</button>} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead><tr className="border-b border-slate-800 text-[8px] uppercase tracking-[0.1em] text-slate-600"><th className="px-4 py-2.5 font-medium">Vessel / IMO</th><th className="px-3 py-2.5 font-medium">Position</th><th className="px-3 py-2.5 font-medium">Destination</th><th className="px-3 py-2.5 font-medium">ETA · Wait</th><th className="px-3 py-2.5 font-medium">Risk</th><th className="px-3 py-2.5 font-medium">Status</th><th className="px-4 py-2.5 text-right font-medium">JIT action</th></tr></thead>
            <tbody className="divide-y divide-slate-800/70">
              {state.vessels.map((vessel) => <tr key={vessel.id} className="transition-colors hover:bg-slate-800/25">
                <td className="px-4 py-3"><p className="text-[10px] font-medium text-slate-200">{vessel.name}</p><p className="mt-1 text-[8px] text-slate-500">{vessel.imo} · {vessel.type}</p></td>
                <td className="px-3 py-3 text-[9px] text-slate-400">{vessel.location}</td>
                <td className="px-3 py-3 text-[9px] text-slate-400">{vessel.terminal.replace(' Container Terminal', '').replace(' (TICT)', '')}</td>
                <td className="px-3 py-3"><p className="text-[9px] text-slate-300">{vessel.eta}</p><p className="mt-1 text-[8px] text-slate-500">{vessel.waitHours}h avg wait</p></td>
                <td className="px-3 py-3"><RiskBadge risk={vessel.risk} /></td>
                <td className="px-3 py-3"><StatusBadge tone={vessel.jitApplied ? 'emerald' : 'slate'}>{vessel.status}</StatusBadge></td>
                <td className="px-4 py-3 text-right"><button disabled={vessel.jitApplied || vessel.status === 'At berth'} onClick={() => dispatch({ type: 'apply-jit-plan', vesselId: vessel.id })} className={`rounded px-2.5 py-1.5 text-[9px] font-medium transition-colors ${vessel.jitApplied ? 'cursor-default text-emerald-300' : 'bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:text-slate-600'}`}>{vessel.jitApplied ? 'Plan applied ✓' : 'Apply JIT plan'}</button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

export default TrafficView
