import { useState } from 'react'
import { BarChart3, Clock3, Fuel, Leaf, Search, Ship, SlidersHorizontal } from 'lucide-react'
import { PageHeading, Panel, PanelTitle, StatusBadge } from '@/components/DashboardPrimitives'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { calculateImpactTotals, julyLagosBaseline, type CalculatedVoyageImpact } from '@/data/mockMaritimeData'
import { formatUsd } from '@/lib/format'

type ImpactFilter = 'All voyages' | 'JIT arrival' | 'Pre-arrival clearance'

function ImpactLedger() {
  const { state, dispatch } = useMaritimeData()
  const [filter, setFilter] = useState<ImpactFilter>('All voyages')
  const [search, setSearch] = useState('')
  const calculation = calculateImpactTotals(state.voyageImpacts, state.calculationAssumptions)
  const rows = calculation.rows
  const projectedVessels = calculation.totals.waitingVessels
  const activeHours = calculation.hoursSaved
  const fuelCostAvoided = rows.reduce((total, row) => total + row.fuelSavedTonnes * state.calculationAssumptions.fuelPriceUsdPerTonne, 0)
  const filteredRows = rows.filter((row) => {
    const filterMatch = filter === 'All voyages' || row.source === filter
    const searchMatch = `${row.vesselName} ${row.terminal} ${row.source}`.toLowerCase().includes(search.toLowerCase())
    return filterMatch && searchMatch
  })

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading eyebrow="Impact / 03 · Voyage economics" title="Economic & Carbon Ledger" description="Compare each voyage with its July 2026 baseline. Operational actions, fuel assumptions, and emission factors are visible and adjustable—no external data calls." action={<StatusBadge tone="cyan"><BarChart3 className="mr-1 size-3" /> LIVE CALCULATION</StatusBadge>} />

      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        <Metric icon={Clock3} label="Hours saved" value={`${activeHours.toFixed(1)} h`} detail="Across modeled voyages" tone="cyan" />
        <Metric icon={Ship} label="Demurrage avoided" value={formatUsd(calculation.demurrageAvoidedUsd)} detail="Rate × saved hours ÷ 24" tone="amber" />
        <Metric icon={Fuel} label="Fuel saved" value={`${calculation.fuelSavedTonnes.toFixed(1)} MT`} detail={`${formatUsd(fuelCostAvoided)} at assumed fuel price`} tone="emerald" />
        <Metric icon={Leaf} label="Emissions prevented" value={`${calculation.carbonAvoidedTonnes.toFixed(1)} t`} detail={`NOₓ ${sum(rows, 'noxAvoidedTonnes').toFixed(2)} t · SOₓ ${sum(rows, 'soxAvoidedTonnes').toFixed(2)} t`} tone="emerald" />
      </div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-[1.15fr_0.85fr]">
        <Panel>
          <PanelTitle title="July 2026 baseline vs. OmniMarine projection" detail="Lagos anchorage · 39-ship baseline cohort" action={<StatusBadge tone="slate">PORT-WIDE VIEW</StatusBadge>} />
          <div className="grid gap-3 p-3 sm:grid-cols-3 sm:p-4">
            <ComparisonCard title="Ships waiting" baseline={julyLagosBaseline.waitingVessels} current={projectedVessels} max={45} format={(value) => `${value} ships`} saved={julyLagosBaseline.waitingVessels - projectedVessels} />
            <ComparisonCard title="Average wait" baseline={julyLagosBaseline.averageWaitHours} current={calculation.totals.averageWaitHours} max={90} format={(value) => `${value.toFixed(1)} h`} saved={julyLagosBaseline.averageWaitHours - calculation.totals.averageWaitHours} />
            <ComparisonCard title="Demurrage exposure" baseline={julyLagosBaseline.demurrageExposureUsd} current={calculation.totals.demurrageExposureUsd} max={3_500_000} format={formatUsd} saved={julyLagosBaseline.demurrageExposureUsd - calculation.totals.demurrageExposureUsd} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 px-4 py-3 text-[8px] text-slate-500"><span>Baseline: 39 ships · 74.5h average wait · $3.38M exposure</span><span className="text-cyan-300">Current projected: {projectedVessels} ships · {calculation.totals.averageWaitHours.toFixed(1)}h · {formatUsd(calculation.totals.demurrageExposureUsd)}</span></div>
        </Panel>

        <Panel>
          <PanelTitle title="Calculation Methodology & Assumptions" detail="Adjust the daily demurrage rate to recalculate voyage totals" action={<SlidersHorizontal className="size-3.5 text-cyan-300" />} />
          <div className="space-y-4 p-4">
            <div className="rounded-md border border-cyan-400/15 bg-cyan-400/[0.035] p-3">
              <div className="flex items-center justify-between gap-3"><label htmlFor="demurrage-rate" className="text-[9px] font-medium text-slate-300">Effective daily demurrage rate</label><span className="text-sm font-semibold tabular-nums text-cyan-200">{formatUsd(state.calculationAssumptions.demurrageRateUsdPerDay)}<span className="ml-1 text-[8px] font-normal text-slate-500">/ day</span></span></div>
              <input id="demurrage-rate" aria-label="Daily demurrage rate in US dollars" type="range" min="15000" max="100000" step="2500" value={state.calculationAssumptions.demurrageRateUsdPerDay} onChange={(event) => dispatch({ type: 'set-demurrage-rate', value: Number(event.currentTarget.value) })} className="mt-3 h-1.5 w-full cursor-pointer accent-cyan-400" />
              <div className="mt-1 flex justify-between text-[7px] text-slate-600"><span>$15K/day</span><span>$100K/day</span></div>
              <p className="mt-2 text-[8px] text-slate-500">Demurrage avoided = wait hours saved × daily rate ÷ 24.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <AssumptionGroup title="Fuel model" rows={[
                ['Main engine reference burn', `${state.calculationAssumptions.mainEngineFuelBurnTonnesPerDay} MT/day`],
                ['JIT speed fuel reduction', `${state.calculationAssumptions.speedFuelSavingBenchmarkPercent}% benchmark`],
                ['Auxiliary engine at anchor', `${state.calculationAssumptions.auxiliaryFuelBurnTonnesPerDay} MT/day`],
                ['Fuel price reference', `${formatUsd(state.calculationAssumptions.fuelPriceUsdPerTonne)} / MT`],
              ]} />
              <AssumptionGroup title="Emission factors" rows={[
                ['CO₂', `${state.calculationAssumptions.co2TonnesPerFuelTonne} t / MT fuel`],
                ['NOₓ', `${state.calculationAssumptions.noxTonnesPerFuelTonne} t / MT fuel`],
                ['SOₓ', `${state.calculationAssumptions.soxTonnesPerFuelTonne} t / MT fuel`],
                ['Charter reference', `${formatUsd(state.calculationAssumptions.dailyCharterRateUsd)} / day`],
              ]} />
            </div>
            <p className="border-t border-slate-800 pt-3 text-[8px] leading-4 text-slate-600">Fuel saved = speed-optimized sea hours × main-engine burn × benchmark + avoided-wait hours × auxiliary burn. Emissions use fuel saved × the displayed factor. Illustrative planning assumptions; voyage-specific rates may vary.</p>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4 overflow-hidden" data-pitch-target="ledger">
        <PanelTitle title="Voyage impact ledger" detail="Actuals recalculate when operating assumptions change" action={<div className="flex items-center gap-2"><span className="hidden text-[8px] text-slate-500 sm:inline">{filteredRows.length} OF {rows.length} VOYAGES</span><span className="rounded border border-slate-700 bg-slate-950/50 px-2 py-1 text-[8px] text-slate-400">USD · MT · t</span></div>} />
        <div className="flex flex-col gap-2 border-b border-slate-800 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex flex-wrap gap-1.5">{(['All voyages', 'JIT arrival', 'Pre-arrival clearance'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded px-2.5 py-1.5 text-[8px] font-medium transition-colors ${filter === item ? 'bg-cyan-400/10 text-cyan-200 ring-1 ring-inset ring-cyan-400/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>{item}</button>)}</div>
          <label className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950/40 px-2.5 py-1.5"><Search className="size-3 text-slate-500" /><input value={search} onChange={(event) => setSearch(event.currentTarget.value)} placeholder="Filter voyage or terminal" className="w-44 bg-transparent text-[9px] text-slate-200 outline-none placeholder:text-slate-600" /></label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1140px] text-left">
            <thead><tr className="border-b border-slate-800 bg-slate-950/30 text-[8px] uppercase tracking-[0.1em] text-slate-600"><th className="px-4 py-2.5 font-medium">Voyage</th><th className="px-3 py-2.5 font-medium">Intervention</th><th className="px-3 py-2.5 font-medium">Baseline → actual wait</th><th className="px-3 py-2.5 text-right font-medium">Hours saved</th><th className="px-3 py-2.5 text-right font-medium">Demurrage avoided</th><th className="px-3 py-2.5 text-right font-medium">Fuel saved</th><th className="px-3 py-2.5 text-right font-medium">CO₂ prevented</th><th className="px-3 py-2.5 text-right font-medium">NOₓ prevented</th><th className="px-4 py-2.5 text-right font-medium">SOₓ prevented</th></tr></thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredRows.map((row) => <ImpactRow key={row.id} row={row} />)}
              {filteredRows.length === 0 && <tr><td colSpan={9} className="px-4 py-12 text-center text-[10px] text-slate-500">No voyages match this filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/20 px-4 py-2.5 text-[8px] text-slate-600"><span>Port storage avoided is tracked separately from demurrage.</span><span>Each saved hour is calculated from baseline wait minus OmniMarine actual wait.</span></div>
      </Panel>
    </div>
  )
}

function Metric({ icon: Icon, label, value, detail, tone }: { icon: typeof Clock3; label: string; value: string; detail: string; tone: 'cyan' | 'amber' | 'emerald' }) {
  const color = tone === 'cyan' ? 'text-cyan-300 bg-cyan-400/10' : tone === 'amber' ? 'text-amber-300 bg-amber-400/10' : 'text-emerald-300 bg-emerald-400/10'
  return <div className="rounded-lg border border-slate-700/80 bg-slate-900/65 p-3.5"><div className="flex items-center gap-2"><span className={`flex size-7 items-center justify-center rounded-md ${color}`}><Icon className="size-3.5" /></span><p className="truncate text-[8px] uppercase tracking-wide text-slate-500">{label}</p></div><p className="mt-3 text-lg font-semibold tabular-nums text-slate-100">{value}</p><p className="mt-1 truncate text-[8px] text-slate-600">{detail}</p></div>
}

function ComparisonCard({ title, baseline, current, max, format, saved }: { title: string; baseline: number; current: number; max: number; format: (value: number) => string; saved: number }) {
  const baselineWidth = Math.min(100, (baseline / max) * 100)
  const currentWidth = Math.min(100, (current / max) * 100)
  return <div className="rounded-md border border-slate-700/70 bg-slate-950/35 p-3">
    <p className="text-[9px] font-medium text-slate-300">{title}</p>
    <div className="mt-3 space-y-2.5">
      <CompareBar label="July baseline" value={format(baseline)} width={baselineWidth} tone="slate" />
      <CompareBar label="OmniMarine active" value={format(current)} width={currentWidth} tone="cyan" />
    </div>
    <p className="mt-3 border-t border-slate-800 pt-2 text-[8px] text-emerald-300">{saved > 0 ? title === 'Ships waiting' ? `${saved} fewer ships projected` : title === 'Average wait' ? `${saved.toFixed(1)}h lower` : `${formatUsd(saved)} lower` : 'No modeled reduction yet'}</p>
  </div>
}

function CompareBar({ label, value, width, tone }: { label: string; value: string; width: number; tone: 'slate' | 'cyan' }) {
  return <div><div className="mb-1 flex justify-between gap-2 text-[7px]"><span className="text-slate-500">{label}</span><span className={tone === 'cyan' ? 'font-medium text-cyan-200' : 'text-slate-300'}>{value}</span></div><div className="h-1.5 rounded-full bg-slate-800"><div className={`h-full rounded-full transition-[width] duration-500 ${tone === 'cyan' ? 'bg-cyan-400' : 'bg-slate-500'}`} style={{ width: `${Math.max(0, width)}%` }} /></div></div>
}

function AssumptionGroup({ title, rows }: { title: string; rows: [string, string][] }) {
  return <div className="rounded-md border border-slate-700/70 bg-slate-950/30 p-3"><p className="mb-2 text-[8px] font-semibold uppercase tracking-wide text-slate-400">{title}</p><div className="space-y-2">{rows.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-2 text-[8px]"><span className="text-slate-600">{label}</span><span className="text-right text-slate-300">{value}</span></div>)}</div></div>
}

function ImpactRow({ row }: { row: CalculatedVoyageImpact }) {
  return <tr className="transition-colors hover:bg-slate-800/25">
    <td className="px-4 py-3"><p className="text-[9px] font-medium text-slate-200">{row.vesselName}</p><p className="mt-1 text-[8px] text-slate-500">{row.terminal}</p>{row.storageFeesAvoidedUsd > 0 && <p className="mt-1 text-[8px] text-emerald-400">+ {formatUsd(row.storageFeesAvoidedUsd)} port storage avoided</p>}</td>
    <td className="px-3 py-3"><StatusBadge tone={row.source === 'JIT arrival' ? 'cyan' : 'emerald'}>{row.source}</StatusBadge></td>
    <td className="whitespace-nowrap px-3 py-3 text-[9px] tabular-nums"><span className="text-slate-400">{row.baselineWaitHours.toFixed(1)}h</span><span className="mx-1.5 text-slate-700">→</span><span className={row.hoursSaved > 0 ? 'text-emerald-300' : 'text-slate-400'}>{row.actualWaitHours.toFixed(1)}h</span></td>
    <td className={`px-3 py-3 text-right text-[10px] font-semibold tabular-nums ${row.hoursSaved > 0 ? 'text-cyan-300' : 'text-slate-500'}`}>{row.hoursSaved.toFixed(1)}h</td>
    <td className={`px-3 py-3 text-right text-[10px] font-semibold tabular-nums ${row.demurrageAvoidedUsd > 0 ? 'text-emerald-300' : 'text-slate-500'}`}>{formatUsd(row.demurrageAvoidedUsd)}</td>
    <td className={`px-3 py-3 text-right text-[9px] tabular-nums ${row.fuelSavedTonnes > 0 ? 'text-emerald-300' : 'text-slate-500'}`}>{row.fuelSavedTonnes.toFixed(1)} MT</td>
    <td className="px-3 py-3 text-right text-[9px] tabular-nums text-slate-300">{row.co2AvoidedTonnes.toFixed(1)} t</td>
    <td className="px-3 py-3 text-right text-[9px] tabular-nums text-slate-400">{row.noxAvoidedTonnes.toFixed(2)} t</td>
    <td className="px-4 py-3 text-right text-[9px] tabular-nums text-slate-400">{row.soxAvoidedTonnes.toFixed(2)} t</td>
  </tr>
}

function sum(rows: CalculatedVoyageImpact[], key: 'noxAvoidedTonnes' | 'soxAvoidedTonnes') {
  return rows.reduce((total, row) => total + row[key], 0)
}

export default ImpactLedger
