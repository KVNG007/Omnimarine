import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { Anchor, ArrowDownRight, BarChart3, BookOpenCheck, ChevronRight, HeartPulse, Play, RotateCcw, Shield, Ship, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { formatUsd } from '@/lib/format'
import TrafficView from '@/views/TrafficView'
import ClearanceView from '@/views/ClearanceView'
import LedgerView from '@/views/LedgerView'
import WellbeingView from '@/views/WellbeingView'
import NimasaView from '@/views/NimasaView'
import { getCrewAlertCount, getPendingDocumentCount, terminals } from '@/data/mockMaritimeData'
import PitchWalkthrough from '@/components/PitchWalkthrough'

const navigation = [
  { to: '/traffic', label: 'Live Traffic & JIT Arrival', short: 'Live traffic', icon: Ship },
  { to: '/clearance', label: 'Pre-Arrival Doc Clearance', short: 'Doc clearance', icon: BookOpenCheck },
  { to: '/ledger', label: 'Economic & Carbon Ledger', short: 'Impact ledger', icon: BarChart3 },
  { to: '/wellbeing', label: 'Seafarer Wellbeing', sublabel: '(Crew & Fleet)', short: 'Crew & fleet', icon: HeartPulse },
  { to: '/nimasa', label: 'NIMASA National Catalyst', short: 'National view', icon: Shield },
]

function AppShell() {
  const { state, dispatch } = useMaritimeData()
  const [pitchStep, setPitchStep] = useState<number | null>(null)
  const pendingDocs = getPendingDocumentCount(state)
  const crewAlerts = getCrewAlertCount(state)

  return (
    <div className="min-h-svh bg-[#0a192f] text-slate-100 lg:flex">
      <aside className="flex w-full shrink-0 flex-col border-b border-slate-800 bg-[#081426] lg:sticky lg:top-0 lg:h-svh lg:w-[254px] lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20"><Anchor className="size-4" /></div>
          <div><p className="text-sm font-bold tracking-wide text-white">OMNIMARINE</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-slate-500">Maritime intelligence</p></div>
        </div>

        <div className="hidden px-4 pb-3 lg:block">
          <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-[10px] text-slate-400"><SlidersHorizontal className="size-3.5" /> Lagos Maritime Domain <ChevronRight className="ml-auto size-3" /></div>
        </div>
        <nav aria-label="Platform views" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0">
          <p className="hidden px-2 pb-2 pt-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600 lg:block">Operations</p>
          {navigation.map((item, index) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `group flex min-w-max items-center gap-3 rounded-md px-3 py-2.5 text-left text-[11px] transition-colors lg:min-w-0 ${isActive ? 'bg-cyan-400/10 font-medium text-cyan-200 ring-1 ring-inset ring-cyan-400/15' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'}`}>
                <Icon className="size-4 shrink-0" />
                <span className="hidden lg:inline">{index + 1}. {item.label}{'sublabel' in item && <span className="ml-1 text-slate-500">{item.sublabel}</span>}</span>
                <span className="lg:hidden">{item.short}</span>
                {index === 1 && pendingDocs > 0 && <span className="ml-auto hidden rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[9px] text-amber-300 lg:inline">{pendingDocs}</span>}
                {index === 3 && crewAlerts > 0 && <span className="ml-auto hidden rounded-full bg-rose-400/15 px-1.5 py-0.5 text-[9px] text-rose-300 lg:inline">{crewAlerts}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto hidden p-4 lg:block">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-300"><span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> Lagos coastal network</div>
            <div className="mt-3 space-y-2 text-[9px] text-slate-500">
              <div className="flex justify-between"><span>Lagos Anchorage</span><span className="text-cyan-300">{state.totals.waitingVessels} waiting</span></div>
              <div className="flex justify-between"><span>Apapa · Tin Can</span><span>{terminals[0].vessels + terminals[1].vessels} vessels</span></div>
              <div className="flex justify-between"><span>Lekki Deep Sea Port</span><span>Operational</span></div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between px-1 text-[9px] text-slate-600"><span>PROTOTYPE · JUL 2026 BASELINE</span><button onClick={() => dispatch({ type: 'reset-demo' })} className="hover:text-cyan-300" title="Reset demo state"><RotateCcw className="size-3.5" /></button></div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-800/90 bg-[#0a192f]/95 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 px-4 py-3.5 sm:px-6 xl:px-8">
            <div className="flex items-center gap-2 text-[10px] text-slate-500"><span className="hidden sm:inline">NIGERIA</span><ChevronRight className="hidden size-3 sm:inline" /><span className="text-slate-300">Lagos operations</span><span className="mx-1 hidden h-3 w-px bg-slate-700 sm:block" /><span className="flex items-center gap-1.5"><span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> Demo data live</span></div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 text-[10px] text-slate-500 xl:flex"><span>{state.lastUpdated}</span><span className="rounded border border-slate-700 px-1.5 py-0.5 text-[9px] text-slate-400">WAT</span></div>
              <button onClick={() => setPitchStep(0)} className="flex items-center gap-1.5 rounded-md bg-cyan-400 px-2.5 py-1.5 text-[9px] font-semibold text-[#062033] transition-colors hover:bg-cyan-300 sm:text-[10px]"><Play className="size-3" /><span>Start 36-Hour Voyage Story</span></button>
              <button onClick={() => dispatch({ type: 'toggle-guided-demo' })} aria-pressed={state.guidedDemo} className={`hidden items-center gap-2 rounded-md border px-2.5 py-1.5 text-[9px] font-medium transition-colors sm:flex sm:text-[10px] ${state.guidedDemo ? 'border-cyan-400/35 bg-cyan-400/10 text-cyan-200' : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-cyan-400/30'}`}><Sparkles className="size-3.5" /><span>Guided Pitch Demo</span><span className={`ml-0.5 h-3.5 w-6 rounded-full p-0.5 ${state.guidedDemo ? 'bg-cyan-500' : 'bg-slate-700'}`}><span className={`block size-2.5 rounded-full bg-white transition-transform ${state.guidedDemo ? 'translate-x-2.5' : ''}`} /></span></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 px-4 pb-3 sm:grid-cols-4 sm:px-6 xl:px-8">
            <Kpi label="Waiting at anchorage" value={String(state.totals.waitingVessels)} detail="Lagos approaches" tone="cyan" />
            <Kpi label="Demurrage exposure" value={formatUsd(state.totals.demurrageExposureUsd)} detail="Current estimate" tone="amber" />
            <Kpi label="Average wait" value={`${state.totals.averageWaitHours.toFixed(1)}h`} detail="vs 96h regional avg." tone="slate" />
            <Kpi label="Savings this month" value={formatUsd(state.totals.monthlySavingsUsd)} detail={`${state.totals.carbonAvoidedTonnes.toFixed(1)} tCO₂e avoided`} tone="emerald" />
          </div>
        </header>

        <div className="flex min-h-[calc(100svh-132px)] flex-col">
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 xl:px-8">
            <Routes>
              <Route path="/" element={<TrafficView />} />
              <Route path="/traffic" element={<TrafficView />} />
              <Route path="/clearance" element={<ClearanceView />} />
              <Route path="/ledger" element={<LedgerView />} />
              <Route path="/wellbeing" element={<WellbeingView />} />
              <Route path="/nimasa" element={<NimasaView />} />
              <Route path="*" element={<TrafficView />} />
            </Routes>
          </main>
          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 px-4 py-3 text-[9px] text-slate-600 sm:px-6 xl:px-8"><span>OMNIMARINE · MARITIME INTELLIGENCE PROTOTYPE</span><span>Simulated operational data · Nigeria coastal domain</span></footer>
        </div>
      </div>

      {state.guidedDemo && <div className="fixed bottom-4 right-4 z-30 flex max-w-sm items-start gap-3 rounded-lg border border-cyan-400/30 bg-[#10243e] p-4 shadow-2xl shadow-black/30"><Sparkles className="mt-0.5 size-4 shrink-0 text-cyan-300" /><div><p className="text-xs font-semibold text-white">Guided pitch demo is on</p><p className="mt-1 text-[10px] leading-4 text-slate-400">Explore the five views. Apply a JIT plan or clear a document to see shared KPIs and the economic ledger update.</p><Link to="/traffic" className="mt-2 inline-flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-200">Start with live traffic <ArrowDownRight className="size-3" /></Link></div><button onClick={() => dispatch({ type: 'toggle-guided-demo' })} className="text-slate-500 hover:text-slate-200" aria-label="Dismiss demo guide">×</button></div>}
      {pitchStep !== null && <PitchWalkthrough stepIndex={pitchStep} onStep={setPitchStep} onClose={() => setPitchStep(null)} />}
    </div>
  )
}

function Kpi({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: 'cyan' | 'amber' | 'slate' | 'emerald' }) {
  const colors = { cyan: 'text-cyan-300', amber: 'text-amber-300', slate: 'text-slate-100', emerald: 'text-emerald-300' }
  return <div className="min-w-0 rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2"><p className="truncate text-[8px] font-medium uppercase tracking-[0.1em] text-slate-500 sm:text-[9px]">{label}</p><div className="mt-1 flex items-baseline justify-between gap-1"><p className={`truncate text-sm font-semibold tabular-nums sm:text-base ${colors[tone]}`}>{value}</p><p className="hidden truncate text-[8px] text-slate-600 xl:block">{detail}</p></div></div>
}

function App() {
  return <AppShell />
}

export default App
