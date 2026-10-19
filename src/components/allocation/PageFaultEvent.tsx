import { ArrowRightLeft, Info, RadioTower } from 'lucide-react'
import type { AllocationEvent } from '../../types/allocation'

const iconByKind = { fault: ArrowRightLeft, pff: RadioTower, info: Info }

export function PageFaultEvent({ event }: { event: AllocationEvent }) {
  const Icon = iconByKind[event.kind]
  const styles = event.kind === 'pff' ? 'border-lime/25 bg-lime/[0.06] text-lime' : event.kind === 'fault' ? 'border-cyan/25 bg-cyan/[0.06] text-cyan' : 'border-white/[0.08] bg-white/[0.025] text-slate-400'
  return (
    <div className={`rounded-xl border p-4 transition ${styles}`} role="status" aria-live="polite">
      <div className="flex gap-3"><Icon size={18} className="mt-0.5 shrink-0" /><div><p className="font-mono text-xs font-semibold tracking-wide">{event.message}</p><p className="mt-1.5 text-sm leading-relaxed text-slate-400">{event.detail}</p></div></div>
    </div>
  )
}
