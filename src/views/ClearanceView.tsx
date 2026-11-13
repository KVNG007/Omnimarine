import { Check, Clock3, FileCheck2, FileClock, FileWarning, Search } from 'lucide-react'
import { EmptyState, PageHeading, Panel, PanelTitle, StatusBadge } from '@/components/DashboardPrimitives'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { getPendingDocumentCount } from '@/data/mockMaritimeData'

function ClearanceView() {
  const { state, dispatch } = useMaritimeData()
  const pendingCount = getPendingDocumentCount(state)
  const clearedCount = state.documents.length - pendingCount
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading eyebrow="Compliance / 02" title="Pre-Arrival Doc Clearance" description="A shared view of vessel submissions and agency review status ahead of berth arrival." action={<button className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[10px] text-slate-300"><Search className="size-3" /> Search documents</button>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Summary icon={FileClock} label="Awaiting review" value={String(state.documents.filter((item) => item.status === 'Pending review').length)} tone="amber" />
        <Summary icon={Clock3} label="In agency review" value={String(state.documents.filter((item) => item.status === 'In review').length)} tone="cyan" />
        <Summary icon={FileCheck2} label="Cleared today" value={String(clearedCount)} tone="emerald" />
      </div>

      <Panel className="overflow-hidden">
        <PanelTitle title="Arrival document queue" detail={`${pendingCount} documents require action · NCS, NIMASA, Port Health and NPA`} action={<StatusBadge tone={pendingCount ? 'amber' : 'emerald'}>{pendingCount} NEED ATTENTION</StatusBadge>} />
        {state.documents.length === 0 ? <EmptyState title="No documents in queue" detail="New vessel submissions will appear here." /> : <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead><tr className="border-b border-slate-800 text-[8px] uppercase tracking-[0.1em] text-slate-600"><th className="px-4 py-2.5 font-medium">Vessel</th><th className="px-3 py-2.5 font-medium">Document</th><th className="px-3 py-2.5 font-medium">Reviewing agency</th><th className="px-3 py-2.5 font-medium">Submitted</th><th className="px-3 py-2.5 font-medium">Status</th><th className="px-4 py-2.5 text-right font-medium">Action</th></tr></thead>
            <tbody className="divide-y divide-slate-800/70">
              {state.documents.map((document) => <tr key={document.id} className="transition-colors hover:bg-slate-800/25">
                <td className="px-4 py-3 text-[10px] font-medium text-slate-200">{document.vesselName}</td>
                <td className="px-3 py-3"><div className="flex items-center gap-2 text-[9px] text-slate-300"><FileWarning className="size-3.5 text-slate-500" />{document.document}</div></td>
                <td className="px-3 py-3 text-[9px] text-slate-400">{document.agency}</td>
                <td className="px-3 py-3 text-[9px] text-slate-500">{document.submitted}</td>
                <td className="px-3 py-3"><StatusBadge tone={document.status === 'Cleared' ? 'emerald' : document.status === 'In review' ? 'cyan' : 'amber'}>{document.status}</StatusBadge></td>
                <td className="px-4 py-3 text-right">{document.status === 'Cleared' ? <span className="inline-flex items-center gap-1 text-[9px] text-emerald-300"><Check className="size-3" /> Verified</span> : <button onClick={() => dispatch({ type: 'clear-document', documentId: document.id })} className="rounded bg-cyan-400/10 px-2.5 py-1.5 text-[9px] font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20">Mark cleared</button>}</td>
              </tr>)}
            </tbody>
          </table>
        </div>}
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel><PanelTitle title="Pre-arrival workflow" detail="Typical arrival clearance sequence" /><div className="grid grid-cols-4 gap-2 px-4 py-5">{['Submit', 'Validate', 'Agency review', 'Cleared'].map((step, index) => <div key={step} className="relative text-center"><span className={`mx-auto flex size-7 items-center justify-center rounded-full border text-[9px] ${index < 2 ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>{index + 1}</span><p className="mt-2 text-[8px] text-slate-400">{step}</p>{index < 3 && <span className="absolute left-[calc(50%+16px)] top-3.5 h-px w-[calc(100%-32px)] bg-slate-700" />}</div>)}</div></Panel>
        <Panel><PanelTitle title="Time-to-berth impact" detail="Illustrative clearance delay contribution" /><div className="space-y-3 px-4 py-4"><ImpactRow label="Pending document review" value="18.4h" width="76%" tone="amber" /><ImpactRow label="Agency hand-off time" value="11.2h" width="48%" tone="cyan" /><ImpactRow label="Rework / resubmission" value="6.8h" width="30%" tone="slate" /><p className="border-t border-slate-800 pt-3 text-[9px] leading-4 text-slate-500">Clearing a document updates the shared exposure estimate and adds a savings entry to the economic ledger.</p></div></Panel>
      </div>
    </div>
  )
}

function Summary({ icon: Icon, label, value, tone }: { icon: typeof FileClock; label: string; value: string; tone: 'amber' | 'cyan' | 'emerald' }) {
  const colors = { amber: 'text-amber-300 bg-amber-400/10', cyan: 'text-cyan-300 bg-cyan-400/10', emerald: 'text-emerald-300 bg-emerald-400/10' }
  return <div className="flex items-center gap-3 rounded-lg border border-slate-700/80 bg-slate-900/65 p-3.5"><span className={`flex size-8 items-center justify-center rounded-md ${colors[tone]}`}><Icon className="size-4" /></span><div className="min-w-0"><p className="text-[9px] uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-base font-semibold tabular-nums text-slate-100">{value}</p></div></div>
}

function ImpactRow({ label, value, width, tone }: { label: string; value: string; width: string; tone: 'amber' | 'cyan' | 'slate' }) {
  const color = tone === 'amber' ? 'bg-amber-400' : tone === 'cyan' ? 'bg-cyan-400' : 'bg-slate-500'
  return <div><div className="mb-1 flex justify-between text-[9px]"><span className="text-slate-400">{label}</span><span className="tabular-nums text-slate-300">{value}</span></div><div className="h-1 rounded-full bg-slate-800"><div className={`h-1 rounded-full ${color}`} style={{ width }} /></div></div>
}

export default ClearanceView
