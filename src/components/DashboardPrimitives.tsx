import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { RiskLevel } from '@/data/mockMaritimeData'

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-700/70 pb-5 md:flex-row md:items-end">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">{eyebrow}</p>
        <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-slate-700/80 bg-slate-900/65 ${className}`}>{children}</section>
}

export function PanelTitle({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-700/70 px-4 py-3.5">
      <div>
        <h2 className="text-xs font-semibold text-slate-200">{title}</h2>
        {detail && <p className="mt-1 text-[10px] text-slate-500">{detail}</p>}
      </div>
      {action}
    </div>
  )
}

export function MetricCard({ label, value, note, change, tone = 'cyan' }: { label: string; value: string; note: string; change?: 'up' | 'down' | 'flat'; tone?: 'cyan' | 'amber' | 'emerald' | 'slate' }) {
  const accent = {
    cyan: 'text-cyan-300',
    amber: 'text-amber-300',
    emerald: 'text-emerald-300',
    slate: 'text-slate-100',
  }[tone]
  const TrendIcon = change === 'up' ? ArrowUpRight : change === 'down' ? ArrowDownRight : Minus
  return (
    <div className="rounded-lg border border-slate-700/80 bg-slate-900/70 p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">{label}</p>
        {change && <TrendIcon className={`size-3.5 ${change === 'down' ? 'text-emerald-400' : change === 'up' ? 'text-amber-400' : 'text-slate-500'}`} />}
      </div>
      <p className={`mt-2 text-xl font-semibold tracking-tight tabular-nums ${accent}`}>{value}</p>
      <p className="mt-1 text-[10px] text-slate-500">{note}</p>
    </div>
  )
}

export function StatusBadge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'cyan' | 'amber' | 'emerald' | 'red' | 'slate' }) {
  const colors = {
    cyan: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
    amber: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
    emerald: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    red: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
    slate: 'border-slate-600/60 bg-slate-800/60 text-slate-300',
  }
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-medium ${colors[tone]}`}>{children}</span>
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const tone = risk === 'Elevated' ? 'amber' : risk === 'Watch' ? 'cyan' : 'emerald'
  return <StatusBadge tone={tone}>{risk}</StatusBadge>
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="px-4 py-10 text-center"><p className="text-xs font-medium text-slate-300">{title}</p><p className="mt-1 text-[10px] text-slate-500">{detail}</p></div>
}
