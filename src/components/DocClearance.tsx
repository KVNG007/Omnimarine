import { useEffect, useState, type DragEvent } from 'react'
import { ArrowRight, BadgeCheck, Check, CheckCircle2, CircleAlert, ClipboardCheck, FileCheck2, FileSearch, FileText, FileWarning, Scale, ScanLine, ShieldCheck, Sparkles, Upload, Weight } from 'lucide-react'
import { PageHeading, Panel, PanelTitle, StatusBadge } from '@/components/DashboardPrimitives'
import { useMaritimeData } from '@/data/MaritimeDataContext'
import { sampleManifestFixture, type ClearanceCase, type CargoDiscrepancy } from '@/data/mockMaritimeData'
import { formatUsd } from '@/lib/format'

function DocClearance() {
  const { state, dispatch } = useMaritimeData()
  const [selectedCaseId, setSelectedCaseId] = useState(() => state.clearanceCases[0]?.id ?? '')
  const selectedCase = state.clearanceCases.find((item) => item.id === selectedCaseId) ?? state.clearanceCases[0]
  const scan = state.sampleManifestScan

  useEffect(() => {
    if (scan.status !== 'scanning' || !scan.startedAt) return
    const elapsed = Date.now() - new Date(scan.startedAt).getTime()
    const remaining = Math.max(0, 1500 - elapsed)
    const timeout = window.setTimeout(() => dispatch({ type: 'complete-sample-manifest-scan' }), remaining)
    return () => window.clearTimeout(timeout)
  }, [dispatch, scan.startedAt, scan.status])

  function startScan(fileName: string) {
    dispatch({ type: 'start-sample-manifest-scan', fileName })
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) startScan(file.name)
  }

  const flaggedCount = state.clearanceCases.reduce((total, item) => total + item.discrepancies.filter((discrepancy) => !discrepancy.resolved).length, 0)
  const preClearedCount = state.clearanceCases.filter((item) => item.status === 'Pre-Cleared').length

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading eyebrow="Compliance / 02 · Clearance agent" title="Pre-Arrival Doc Clearance" description="Catch manifest errors while vessels are still at sea. Review source documents, reconcile discrepancies, and prepare cargo before the berth is ready." action={<StatusBadge tone="cyan"><Sparkles className="mr-1 size-3" /> AI REVIEW · SIMULATED</StatusBadge>} />

      <div className="mb-4 grid grid-cols-2 gap-2 xl:grid-cols-4">
        <SummaryMetric icon={FileSearch} label="Inbound manifests" value={String(state.clearanceCases.length)} note="Vessels still at sea" tone="cyan" />
        <SummaryMetric icon={CircleAlert} label="Open discrepancies" value={String(flaggedCount)} note="Across active reviews" tone={flaggedCount ? 'amber' : 'emerald'} />
        <SummaryMetric icon={BadgeCheck} label="Pre-cleared cargo" value={String(preClearedCount)} note="Green-lane ready on berthing" tone="emerald" />
        <SummaryMetric icon={ShieldCheck} label="Storage fees avoided" value={formatUsd(state.totals.portStorageFeesAvoidedUsd)} note="Posted to shared ledger" tone="emerald" />
      </div>

      <div className="grid items-start gap-4 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel className="overflow-hidden">
            <PanelTitle title="Incoming document queue" detail="Manifests received before berthing" action={<span className="text-[8px] text-slate-500">{state.clearanceCases.length} FILES</span>} />
            <div className="divide-y divide-slate-800/70">
              {state.clearanceCases.map((item) => <QueueItem key={item.id} clearanceCase={item} selected={item.id === selectedCase?.id} onSelect={() => setSelectedCaseId(item.id)} />)}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelTitle title="Upload sample manifest" detail="Test the document intake scan" action={<Upload className="size-3.5 text-slate-500" />} />
            <div className="p-3">
              <div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className={`relative rounded-md border border-dashed px-3 py-4 text-center transition-colors ${scan.status === 'scanning' ? 'border-cyan-400/40 bg-cyan-400/[0.04]' : 'border-slate-700 hover:border-cyan-400/35'}`}>
                <input id="manifest-file-upload" type="file" accept=".pdf,.csv,.xlsx,.doc,.docx" className="sr-only" disabled={scan.status === 'scanning'} onChange={(event) => { const file = event.target.files?.[0]; if (file) startScan(file.name); event.currentTarget.value = '' }} />
                {scan.status === 'idle' && <><span className="mx-auto flex size-8 items-center justify-center rounded-md bg-slate-800 text-cyan-300"><FileText className="size-4" /></span><p className="mt-2 text-[9px] font-medium text-slate-300">Drop a document here</p><label htmlFor="manifest-file-upload" className="mt-1 inline-block cursor-pointer text-[8px] text-cyan-300 hover:text-cyan-200">Browse files · PDF, XLSX, CSV</label></>}
                {scan.status === 'scanning' && <><span className="mx-auto flex size-8 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300"><ScanLine className="size-4 animate-pulse" /></span><p className="mt-2 truncate text-[9px] font-medium text-slate-200">Scanning {scan.fileName}</p><p className="mt-1 text-[8px] text-slate-500">Extracting fields and checking totals…</p><div className="relative mt-3 h-1 overflow-hidden rounded-full bg-slate-800"><span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-cyan-300 animate-[scanline_1.2s_ease-in-out_infinite]" /></div></>}
                {scan.status === 'complete' && <><span className="mx-auto flex size-8 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-300"><CheckCircle2 className="size-4" /></span><p className="mt-2 truncate text-[9px] font-medium text-slate-200">{scan.fileName} scanned</p><p className="mt-1 text-[8px] text-emerald-300">Validation results ready</p></>}
              </div>
              <button disabled={scan.status === 'scanning'} onClick={() => startScan(sampleManifestFixture.fileName)} className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 px-2 py-2 text-[9px] font-medium text-slate-300 transition-colors hover:border-cyan-400/30 hover:text-cyan-200 disabled:cursor-wait disabled:opacity-50"><Upload className="size-3" /> Upload Sample Manifest</button>
              {scan.status === 'complete' && <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">{scan.validationResults.map((result) => <p key={result} className="flex items-center gap-1.5 text-[8px] text-slate-400"><Check className="size-3 text-emerald-400" />{result}</p>)}<button onClick={() => startScan(sampleManifestFixture.fileName)} className="mt-1 text-[8px] text-cyan-300 hover:text-cyan-200">Scan another sample</button></div>}
            </div>
          </Panel>
        </div>

        {selectedCase ? <Inspector clearanceCase={selectedCase} onResolve={(discrepancyId) => dispatch({ type: 'resolve-cargo-discrepancy', caseId: selectedCase.id, discrepancyId })} /> : <Panel><p className="p-8 text-center text-xs text-slate-500">Select a manifest to inspect.</p></Panel>}
      </div>
    </div>
  )
}

