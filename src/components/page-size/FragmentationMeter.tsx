import { PieChart } from 'lucide-react'
import { formatMemory } from '../../data/pageSizeSimulation'
import type { PageSizeMetrics } from '../../types/pageSize'

export function FragmentationMeter({ metrics }: { metrics: PageSizeMetrics }) {
  const ratio = Math.min(100, Math.max(3, (metrics.internalFragmentationKb / 1024) * 45))
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-panel/65 p-5">
      <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-amber-300/10 text-amber-300"><PieChart size={17} /></span><span className="font-mono text-[8px] uppercase tracking-widest text-slate-600">Promedio estimado</span></div>
      <h3 className="mt-5 text-sm font-medium text-slate-300">Fragmentación interna</h3><p className="mt-2 text-3xl font-semibold text-white">{formatMemory(metrics.internalFragmentationKb)}</p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-cyan/15"><div className="h-full bg-amber-300 transition-all duration-300" style={{ width: `${ratio}%` }} /></div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">{metrics.pageSizeKb <= 64 ? 'Menor fragmentación interna' : 'Mayor desperdicio por redondeo'}</p>
    </article>
  )
}
