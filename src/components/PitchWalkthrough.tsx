import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Play, X } from 'lucide-react'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { jitRecommendation } from '@/data/mockMaritimeData'

const steps = [
  { route: '/traffic', target: 'arrival', title: '36 Hours Out', copy: 'MV Atlantic Star is approaching Lagos while anchorage demand and berth timing are visible in one operational picture.' },
  { route: '/traffic', target: 'jit', title: 'JIT Speed Advice', copy: 'The berth opens in 42 hours. Reduce speed to 11.4 knots and synchronize arrival to remove avoidable anchorage wait.' },
  { route: '/clearance', target: 'hs-code', title: 'Pre-Arrival Docs', copy: 'Resolve the importer’s HS code mismatch while the vessel is still at sea, before it becomes a berth-side delay.' },
  { route: '/ledger', target: 'ledger', title: 'Ledger Impact', copy: 'Trace saved hours through demurrage, fuel, and emissions using visible assumptions and shared voyage events.' },
  { route: '/wellbeing', target: 'wellbeing', title: 'Human Protection', copy: 'A seafarer can privately message a practitioner, queue a compressed message offline, and control identity consent.' },
]

function PitchWalkthrough({ stepIndex, onStep, onClose }: { stepIndex: number; onStep: (step: number) => void; onClose: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch } = useMaritimeData()
  const step = steps[stepIndex]
  const heroVessel = state.vessels.find((vessel) => vessel.id === jitRecommendation.heroVesselId)
  const hsCase = state.clearanceCases.find((item) => item.id === 'case-ng-8841')
  const hsDiscrepancy = hsCase?.discrepancies.find((item) => item.id === 'hs-code')

  useEffect(() => {
    if (location.pathname !== step.route) navigate(step.route)
  }, [location.pathname, navigate, step.route])

  useEffect(() => {
    let timeout = 0
    let attempts = 0
    let target: HTMLElement | null = null
    const focusTarget = () => {
      target = document.querySelector<HTMLElement>(`[data-pitch-target="${step.target}"]`)
      if (!target && attempts < 12) {
        attempts += 1
        timeout = window.setTimeout(focusTarget, 60)
        return
      }
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target.style.position = target.style.position || 'relative'
      target.style.zIndex = '21'
      target.style.boxShadow = '0 0 0 2px rgba(34,211,238,.9), 0 0 28px rgba(34,211,238,.18)'
      target.style.transition = 'box-shadow 220ms ease'
    }
    timeout = window.setTimeout(focusTarget, 80)
    return () => {
      window.clearTimeout(timeout)
      if (target) {
        target.style.zIndex = ''
        target.style.boxShadow = ''
        target.style.transition = ''
      }
    }
  }, [location.pathname, step.target])

  const jitApplied = Boolean(heroVessel?.jitApplied)
  const hsResolved = Boolean(hsDiscrepancy?.resolved)
  const isLastStep = stepIndex === steps.length - 1

  return <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl" role="region" aria-label="36-Hour Voyage Story walkthrough">
    <div className="rounded-xl border border-cyan-400/25 bg-[#091a2d]/[0.97] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300"><Compass className="size-3.5" /></span><div><p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-cyan-300">36-Hour Voyage Story</p><p className="text-[7px] text-slate-600">STEP {stepIndex + 1} OF {steps.length}</p></div></div>
        <div className="flex items-center gap-1.5">{steps.map((item, index) => <button key={item.title} aria-label={`Go to step ${index + 1}: ${item.title}`} aria-current={index === stepIndex ? 'step' : undefined} onClick={() => onStep(index)} className={`h-1.5 rounded-full transition-all ${index === stepIndex ? 'w-6 bg-cyan-300' : index < stepIndex ? 'w-3 bg-emerald-400/70' : 'w-3 bg-slate-700'}`} />)}<button onClick={onClose} aria-label="Close walkthrough" className="ml-2 rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-white"><X className="size-3.5" /></button></div>
      </div>
      <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0"><h2 className="text-[11px] font-semibold text-white">{step.title}</h2><p className="mt-1 max-w-xl text-[8px] leading-4 text-slate-400">{step.copy}</p></div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {stepIndex === 1 && <button onClick={() => heroVessel && dispatch({ type: 'apply-jit-plan', vesselId: heroVessel.id })} disabled={jitApplied || !heroVessel} className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[8px] font-semibold ${jitApplied ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'bg-cyan-400 text-[#062033] hover:bg-cyan-300'}`}>{jitApplied ? <CheckCircle2 className="size-3" /> : <Play className="size-3" />}{jitApplied ? 'JIT applied' : 'Apply 11.4 kn advice'}</button>}
          {stepIndex === 2 && <button onClick={() => hsCase && hsDiscrepancy && dispatch({ type: 'resolve-cargo-discrepancy', caseId: hsCase.id, discrepancyId: hsDiscrepancy.id })} disabled={hsResolved || !hsCase || !hsDiscrepancy} className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[8px] font-semibold ${hsResolved ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'bg-cyan-400 text-[#062033] hover:bg-cyan-300'}`}>{hsResolved ? <CheckCircle2 className="size-3" /> : <Play className="size-3" />}{hsResolved ? 'HS code mismatch cleared' : 'Resolve HS code mismatch'}</button>}
          <button disabled={stepIndex === 0} onClick={() => onStep(Math.max(0, stepIndex - 1))} className="flex items-center gap-1 rounded-md border border-slate-700 px-2.5 py-2 text-[8px] text-slate-300 hover:border-slate-500 disabled:opacity-40"><ArrowLeft className="size-3" /> Back</button>
          <button onClick={() => isLastStep ? onClose() : onStep(stepIndex + 1)} className="flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-[8px] font-semibold text-slate-900 hover:bg-white">{isLastStep ? 'Finish story' : 'Next step'} <ArrowRight className="size-3" /></button>
        </div>
      </div>
    </div>
  </div>
}

export default PitchWalkthrough