function SummaryMetric({ icon: Icon, label, value, note, tone }: { icon: typeof FileSearch; label: string; value: string; note: string; tone: 'cyan' | 'amber' | 'emerald' }) {
  const colors = { cyan: 'bg-cyan-400/10 text-cyan-300', amber: 'bg-amber-400/10 text-amber-300', emerald: 'bg-emerald-400/10 text-emerald-300' }
  return <div className="rounded-lg border border-slate-700/80 bg-slate-900/65 p-3"><div className="flex items-center gap-2"><span className={`flex size-7 items-center justify-center rounded-md ${colors[tone]}`}><Icon className="size-3.5" /></span><p className="truncate text-[8px] uppercase tracking-wide text-slate-500">{label}</p></div><div className="mt-2 flex items-end justify-between gap-2"><p className="text-lg font-semibold tabular-nums text-slate-100">{value}</p><p className="truncate text-right text-[8px] text-slate-600">{note}</p></div></div>
}

function QueueItem({ clearanceCase, selected, onSelect }: { clearanceCase: ClearanceCase; selected: boolean; onSelect: () => void }) {
  const openIssues = clearanceCase.discrepancies.filter((item) => !item.resolved).length
  const tone = clearanceCase.status === 'Pre-Cleared' ? 'emerald' : clearanceCase.status === 'At-Risk of Delay' ? 'amber' : 'cyan'
  return <button onClick={onSelect} className={`block w-full border-l-2 px-3.5 py-3 text-left transition-colors ${selected ? 'border-cyan-400 bg-cyan-400/[0.07]' : 'border-transparent hover:bg-slate-800/40'}`}>
    <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-[10px] font-semibold text-slate-200">{clearanceCase.vesselName}</p><p className="mt-1 text-[8px] text-slate-500">Manifest #{clearanceCase.manifestNumber} · {clearanceCase.terminal}</p></div><StatusBadge tone={tone}>{clearanceCase.status === 'At-Risk of Delay' ? `${openIssues} FLAGS` : clearanceCase.status.toUpperCase()}</StatusBadge></div>
    <div className="mt-2 flex items-center justify-between gap-2 text-[8px] text-slate-600"><span className="truncate">BOL {clearanceCase.billOfLadingNumber} · {clearanceCase.submitted}</span><span className="whitespace-nowrap">{clearanceCase.etaLabel}</span></div>
  </button>
}

