import { useState, type FormEvent } from 'react'
import { Activity, CalendarClock, Check, Globe2, HeartHandshake, LockKeyhole, MessageCircle, Radio, Send, ShieldCheck, Siren, Signal, SignalLow, WifiOff } from 'lucide-react'
import { PageHeading, Panel, PanelTitle, StatusBadge } from '@/components/DashboardPrimitives'
import { useMaritimeData } from '@/data/MaritimeDataContext'

type Perspective = 'seafarer' | 'fleet'

const heatmap = [
  { label: 'Fatigue index', description: 'Anonymized rest and watch patterns', values: [1, 2, 2, 3, 1, 2, 1] },
  { label: 'Stress index', description: 'Voluntary self-reported pulse', values: [1, 1, 2, 3, 2, 1, 1] },
  { label: 'Support access', description: 'Private practitioner response load', values: [2, 1, 2, 1, 2, 3, 1] },
]

function SeafarerWellbeing() {
  const { state, dispatch } = useMaritimeData()
  const [perspective, setPerspective] = useState<Perspective>('seafarer')
  const [draft, setDraft] = useState('')
  const [helperNotice, setHelperNotice] = useState('')
  const [crisisOpen, setCrisisOpen] = useState(false)
  const queuedCount = state.wellbeing.messages.filter((message) => message.delivery === 'queued').length

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) return
    dispatch({ type: 'send-wellbeing-message', body: draft })
    setDraft('')
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading eyebrow="People / 04 · Offline-first welfare" title="Seafarer Wellbeing" description="Private, low-bandwidth access to human support alongside anonymized fleet-level wellbeing signals." action={<StatusBadge tone="emerald"><ShieldCheck className="mr-1 size-3" /> PRIVACY BY DESIGN</StatusBadge>} />

      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-700/80 bg-slate-900/50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Presenter perspective</p><p className="mt-1 text-[9px] text-slate-600">Switch focus between private crew access and fleet-level reporting.</p></div>
        <div className="flex rounded-md border border-slate-700 bg-slate-950/50 p-1" role="tablist" aria-label="Wellbeing perspective">
          <button role="tab" aria-selected={perspective === 'seafarer'} onClick={() => setPerspective('seafarer')} className={`rounded px-3 py-2 text-[9px] ${perspective === 'seafarer' ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-500 hover:text-slate-300'}`}>Seafarer mobile experience</button>
          <button role="tab" aria-selected={perspective === 'fleet'} onClick={() => setPerspective('fleet')} className={`rounded px-3 py-2 text-[9px] ${perspective === 'fleet' ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-500 hover:text-slate-300'}`}>Employer / NIMASA trends</button>
        </div>
      </div>

      <div className="grid items-start gap-4 2xl:grid-cols-[1fr_1fr]">
        <section className={`${perspective === 'fleet' ? 'hidden 2xl:block' : ''}`} aria-label="Seafarer mobile experience">
          <div data-pitch-target="wellbeing" className="mx-auto max-w-[460px] rounded-[30px] border border-slate-600 bg-[#050c16] p-2 shadow-2xl shadow-black/30">
            <div className="overflow-hidden rounded-[23px] border border-slate-800 bg-[#0b1c2e]">
              <div className="flex items-center justify-between border-b border-slate-800 bg-[#091728] px-4 py-3">
                <div className="flex items-center gap-2"><div className="flex size-7 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300"><HeartHandshake className="size-4" /></div><div><p className="text-[10px] font-semibold text-slate-100">HarbourLight</p><p className="text-[7px] text-slate-500">Private crew support</p></div></div>
                <StatusBadge tone={state.wellbeing.offline ? 'amber' : 'cyan'}>{state.wellbeing.offline ? <><WifiOff className="mr-1 size-3" /> OFFLINE QUEUE</> : <><Signal className="mr-1 size-3" /> VSAT · 1.2 KB</>}</StatusBadge>
              </div>

              <div className="border-b border-slate-800 bg-slate-950/25 px-4 py-3">
                <div className="flex items-start justify-between gap-3"><div className="flex gap-2.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"><LockKeyhole className="size-3.5" /></span><div><p className="text-[9px] font-semibold text-emerald-200">Alias: Mariner-749</p><p className="mt-1 max-w-[245px] text-[7px] leading-3 text-slate-500">Identity hidden from captain & employer</p></div></div><span className="text-[7px] text-slate-600">ENCRYPTED</span></div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  <label className="flex items-center gap-1.5 text-[7px] text-slate-400"><input type="checkbox" checked={state.wellbeing.shoreLeaveRequested} onChange={(event) => dispatch({ type: 'set-wellbeing-shore-leave', value: event.currentTarget.checked })} className="accent-cyan-400" /> Request shore leave</label>
                  <label className="flex items-center gap-1.5 text-[7px] text-slate-400"><input type="checkbox" checked={state.wellbeing.identityConsent} onChange={(event) => dispatch({ type: 'set-wellbeing-identity-consent', value: event.currentTarget.checked })} className="accent-cyan-400" /> Reveal identity to practitioner</label>
                </div>
                {state.wellbeing.identityConsent && <p className="mt-2 rounded bg-amber-400/10 px-2 py-1.5 text-[7px] leading-3 text-amber-200">Consent is on for the assigned practitioner only. Captain and employer access remains hidden.</p>}
              </div>

              <div className="px-4 py-3">
                <div className="flex items-center justify-between"><div><p className="text-[8px] font-medium text-slate-300">Connection & sync</p><p className="mt-1 text-[7px] text-slate-600">{state.wellbeing.offline ? 'Messages are stored securely on this device.' : 'VSAT weak signal — compressed payload mode (1.2 KB).'}</p></div><label className="flex items-center gap-1.5 text-[7px] text-slate-400"><input type="checkbox" checked={state.wellbeing.offline} onChange={(event) => dispatch({ type: 'set-wellbeing-offline', value: event.currentTarget.checked })} className="accent-cyan-400" /> Simulate offline</label></div>
                {queuedCount > 0 && <button onClick={() => dispatch({ type: 'sync-wellbeing-messages' })} disabled={state.wellbeing.offline} className="mt-2 flex w-full items-center justify-between rounded-md border border-amber-400/20 bg-amber-400/[0.06] px-2.5 py-2 text-[8px] text-amber-200 disabled:opacity-50"><span className="flex items-center gap-1.5"><SignalLow className="size-3.5" /> {queuedCount} compressed message{queuedCount === 1 ? '' : 's'} queued</span><span>{state.wellbeing.offline ? 'Waiting for connection' : 'Sync now →'}</span></button>}
              </div>

              <div className="mx-3 flex h-[290px] flex-col gap-2 overflow-y-auto rounded-lg border border-slate-800/80 bg-[#071321] p-3">
                <div className="mb-1 flex items-center justify-center gap-1 text-[7px] text-slate-600"><LockKeyhole className="size-2.5" /> PRIVATE PRACTITIONER CHAT</div>
                {state.wellbeing.messages.map((message) => <div key={message.id} className={`max-w-[85%] rounded-xl px-2.5 py-2 ${message.sender === 'seafarer' ? 'self-end rounded-br-sm bg-cyan-400/10 text-cyan-50' : 'self-start rounded-bl-sm bg-slate-800/80 text-slate-200'}`}><p className="text-[8px] leading-4">{message.body}</p><p className={`mt-1 text-right text-[6px] ${message.delivery === 'queued' ? 'text-amber-300' : 'text-slate-600'}`}>{message.time} · {message.delivery === 'queued' ? 'queued securely' : 'delivered'}</p></div>)}
              </div>

              <div className="px-3 pb-3 pt-2">
                <div className="mb-2 rounded-md border border-violet-400/15 bg-violet-400/[0.04] p-2"><p className="text-[7px] font-semibold text-violet-200">AI helper · logistics only</p><p className="mt-1 text-[7px] leading-3 text-slate-500">AI handles logistics & translation only — all clinical care is human-led.</p><div className="mt-2 flex gap-1.5"><button onClick={() => setHelperNotice('Translation is ready. Choose a language in your profile to continue.')} className="flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-[7px] text-slate-300 hover:border-violet-400/30"><Globe2 className="size-2.5" /> Translate</button><button onClick={() => setHelperNotice('Private practitioner appointment options are ready to review.')} className="flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-[7px] text-slate-300 hover:border-violet-400/30"><CalendarClock className="size-2.5" /> Schedule appointment</button></div>{helperNotice && <p role="status" className="mt-2 text-[7px] text-violet-200">{helperNotice}</p>}</div>
                <form onSubmit={sendMessage} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/50 p-1.5"><input value={draft} onChange={(event) => setDraft(event.currentTarget.value)} aria-label="Message the practitioner" placeholder="Write a private message…" className="min-w-0 flex-1 bg-transparent px-2 py-1 text-[8px] text-slate-100 outline-none placeholder:text-slate-600" /><button aria-label="Send compressed message" type="submit" disabled={!draft.trim()} className="flex size-7 items-center justify-center rounded-md bg-cyan-400 text-[#062033] disabled:opacity-40"><Send className="size-3" /></button></form>
                <button onClick={() => setCrisisOpen((open) => !open)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-rose-400/30 bg-rose-400/[0.08] px-3 py-2 text-[8px] font-semibold text-rose-200 hover:bg-rose-400/15"><Siren className="size-3" /> 24/7 Maritime Crisis Protocol</button>
                {crisisOpen && <div className="mt-2 rounded-md border border-rose-400/20 bg-rose-400/[0.05] p-2.5 text-[7px] leading-4 text-slate-300"><p className="font-semibold text-rose-200">Immediate support</p><p className="mt-1">If there is immediate danger, contact the vessel’s designated emergency response lead or local emergency services. For confidential support, request an urgent practitioner call; queued requests send when connectivity returns.</p></div>}
                <p className="mt-2 text-center text-[6px] text-slate-600">Offline messages remain on this device until a connection is available.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${perspective === 'seafarer' ? 'hidden 2xl:block' : ''}`} aria-label="Aggregated fleet welfare dashboard">
          <Panel className="overflow-hidden">
            <PanelTitle title="Aggregated fleet welfare" detail="Employer & NIMASA view · No individual names or chat content" action={<StatusBadge tone="emerald"><LockKeyhole className="mr-1 size-3" /> ANONYMIZED</StatusBadge>} />
            <div className="grid grid-cols-2 gap-px bg-slate-800/70 sm:grid-cols-4">
              <TrendMetric label="Fleet fatigue index" value="32" unit="/100" note="↓ 8 pts this quarter" tone="amber" />
              <TrendMetric label="Stress pulse" value="24" unit="/100" note="Stable · rolling 30 days" tone="cyan" />
              <TrendMetric label="Median response" value="18" unit="min" note="Practitioner first response" tone="emerald" />
              <TrendMetric label="Safety incidents" value="−17%" unit="" note="Compared with prior quarter" tone="emerald" />
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between gap-2"><div><h3 className="text-[9px] font-semibold text-slate-200">Anonymized fleet signal heatmap</h3><p className="mt-1 text-[7px] text-slate-600">Weekly aggregate · intensity only · no vessel or crew identifiers</p></div><span className="text-[7px] text-slate-600">LOW <span className="mx-1 text-cyan-300">■</span><span className="text-amber-300">■</span> HIGH</span></div>
              <div className="overflow-x-auto"><div className="min-w-[430px] space-y-2.5">{heatmap.map((row) => <div key={row.label} className="grid grid-cols-[125px_repeat(7,minmax(24px,1fr))] items-center gap-1.5"><div><p className="text-[8px] font-medium text-slate-300">{row.label}</p><p className="mt-0.5 truncate text-[6px] text-slate-600">{row.description}</p></div>{row.values.map((value, index) => <div key={`${row.label}-${index}`} title={`${row.label}, day ${index + 1}`} className={`h-7 rounded-sm ${value === 1 ? 'bg-cyan-400/15' : value === 2 ? 'bg-cyan-400/35' : 'bg-amber-400/55'}`} />)}</div>)}</div></div>
              <div className="mt-2 grid grid-cols-[125px_repeat(7,minmax(24px,1fr))] gap-1.5 text-center text-[6px] text-slate-600"><span />{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
            </div>
            <div className="border-t border-slate-800 p-4">
              <div className="flex items-center justify-between gap-3"><div><h3 className="text-[9px] font-semibold text-slate-200">Wellbeing response & safety trend</h3><p className="mt-1 text-[7px] text-slate-600">Illustrative correlation · aggregated quarter-on-quarter</p></div><Activity className="size-4 text-cyan-300" /></div>
              <div className="mt-4 grid grid-cols-3 gap-2"><TrendLine label="Support access" values={[35, 42, 47, 55, 63, 72]} tone="cyan" /><TrendLine label="Fatigue reports" values={[75, 72, 68, 60, 53, 48]} tone="amber" /><TrendLine label="Safety incidents" values={[62, 58, 55, 46, 42, 36]} tone="emerald" /></div>
              <p className="mt-4 rounded-md border border-slate-700/70 bg-slate-950/30 p-2.5 text-[7px] leading-4 text-slate-500">Trend lines show association for presentation only. They do not establish causation. Cohorts below minimum reporting thresholds are suppressed.</p>
            </div>
          </Panel>
          <div className="mt-3 flex items-start gap-2 rounded-md border border-emerald-400/15 bg-emerald-400/[0.035] p-3"><ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-300" /><p className="text-[8px] leading-4 text-slate-500">Employers and NIMASA see only aggregated indicators. Individual identities, message content, and practitioner notes are excluded from this view. Fictional demo data; no health information is collected.</p></div>
        </section>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-800 pt-3 text-[7px] text-slate-600"><span className="flex items-center gap-1"><Radio className="size-3 text-cyan-400" /> Offline-first · compressed messaging</span><span className="flex items-center gap-1"><MessageCircle className="size-3 text-cyan-400" /> Human-led confidential care</span><span className="flex items-center gap-1"><Check className="size-3 text-emerald-400" /> Consent-controlled identity reveal</span></div>
    </div>
  )
}

function TrendMetric({ label, value, unit, note, tone }: { label: string; value: string; unit: string; note: string; tone: 'amber' | 'cyan' | 'emerald' }) {
  const color = tone === 'amber' ? 'text-amber-300' : tone === 'cyan' ? 'text-cyan-300' : 'text-emerald-300'
  return <div className="bg-slate-950/25 p-3"><p className="truncate text-[7px] uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-2 text-lg font-semibold tabular-nums ${color}`}>{value}<span className="ml-0.5 text-[8px] font-normal text-slate-500">{unit}</span></p><p className="mt-1 truncate text-[7px] text-slate-600">{note}</p></div>
}

function TrendLine({ label, values, tone }: { label: string; values: number[]; tone: 'cyan' | 'amber' | 'emerald' }) {
  const color = tone === 'cyan' ? 'bg-cyan-400' : tone === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
  return <div><p className="mb-2 truncate text-[7px] text-slate-500">{label}</p><div className="flex h-12 items-end gap-1 rounded bg-slate-950/40 px-1.5 pt-1">{values.map((value, index) => <span key={index} className={`flex-1 rounded-t-sm opacity-70 ${color}`} style={{ height: `${value}%` }} />)}</div><p className="mt-1 text-[6px] text-slate-600">Q1 <span className="float-right">Q2</span></p></div>
}

export default SeafarerWellbeing
