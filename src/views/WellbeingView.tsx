import { Activity, BellRing, HeartHandshake, MessageCircleHeart, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { PageHeading, Panel, PanelTitle, RiskBadge, StatusBadge } from '@/components/DashboardPrimitives'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { getCrewAlertCount } from '@/data/mockMaritimeData'

function WellbeingView() {
  const { state, dispatch } = useMaritimeData()
  const alerts = getCrewAlertCount(state)
  const followUps = state.crew.filter((member) => member.followUp).length
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading eyebrow="People / 04" title="Seafarer Wellbeing" description="Crew check-ins, rotation context, and private wellbeing follow-up across the demonstration fleet." action={<StatusBadge tone="cyan"><HeartHandshake className="mr-1 size-3" /> CREW DATA · SIMULATED</StatusBadge>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <WellbeingMetric icon={Activity} label="Crew in demo fleet" value={String(state.crew.length)} sub="5 vessels represented" tone="cyan" />
        <WellbeingMetric icon={BellRing} label="Priority follow-ups" value={String(alerts)} sub="Elevated check-in signals" tone={alerts ? 'amber' : 'emerald'} />
        <WellbeingMetric icon={UserRoundCheck} label="Follow-ups assigned" value={String(followUps)} sub="Private welfare outreach" tone="emerald" />
        <WellbeingMetric icon={ShieldCheck} label="Rotation watch" value="3" sub="Over 5 months onboard" tone="slate" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="overflow-hidden">
          <PanelTitle title="Crew pulse & check-ins" detail="Individual wellbeing signals · Restricted view" action={<span className="flex items-center gap-1 text-[9px] text-slate-500"><ShieldCheck className="size-3.5 text-emerald-400" /> PRIVATE BY DESIGN</span>} />
          <div className="divide-y divide-slate-800/70">
            {state.crew.map((member) => <article key={member.id} className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3"><div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${member.risk === 'Elevated' ? 'bg-amber-400/10 text-amber-200' : member.risk === 'Watch' ? 'bg-cyan-400/10 text-cyan-200' : 'bg-emerald-400/10 text-emerald-200'}`}>{member.name.split(' ').map((part) => part[0]).join('')}</div><div className="min-w-0"><p className="truncate text-[10px] font-medium text-slate-200">{member.name}</p><p className="mt-1 truncate text-[9px] text-slate-500">{member.role} · {member.vesselName}</p></div></div>
              <div className="grid grid-cols-2 gap-3 text-[9px] sm:w-[250px]"><div><p className="text-slate-600">Last check-in</p><p className="mt-1 text-slate-400">{member.lastCheckIn}</p></div><div><p className="text-slate-600">Rotation</p><p className="mt-1 text-slate-400">{member.rotation}</p></div></div>
              <div className="flex items-center gap-2 sm:w-[150px] sm:justify-end"><RiskBadge risk={member.risk} />{member.followUp ? <StatusBadge tone="emerald">Follow-up set</StatusBadge> : member.risk === 'Elevated' ? <button onClick={() => dispatch({ type: 'assign-crew-follow-up', crewId: member.id })} className="rounded bg-amber-400/10 px-2 py-1 text-[8px] font-medium text-amber-200 hover:bg-amber-400/20">Assign follow-up</button> : null}</div>
            </article>)}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel><PanelTitle title="Fleet wellbeing signals" detail="Aggregated · No individual diagnosis" /><div className="space-y-3 px-4 py-4"><Signal label="Extended rotation" detail="Crew members beyond 5 months at sea" value={3} total={5} tone="amber" /><Signal label="Check-in overdue" detail="No check-in recorded in 48 hours" value={2} total={5} tone="cyan" /><Signal label="Follow-up completed" detail="Welfare contact acknowledged" value={followUps} total={5} tone="emerald" /></div></Panel>
          <Panel className="border-cyan-400/15 bg-cyan-400/[0.035]"><div className="flex gap-3 p-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300"><MessageCircleHeart className="size-4" /></span><div><h3 className="text-[10px] font-semibold text-slate-200">People-first operations</h3><p className="mt-1.5 text-[9px] leading-4 text-slate-500">Use private check-ins and supportive outreach to help shore teams spot fatigue signals early. This demo uses fictional crew profiles and does not collect health data.</p></div></div></Panel>
        </div>
      </div>
    </div>
  )
}

function WellbeingMetric({ icon: Icon, label, value, sub, tone }: { icon: typeof Activity; label: string; value: string; sub: string; tone: 'cyan' | 'amber' | 'emerald' | 'slate' }) {
  const color = tone === 'cyan' ? 'text-cyan-300' : tone === 'amber' ? 'text-amber-300' : tone === 'emerald' ? 'text-emerald-300' : 'text-slate-100'
  return <div className="rounded-lg border border-slate-700/80 bg-slate-900/65 p-3.5"><div className="flex items-center gap-2 text-slate-500"><Icon className={`size-3.5 ${color}`} /><span className="text-[9px] uppercase tracking-wide">{label}</span></div><p className={`mt-2 text-lg font-semibold tabular-nums ${color}`}>{value}</p><p className="mt-1 text-[9px] text-slate-600">{sub}</p></div>
}

function Signal({ label, detail, value, total, tone }: { label: string; detail: string; value: number; total: number; tone: 'amber' | 'cyan' | 'emerald' }) {
  const color = tone === 'amber' ? 'bg-amber-400' : tone === 'cyan' ? 'bg-cyan-400' : 'bg-emerald-400'
  return <div><div className="flex items-start justify-between gap-2"><div><p className="text-[9px] font-medium text-slate-300">{label}</p><p className="mt-1 text-[8px] text-slate-600">{detail}</p></div><span className="text-[10px] tabular-nums text-slate-400">{value}/{total}</span></div><div className="mt-2 h-1 rounded-full bg-slate-800"><div className={`h-full rounded-full ${color}`} style={{ width: `${(value / total) * 100}%` }} /></div></div>
}

export default WellbeingView