function Inspector({ clearanceCase, onResolve }: { clearanceCase: ClearanceCase; onResolve: (discrepancyId: string) => void }) {
  const ready = clearanceCase.status === 'Pre-Cleared'
  const hsDiscrepancy = clearanceCase.discrepancies.find((item) => item.kind === 'HS code mismatch')
  const weightDiscrepancy = clearanceCase.discrepancies.find((item) => item.kind === 'Gross weight variance')
  const openCount = clearanceCase.discrepancies.filter((item) => !item.resolved).length
  return <Panel className="min-w-0 overflow-hidden" data-pitch-target="documents">
    <PanelTitle title={`Manifest #${clearanceCase.manifestNumber}`} detail={`${clearanceCase.vesselName} · ${clearanceCase.billOfLadingNumber} · ${clearanceCase.invoiceNumber}`} action={<StatusBadge tone={ready ? 'emerald' : openCount ? 'amber' : 'cyan'}>{ready ? 'PRE-CLEARED' : openCount ? 'AT-RISK OF DELAY' : 'IN REVIEW'}</StatusBadge>} />
    <div className={`flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${ready ? 'border-emerald-400/15 bg-emerald-400/[0.045]' : 'border-amber-400/10 bg-amber-400/[0.025]'}`}>
      <div className="flex items-center gap-2">{ready ? <BadgeCheck className="size-4 text-emerald-300" /> : <CircleAlert className="size-4 text-amber-300" />}<div><p className={`text-[10px] font-semibold ${ready ? 'text-emerald-200' : 'text-amber-200'}`}>{ready ? 'Green-Lane Ready Upon Berthing' : openCount ? 'At-Risk of Delay · Resolve flagged items before arrival' : 'No AI discrepancies · Agency review still pending'}</p><p className="mt-0.5 text-[8px] text-slate-500">{clearanceCase.origin} <ArrowRight className="mx-1 inline size-2.5" /> Lagos · ETA {clearanceCase.etaLabel}</p></div></div>
      <span className="text-[8px] text-slate-500">{ready ? `${formatUsd(clearanceCase.storageFeesAvoidedUsd)} storage fees avoided` : `${openCount} open validation ${openCount === 1 ? 'flag' : 'flags'}`}</span>
    </div>

    <div className="grid min-w-0 xl:grid-cols-2">
      <DocumentPreview clearanceCase={clearanceCase} hsDiscrepancy={hsDiscrepancy} weightDiscrepancy={weightDiscrepancy} />
      <div className="min-w-0 border-t border-slate-800 xl:border-l xl:border-t-0">
        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4"><div><p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-200"><Sparkles className="size-3.5 text-cyan-300" /> AI extraction & validation</p><p className="mt-1 text-[8px] text-slate-500">Cross-document checks · Confidence {clearanceCase.aiConfidencePercent}%</p></div><StatusBadge tone={openCount ? 'amber' : 'emerald'}>{openCount ? `${openCount} FLAGS` : 'VALIDATED'}</StatusBadge></div>
        <div className="space-y-3 px-4 pb-4">
          {clearanceCase.discrepancies.length ? clearanceCase.discrepancies.map((discrepancy) => <DiscrepancyCard key={discrepancy.id} discrepancy={discrepancy} onResolve={() => onResolve(discrepancy.id)} />) : <div className="rounded-md border border-emerald-400/15 bg-emerald-400/[0.035] p-3.5"><p className="flex items-center gap-2 text-[9px] font-medium text-emerald-200"><CheckCircle2 className="size-3.5" /> No blocking discrepancies detected</p><p className="mt-1.5 text-[8px] leading-4 text-slate-500">The submitted invoice and bill of lading have no simulated validation flags. Final agency review is still pending.</p></div>}
          <div className="rounded-md border border-slate-700/70 bg-slate-950/35 p-3"><p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-500">Extracted shipment details</p><div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2"><Extracted label="Consignment" value={clearanceCase.manifestNumber} /><Extracted label="Load port" value={clearanceCase.origin} /><Extracted label="Discharge" value="Lagos, Nigeria" /><Extracted label="Commodity" value={clearanceCase.cargo.split(' · ')[0]} /></div></div>
        </div>
      </div>
    </div>
  </Panel>
}

