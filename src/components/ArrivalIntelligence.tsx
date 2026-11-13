import { useState } from 'react'
import { Activity, Anchor, ArrowRight, CheckCircle2, Clock3, Fuel, MapPin, Navigation, Radar, Ship, Siren, X } from 'lucide-react'
import { PageHeading, Panel, PanelTitle, RiskBadge, StatusBadge } from '@/components/DashboardPrimitives'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { anchorageClusters, calculateVoyageImpact, initialMaritimeState, jitRecommendation } from '@/data/mockMaritimeData'
import type { Vessel } from '@/data/mockMaritimeData'
import { formatUsd } from '@/lib/format'

function ArrivalIntelligence() {
  const { state, dispatch } = useMaritimeData()
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null)
  const [animation, setAnimation] = useState<{ vesselId: string; origin: { x: number; y: number } } | null>(null)
  const heroVessel = state.vessels.find((vessel) => vessel.id === jitRecommendation.heroVesselId)
    ?? state.vessels[0]
    ?? initialMaritimeState.vessels[0]
  const selectedVessel = state.vessels.find((vessel) => vessel.id === selectedVesselId) ?? null
  const conflictResolved = heroVessel.jitApplied
  const impactTemplate = state.voyageImpacts.find((impact) => impact.id === 'impact-v-001-jit')
  const jitProjection = impactTemplate ? calculateVoyageImpact({ ...impactTemplate, actualWaitHours: 0, speedOptimizationHours: jitRecommendation.currentEtaHours }, state.calculationAssumptions) : null

  function applyRecommendation() {
    if (heroVessel.jitApplied) return
    setAnimation({ vesselId: heroVessel.id, origin: heroVessel.mapPosition })
    dispatch({ type: 'apply-jit-plan', vesselId: heroVessel.id })
    window.setTimeout(() => setAnimation(null), 2100)
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading
        eyebrow="Operations / 01 · Arrival intelligence"
        title="Live Traffic & JIT Arrival"
        description="36-hour Lagos approach corridor · Match vessel speed to berth availability across Apapa, Tin Can Island, and Lekki."
        action={<StatusBadge tone="emerald"><span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-emerald-400" /> AIS FEED SIMULATED</StatusBadge>}
      />

      <div className="grid gap-4 2xl:grid-cols-[1.45fr_0.75fr]">
        <div className="min-w-0 space-y-4">
          <Panel className="overflow-hidden" data-pitch-target="arrival">
            <PanelTitle title="Bight of Benin · Lagos approach corridor" detail="Interactive radar plot · Select a vessel marker to inspect telemetry" action={<span className="flex items-center gap-1.5 text-[9px] text-slate-500"><Radar className="size-3.5 text-cyan-400" /> 06 VESSELS TRACKED</span>} />
            <div className="relative overflow-hidden bg-[#071728]">
              <svg className="block h-auto min-h-[280px] w-full" viewBox="0 0 760 420" role="img" aria-label="Stylized radar map of the Bight of Benin and Lagos coastline">
                <defs>
                  <pattern id="radar-grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M 38 0 L 0 0 0 38" fill="none" stroke="#16415b" strokeOpacity=".4" strokeWidth=".7" /></pattern>
                  <radialGradient id="sea-glow"><stop offset="0%" stopColor="#0e4260" stopOpacity=".36" /><stop offset="100%" stopColor="#0a192f" stopOpacity="0" /></radialGradient>
                  <filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <rect width="760" height="420" fill="#081a2b" />
                <rect width="760" height="420" fill="url(#radar-grid)" />
                <ellipse cx="430" cy="246" rx="330" ry="250" fill="url(#sea-glow)" />
                <path d="M0 0H620 C608 26 633 43 614 65 C598 83 629 103 608 125 C590 144 620 166 601 186 C581 207 608 226 588 246 C567 267 597 286 579 309 C560 331 581 350 559 372 C544 389 554 405 540 420H0Z" fill="#10263a" stroke="#25617a" strokeWidth="1.5" />
                <path d="M0 0H620 C608 26 633 43 614 65 C598 83 629 103 608 125 C590 144 620 166 601 186 C581 207 608 226 588 246 C567 267 597 286 579 309 C560 331 581 350 559 372 C544 389 554 405 540 420" fill="none" stroke="#4cc9d5" strokeOpacity=".52" strokeWidth="2" />
                <path d="M605 120 Q655 135 690 116 M592 226 Q638 239 676 221 M578 296 Q626 306 660 290" fill="none" stroke="#38bdf8" strokeOpacity=".25" strokeDasharray="4 5" />
                <text x="654" y="38" fill="#56778b" fontSize="9" letterSpacing="1.5">NIGERIA COAST</text>
                <text x="654" y="51" fill="#456275" fontSize="7">LAGOS STATE</text>
                <text x="264" y="384" fill="#4c7187" fontSize="10" letterSpacing="2">BIGHT OF BENIN</text>
                <text x="280" y="399" fill="#35566c" fontSize="7">GULF OF GUINEA</text>
                <text x="33" y="30" fill="#466478" fontSize="8">06°30'N</text>
                <text x="33" y="402" fill="#466478" fontSize="8">05°30'N</text>
                <text x="110" y="53" fill="#36566c" fontSize="7">Lomé</text>
                <text x="222" y="53" fill="#36566c" fontSize="7">Cotonou</text>
                <text x="560" y="53" fill="#36566c" fontSize="7">Lagos</text>

                {anchorageClusters.map((cluster) => <g key={cluster.id}>
                  <circle cx={cluster.x} cy={cluster.y} r={cluster.radius} fill={cluster.congestion === 'High' ? '#f59e0b' : '#22d3ee'} fillOpacity=".045" stroke={cluster.congestion === 'High' ? '#f59e0b' : '#22d3ee'} strokeOpacity=".26" strokeDasharray="3 5" />
                  <circle cx={cluster.x} cy={cluster.y} r="3" fill={cluster.congestion === 'High' ? '#fbbf24' : '#67e8f9'} fillOpacity=".7" />
                  <text x={cluster.x + 9} y={cluster.y - 8} fill="#91a9b8" fontSize="7">{cluster.label.toUpperCase()}</text>
                  <text x={cluster.x + 9} y={cluster.y + 3} fill={cluster.congestion === 'High' ? '#fbbf24' : '#67e8f9'} fontSize="7">{cluster.waiting} VESSELS · {cluster.congestion.toUpperCase()}</text>
                </g>)}

                <path d={jitRecommendation.routePath} fill="none" stroke="#22d3ee" strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="5 6" />
                <path d={jitRecommendation.routePath} fill="none" stroke={conflictResolved ? '#34d399' : '#f59e0b'} strokeOpacity={conflictResolved ? '.75' : '.4'} strokeWidth="2" strokeDasharray={conflictResolved ? '7 4' : '2 8'}>
                  {conflictResolved && animation?.vesselId === heroVessel.id && <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1.8s" fill="freeze" />}
                </path>

                {state.berths.map((berth) => <BerthMarker key={berth.id} x={berth.mapPosition.x} y={berth.mapPosition.y} label={berth.mapLabel} status={berth.status} />)}

                {state.vessels.map((vessel) => {
                  const point = vessel.mapPosition
                  const animate = animation?.vesselId === vessel.id
                  const isHero = vessel.id === jitRecommendation.heroVesselId
                  return <g key={vessel.id} role="button" tabIndex={0} aria-label={`Open ${vessel.name} telemetry`} aria-pressed={selectedVesselId === vessel.id} onClick={() => setSelectedVesselId(vessel.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedVesselId(vessel.id) } }} className="cursor-pointer outline-none">
                    {animate && <g transform={`translate(${animation.origin.x} ${animation.origin.y})`}>
                      <animateMotion path={jitRecommendation.motionPath} dur="1.8s" fill="freeze" />
                      <VesselGlyph vessel={vessel} selected={selectedVesselId === vessel.id} hero={isHero} />
                    </g>}
                    {!animate && <g transform={`translate(${point.x} ${point.y})`}><VesselGlyph vessel={vessel} selected={selectedVesselId === vessel.id} hero={isHero} /></g>}
                  </g>
                })}

                <g transform="translate(46 80)" fill="none" stroke="#45677b" strokeWidth="1"><circle r="20" strokeOpacity=".4" /><circle r="40" strokeOpacity=".25" /><circle r="60" strokeOpacity=".15" /><path d="M-70 0H70M0-70V70" strokeOpacity=".2" /></g>
                <text x="40" y="155" fill="#426378" fontSize="7">RADAR RANGE</text>
              </svg>
              <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded border border-slate-700/70 bg-[#071323]/90 px-2.5 py-2 text-[8px] text-slate-400">
                <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-cyan-300" />Underway</span>
                <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-amber-300" />Anchorage cluster</span>
                <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-sm bg-emerald-300" />JIT synchronized</span>
              </div>
              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded border border-slate-700/70 bg-[#071323]/90 px-2 py-1.5 text-[8px] text-slate-400"><Navigation className="size-3 text-cyan-300" /> AIS / RADAR OVERLAY</div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-800 border-t border-slate-800 bg-slate-950/30">
              <TimelinePoint label="Now" detail="36h offshore" active={!conflictResolved} />
              <TimelinePoint label={conflictResolved ? 'JIT arrival' : 'Current-speed ETA'} detail={conflictResolved ? '42h · berth matched' : '36h · 14.2 kn'} active={conflictResolved} />
              <TimelinePoint label="Apapa Berth 04" detail={conflictResolved ? 'Ready on arrival' : 'Clears in 42h'} active={conflictResolved} />
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelTitle title="Lagos berth status" detail="Apapa · Tin Can Island · Lekki" action={<span className="text-[9px] text-slate-500">{state.berths.length} BERTHS MONITORED</span>} />
            <div className="grid divide-y divide-slate-800/80 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-3">
              {state.berths.map((berth) => <div key={berth.id} className="flex items-center gap-2.5 px-3.5 py-3">
                <span className={`size-2 shrink-0 rounded-full ${berth.status === 'Available' ? 'bg-emerald-400' : berth.status === 'Clearing Soon' ? 'bg-amber-400' : berth.status === 'JIT aligned' ? 'bg-cyan-300' : 'bg-rose-400'}`} />
                <div className="min-w-0 flex-1"><p className="truncate text-[9px] font-medium text-slate-300">{berth.berth}</p><p className="mt-0.5 truncate text-[8px] text-slate-500">{berth.vessel ?? berth.terminal}</p></div>
                <StatusBadge tone={berth.status === 'Available' ? 'emerald' : berth.status === 'Clearing Soon' ? 'amber' : berth.status === 'JIT aligned' ? 'cyan' : 'slate'}>{berth.status}</StatusBadge>
              </div>)}
            </div>
          </Panel>
        </div>

        <div className="min-w-0 space-y-4">
          <Panel data-pitch-target="jit" className={conflictResolved ? 'border-emerald-400/25' : 'border-amber-400/25'}>
            <PanelTitle title="AI speed & berth sync" detail="Just-in-time optimizer · MV Atlantic Star" action={<StatusBadge tone={conflictResolved ? 'emerald' : 'amber'}>{conflictResolved ? 'SYNCHRONIZED' : 'CONFLICT DETECTED'}</StatusBadge>} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-sm font-semibold text-white">MV Atlantic Star</p><p className="mt-1 text-[9px] text-slate-500">IMO 9384216 · Bulk carrier · 52,000 MT wheat</p><p className="mt-1 text-[9px] text-slate-500">{heroVessel.flag} · Destination: APM Terminals Apapa</p></div>
                <span className="rounded-md border border-slate-700 bg-slate-800/70 px-2 py-1 text-[9px] text-slate-300">36h OUT</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <SpeedCard label={conflictResolved ? 'Optimized speed' : 'Current speed'} value={`${conflictResolved ? jitRecommendation.recommendedSpeedKnots : jitRecommendation.currentSpeedKnots} kn`} tone={conflictResolved ? 'emerald' : 'slate'} />
                <SpeedCard label="Current ETA" value={conflictResolved ? '42h · aligned' : '36h · Lagos'} tone={conflictResolved ? 'emerald' : 'cyan'} />
              </div>

              {!conflictResolved ? <div className="mt-4 flex gap-2.5 rounded-md border border-amber-400/20 bg-amber-400/[0.06] p-3">
                <Siren className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <div><p className="text-[10px] font-semibold text-amber-200">Berth conflict · 6h projected anchorage wait</p><p className="mt-1 text-[9px] leading-4 text-slate-400">Apapa Berth 04 clears in <strong className="font-semibold text-slate-200">42 hours</strong>. Current-speed arrival at 36h would put MV Atlantic Star in an anchorage queue.</p></div>
              </div> : <div className="mt-4 flex gap-2.5 rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] p-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                <div><p className="text-[10px] font-semibold text-emerald-200">Conflict resolved · berth and arrival synchronized</p><p className="mt-1 text-[9px] leading-4 text-slate-400">Arrival now matches Apapa Berth 04 opening at 42h. Anchorage wait removed from the plan.</p></div>
              </div>}

              <div className="mt-4 rounded-md border border-slate-700/80 bg-slate-950/40 p-3">
                <div className="flex items-center justify-between gap-3"><div><p className="text-[9px] font-medium text-slate-300">AI recommended speed</p><p className="mt-1 text-[8px] text-slate-500">Arrive as Apapa Berth 04 becomes available</p></div><p className="whitespace-nowrap text-lg font-semibold tabular-nums text-cyan-300">11.4 <span className="text-[10px] font-medium text-slate-500">knots</span></p></div>
                <div className="relative mt-3 h-1.5 rounded-full bg-slate-800"><div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${conflictResolved ? 'w-[61%] bg-emerald-400' : 'w-[76%] bg-cyan-400'}`} /><span className={`absolute -top-1 size-3 rounded-full border-2 border-slate-950 transition-all duration-700 ${conflictResolved ? 'left-[59%] bg-emerald-300' : 'left-[74%] bg-cyan-300'}`} /></div>
                <div className="mt-1.5 flex justify-between text-[8px] text-slate-600"><span>8 kn · economy</span><span>14.2 kn · current</span></div>
              </div>

              <button disabled={conflictResolved} onClick={applyRecommendation} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 text-[10px] font-semibold transition-all ${conflictResolved ? 'cursor-default border border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'bg-cyan-400 text-[#062033] shadow-lg shadow-cyan-950/30 hover:bg-cyan-300 active:scale-[.99]'}`}>
                {conflictResolved ? <><CheckCircle2 className="size-3.5" /> AI JIT speed recommendation applied</> : <><Activity className="size-3.5" /> Apply AI JIT Speed Recommendation (11.4 knots) <ArrowRight className="size-3.5" /></>}
              </button>
              <p className="mt-2 text-center text-[8px] leading-4 text-slate-600">{conflictResolved ? 'Savings recorded in the shared economic and carbon ledger.' : 'Demo simulation · Applies speed, berth window, and estimated savings to shared platform data.'}</p>
            </div>
          </Panel>

          <Panel>
            <PanelTitle title="JIT impact estimate" detail={conflictResolved ? 'Real-time savings posted to global state' : 'Projected if recommendation is applied'} action={<StatusBadge tone="emerald">ESTIMATED</StatusBadge>} />
            <div className="grid grid-cols-2 gap-px bg-slate-800/80">
              <ImpactMetric icon={Clock3} label="Anchorage wait saved" value={`${conflictResolved ? heroVessel.waitHoursSaved : jitProjection?.hoursSaved ?? 0} h`} tone="cyan" />
              <ImpactMetric icon={Fuel} label="Fuel saved" value={`${conflictResolved ? heroVessel.fuelSavedTonnes : jitProjection?.fuelSavedTonnes ?? 0} MT`} tone="emerald" />
              <ImpactMetric icon={Activity} label="CO₂ avoided" value={`${conflictResolved ? heroVessel.carbonSavedTonnes : jitProjection?.co2AvoidedTonnes ?? 0} t`} tone="emerald" />
              <ImpactMetric icon={Anchor} label="Demurrage saved" value={formatUsd(conflictResolved ? heroVessel.demurrageSavedUsd : jitProjection?.demurrageAvoidedUsd ?? 0)} tone="emerald" />
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 px-4 py-2.5 text-[9px]"><span className="text-slate-500">Fleet JIT savings this month</span><span className="font-semibold tabular-nums text-emerald-300">{formatUsd(state.totals.monthlySavingsUsd)} <span className="font-normal text-slate-600">· {state.totals.jitWaitHoursSaved}h saved · {state.totals.fuelSavedTonnes.toFixed(1)} MT fuel</span></span></div>
          </Panel>

          <Panel>
            <PanelTitle title="Arrival window" detail="Atlantic Star · Bight of Benin to Lagos Anchorage" />
            <div className="px-4 py-4">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-3 right-3 top-2 h-px bg-slate-700" /><div className={`absolute left-3 top-2 h-px transition-all duration-1000 ${conflictResolved ? 'w-[calc(100%-24px)] bg-emerald-400' : 'w-[48%] bg-cyan-400'}`} />
                <WindowPoint label="Now" detail="36h out" complete /><WindowPoint label="Arrival" detail={conflictResolved ? '42h · synced' : '36h · current'} complete={conflictResolved} /><WindowPoint label="Berth open" detail="42h" complete={conflictResolved} />
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3 text-[8px] text-slate-500"><MapPin className="size-3 text-cyan-400" /> Gulf of Guinea <ArrowRight className="size-3" /> Lagos Anchorage <ArrowRight className="size-3" /> APM Apapa Berth 04</div>
            </div>
          </Panel>
        </div>
      </div>

      {selectedVessel && <TelemetryDrawer vessel={selectedVessel} onClose={() => setSelectedVesselId(null)} />}
    </div>
  )
}

function VesselGlyph({ vessel, selected, hero }: { vessel: Vessel; selected: boolean; hero: boolean }) {
  const tone = vessel.jitApplied ? '#34d399' : hero ? '#fbbf24' : '#67e8f9'
  return <g filter={hero || selected ? 'url(#soft-glow)' : undefined}>
    {(hero || selected) && <circle r="15" fill={tone} fillOpacity=".12"><animate attributeName="r" values="10;18;10" dur="2.8s" repeatCount="indefinite" /></circle>}
    <path d="M0 -8 L6 4 L0 2 L-6 4Z" fill={tone} stroke="#dffaff" strokeOpacity=".65" strokeWidth=".8" />
    <circle cy="-1" r="2" fill="#e0f2fe" />
    <text x="10" y="-7" fill={selected ? '#ffffff' : tone} fontSize={hero ? '8' : '7'} fontWeight={hero ? '700' : '500'}>{vessel.name.replace('MV ', '')}</text>
    {hero && <text x="10" y="3" fill="#829dad" fontSize="6">{vessel.jitApplied ? 'JIT SYNC' : '36H TO LAGOS'}</text>}
  </g>
}

function BerthMarker({ x, y, label, status }: { x: number; y: number; label: string; status: string }) {
  const color = status === 'Available' ? '#34d399' : status === 'JIT aligned' ? '#22d3ee' : status === 'Clearing Soon' ? '#fbbf24' : '#fb7185'
  return <g transform={`translate(${x} ${y})`}><rect x="-3" y="-3" width="6" height="6" rx="1" fill={color} stroke="#081a2b" strokeWidth="1" /><text x="7" y="2" fill={color} fontSize="6.5">{label}</text></g>
}

function TimelinePoint({ label, detail, active }: { label: string; detail: string; active: boolean }) {
  return <div className="px-3 py-2.5"><div className="flex items-center gap-1.5"><span className={`size-1.5 rounded-full ${active ? 'bg-cyan-300 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-600'}`} /><p className={`text-[8px] font-medium ${active ? 'text-cyan-200' : 'text-slate-400'}`}>{label}</p></div><p className="mt-1.5 pl-3 text-[8px] text-slate-600">{detail}</p></div>
}

function SpeedCard({ label, value, tone }: { label: string; value: string; tone: 'cyan' | 'emerald' | 'slate' }) {
  const color = tone === 'cyan' ? 'text-cyan-300' : tone === 'emerald' ? 'text-emerald-300' : 'text-slate-100'
  return <div className="rounded-md border border-slate-700/80 bg-slate-950/40 p-2.5"><p className="text-[8px] uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-1.5 text-sm font-semibold tabular-nums ${color}`}>{value}</p></div>
}

function ImpactMetric({ icon: Icon, label, value, tone }: { icon: typeof Clock3; label: string; value: string; tone: 'cyan' | 'emerald' }) {
  const color = tone === 'cyan' ? 'text-cyan-300' : 'text-emerald-300'
  return <div className="flex items-center gap-2.5 bg-slate-900/70 p-3"><span className={`flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-800 ${color}`}><Icon className="size-3.5" /></span><div className="min-w-0"><p className="truncate text-[8px] text-slate-500">{label}</p><p className={`mt-1 text-[11px] font-semibold tabular-nums ${color}`}>{value}</p></div></div>
}

function WindowPoint({ label, detail, complete }: { label: string; detail: string; complete: boolean }) {
  return <div className="relative z-10 flex flex-col items-center"><span className={`flex size-4 items-center justify-center rounded-full border-2 border-[#0a192f] ${complete ? 'bg-emerald-400' : 'bg-slate-600'}`}>{complete && <span className="size-1 rounded-full bg-[#0a192f]" />}</span><p className="mt-2 text-[8px] font-medium text-slate-300">{label}</p><p className="mt-0.5 text-[7px] text-slate-600">{detail}</p></div>
}

function TelemetryDrawer({ vessel, onClose }: { vessel: Vessel; onClose: () => void }) {
  return <>
    <button onClick={onClose} aria-label="Close vessel telemetry" className="fixed inset-0 z-40 cursor-default bg-black/45 backdrop-blur-[1px]" />
    <aside role="dialog" aria-modal="true" aria-labelledby="telemetry-title" className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-slate-700 bg-[#09182a] shadow-2xl shadow-black/50">
      <div className="flex items-start justify-between border-b border-slate-800 px-5 py-4"><div><p className="text-[9px] uppercase tracking-[0.16em] text-cyan-400">Vessel telemetry</p><h2 id="telemetry-title" className="mt-1 text-base font-semibold text-white">{vessel.name}</h2><p className="mt-1 text-[9px] text-slate-500">{vessel.imo} · {vessel.flag}</p></div><button onClick={onClose} aria-label="Close drawer" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white"><X className="size-4" /></button></div>
      <div className="space-y-4 p-5">
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[10px] text-slate-400"><Ship className="size-3.5 text-cyan-300" /> {vessel.type}</span><RiskBadge risk={vessel.risk} /></div><p className="mt-4 text-[9px] text-slate-500">Current position</p><p className="mt-1 text-xs font-medium text-slate-200">{vessel.location}</p><p className="mt-3 text-[9px] text-slate-500">Destination</p><p className="mt-1 text-xs text-slate-300">{vessel.terminal}</p></div>
        <div className="grid grid-cols-2 gap-2"><TelemetryCell label="Speed over ground" value={vessel.speedKnots ? `${vessel.speedKnots.toFixed(1)} kn` : 'At anchor'} /><TelemetryCell label="ETA / window" value={vessel.etaHours ? `${vessel.etaHours} hours` : vessel.eta} /><TelemetryCell label="Cargo manifest" value={vessel.cargo} /><TelemetryCell label="Anchorage wait" value={vessel.waitHoursSaved ? `${vessel.waitHoursSaved}h avoided` : `${vessel.waitHours.toFixed(1)}h`} /></div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4"><p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Arrival plan</p><div className="mt-3 flex items-center justify-between text-[9px]"><span className="text-slate-500">Status</span><StatusBadge tone={vessel.jitApplied ? 'emerald' : 'cyan'}>{vessel.status}</StatusBadge></div>{vessel.jitApplied && <div className="mt-3 space-y-2 border-t border-slate-800 pt-3"><TelemetryCell label="Fuel saved" value={`${vessel.fuelSavedTonnes.toFixed(1)} MT`} /><TelemetryCell label="CO₂ avoided" value={`${vessel.carbonSavedTonnes.toFixed(1)} tCO₂e`} /><TelemetryCell label="Demurrage avoided" value={formatUsd(vessel.demurrageSavedUsd)} /></div>}</div>
        <div className="flex items-center gap-2 text-[8px] text-slate-600"><Clock3 className="size-3" /> AIS position updated just now · simulated feed</div>
      </div>
    </aside>
  </>
}

function TelemetryCell({ label, value }: { label: string; value: string }) {
  return <div className="flex min-w-0 flex-col gap-1"><span className="text-[8px] text-slate-500">{label}</span><span className="truncate text-[10px] font-medium text-slate-200">{value}</span></div>
}

export default ArrivalIntelligence
