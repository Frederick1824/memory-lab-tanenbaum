import { BarChart3 } from 'lucide-react'
import { formatMemory } from '../../data/pageSizeSimulation'
import type { PageSizeMetrics } from '../../types/pageSize'

export function WasteComparison({ metrics }: { metrics: PageSizeMetrics }) {
  const total = metrics.totalWasteKb
  const tablePercent = (metrics.pageTableWasteKb / total) * 100
  const fragmentationPercent = (metrics.internalFragmentationKb / total) * 100
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-panel to-amber-400/[0.025] p-5">
      <div className="flex items-center gap-3"><BarChart3 size={18} className="text-amber-300" /><div><h3 className="font-medium text-white">Balance de desperdicio</h3><p className="font-mono text-[8px] uppercase tracking-widest text-slate-600">Tabla + fragmentación interna</p></div></div>
      <div className="mt-6 h-9 overflow-hidden rounded-lg bg-white/[0.04] p-1">
        <div className="flex h-full overflow-hidden rounded-md">
          <div className="grid min-w-[3px] place-items-center bg-violet-400/70 transition-all duration-300" style={{ width: `${tablePercent}%` }}><span className="font-mono text-[8px] text-white">{tablePercent > 18 ? 'TABLA' : ''}</span></div>
          <div className="grid min-w-[3px] place-items-center bg-amber-300/80 transition-all duration-300" style={{ width: `${fragmentationPercent}%` }}><span className="font-mono text-[8px] text-ink">{fragmentationPercent > 18 ? 'FRAGMENTACIÓN' : ''}</span></div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center"><div><p className="font-mono text-[8px] uppercase text-slate-600">Tabla</p><p className="mt-1 text-sm text-violet-300">{formatMemory(metrics.pageTableWasteKb)}</p></div><div><p className="font-mono text-[8px] uppercase text-slate-600">Fragmentación</p><p className="mt-1 text-sm text-amber-300">{formatMemory(metrics.internalFragmentationKb)}</p></div><div><p className="font-mono text-[8px] uppercase text-slate-600">Total</p><p className="mt-1 text-sm text-white">{formatMemory(total)}</p></div></div>
    </section>
  )
}