function DocumentPreview({ clearanceCase, hsDiscrepancy, weightDiscrepancy }: { clearanceCase: ClearanceCase; hsDiscrepancy?: CargoDiscrepancy; weightDiscrepancy?: CargoDiscrepancy }) {
  const invoiceHs = hsDiscrepancy?.invoiceValue.split(' · ')[0] ?? '—'
  const bolHs = hsDiscrepancy ? (hsDiscrepancy.resolved ? hsDiscrepancy.resolvedValue.split(' · ')[0] : hsDiscrepancy.billOfLadingValue.split(' · ')[0]) : '—'
  const invoiceWeight = weightDiscrepancy?.invoiceValue.split(' · ')[0] ?? '—'
  const bolWeight = weightDiscrepancy ? (weightDiscrepancy.resolved ? weightDiscrepancy.resolvedValue.split(' · ')[0] : weightDiscrepancy.billOfLadingValue.split(' · ')[0]) : '—'
  return <div className="min-w-0 bg-slate-950/25 p-4">
    <div className="mb-3 flex items-center justify-between"><p className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-300"><FileText className="size-3.5 text-slate-500" /> Source document preview</p><span className="text-[8px] text-slate-600">SIMULATED EXTRACT</span></div>
    <div className="overflow-hidden rounded-md border border-slate-700/80 bg-[#e8edf0] text-slate-800 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-slate-300 bg-white px-3 py-2"><div><p className="text-[8px] font-bold tracking-[0.12em] text-slate-700">COMMERCIAL INVOICE</p><p className="mt-0.5 text-[7px] text-slate-500">{clearanceCase.invoiceNumber} · PRE-ARRIVAL COPY</p></div><FileCheck2 className="size-4 text-slate-400" /></div>
      <div className="grid grid-cols-2 gap-3 px-3 py-3 text-[7px]"><div><p className="text-slate-500">VESSEL</p><p className="mt-0.5 font-semibold">{clearanceCase.vesselName}</p></div><div><p className="text-slate-500">MANIFEST</p><p className="mt-0.5 font-semibold">#{clearanceCase.manifestNumber}</p></div><div><p className="text-slate-500">PORT OF LOADING</p><p className="mt-0.5 font-semibold">{clearanceCase.origin}</p></div><div><p className="text-slate-500">PORT OF DISCHARGE</p><p className="mt-0.5 font-semibold">{clearanceCase.terminal}</p></div></div>
      <div className="mx-3 border-y border-slate-300 py-2.5"><p className="text-[7px] font-semibold uppercase text-slate-500">Cargo description</p><p className="mt-1 text-[8px] font-medium">{clearanceCase.cargo}</p></div>
      <div className="grid grid-cols-2 gap-2 px-3 py-3 text-[7px]"><DocumentField label="INVOICE HS CODE" value={invoiceHs} flagged={Boolean(hsDiscrepancy && !hsDiscrepancy.resolved)} /><DocumentField label="B/L HS CODE" value={bolHs} flagged={Boolean(hsDiscrepancy && !hsDiscrepancy.resolved)} /><DocumentField label="INVOICE GROSS WT." value={invoiceWeight} flagged={Boolean(weightDiscrepancy && !weightDiscrepancy.resolved)} /><DocumentField label="B/L GROSS WT." value={bolWeight} flagged={Boolean(weightDiscrepancy && !weightDiscrepancy.resolved)} /></div>
      <div className="flex items-center justify-between bg-slate-200 px-3 py-2 text-[7px] text-slate-500"><span>Bill of lading · {clearanceCase.billOfLadingNumber}</span><span>PAGE 1 / 1</span></div>
    </div>
    <div className="mt-3 flex items-center gap-2 rounded-md border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-[8px] text-slate-500"><FileWarning className="size-3.5 shrink-0 text-amber-300" />Amber highlights mark fields with cross-document discrepancies.</div>
  </div>
}

function DocumentField({ label, value, flagged }: { label: string; value: string; flagged: boolean }) {
  return <div className={`rounded border px-2 py-1.5 ${flagged ? 'border-amber-500/50 bg-amber-100 text-amber-900' : 'border-slate-300 bg-white text-slate-700'}`}><p className={`text-[6px] font-semibold ${flagged ? 'text-amber-700' : 'text-slate-500'}`}>{label}</p><p className="mt-0.5 font-semibold">{value}</p></div>
}

function DiscrepancyCard({ discrepancy, onResolve }: { discrepancy: CargoDiscrepancy; onResolve: () => void }) {
  const isHs = discrepancy.kind === 'HS code mismatch'
  const Icon = isHs ? Scale : Weight
  return <div data-pitch-target={isHs ? 'hs-code' : undefined} className={`rounded-md border p-3 ${discrepancy.resolved ? 'border-emerald-400/20 bg-emerald-400/[0.035]' : 'border-amber-400/20 bg-amber-400/[0.035]'}`}>
    <div className="flex items-start gap-2.5"><span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded ${discrepancy.resolved ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-300'}`}>{discrepancy.resolved ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1.5"><p className={`text-[9px] font-semibold ${discrepancy.resolved ? 'text-emerald-200' : 'text-amber-200'}`}>{discrepancy.kind}</p><StatusBadge tone={discrepancy.resolved ? 'emerald' : 'amber'}>{discrepancy.resolved ? 'RECONCILED' : discrepancy.severity.toUpperCase()}</StatusBadge></div><p className="mt-1.5 text-[8px] leading-4 text-slate-400">{discrepancy.finding}</p></div></div>
    <div className="mt-3 grid grid-cols-2 gap-2"><CompareValue label="Commercial invoice" value={discrepancy.invoiceValue} /><CompareValue label="Bill of lading" value={discrepancy.resolved ? discrepancy.resolvedValue : discrepancy.billOfLadingValue} flagged={!discrepancy.resolved} /></div>
    <div className="mt-2.5 rounded border border-slate-700/70 bg-slate-950/40 px-2.5 py-2"><p className="text-[7px] font-semibold uppercase tracking-wide text-cyan-300">Suggested reconciliation</p><p className="mt-1 text-[8px] leading-4 text-slate-400">{discrepancy.suggestedCorrection}</p></div>
    <button disabled={discrepancy.resolved} onClick={onResolve} className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded px-2.5 py-2 text-[8px] font-semibold transition-colors ${discrepancy.resolved ? 'cursor-default border border-emerald-400/15 bg-emerald-400/[0.04] text-emerald-300' : 'bg-cyan-400 text-[#062033] hover:bg-cyan-300'}`}>{discrepancy.resolved ? <><CheckCircle2 className="size-3" /> Reconciled & verified</> : <><ClipboardCheck className="size-3" /> Auto-Reconcile & Verify Before Arrival</>}</button>
  </div>
}

function CompareValue({ label, value, flagged = false }: { label: string; value: string; flagged?: boolean }) {
  return <div className={`min-w-0 rounded border px-2 py-1.5 ${flagged ? 'border-amber-500/20 bg-amber-500/[0.04]' : 'border-slate-700/70 bg-slate-950/30'}`}><p className="truncate text-[7px] text-slate-500">{label}</p><p className={`mt-1 break-words text-[8px] font-medium ${flagged ? 'text-amber-200' : 'text-slate-300'}`}>{value}</p></div>
}

function Extracted({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><p className="text-[7px] text-slate-600">{label}</p><p className="mt-0.5 truncate text-[8px] font-medium text-slate-300">{value}</p></div>
}

export default DocClearance
