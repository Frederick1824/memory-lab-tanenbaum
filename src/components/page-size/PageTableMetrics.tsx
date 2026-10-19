import { ListTree } from 'lucide-react'
import { formatMemory } from '../../data/pageSizeSimulation'
import type { PageSizeMetrics } from '../../types/pageSize'

export function PageTableMetrics({ metrics }: { metrics: PageSizeMetrics }) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-panel/65 p-5">
      <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-violet-400/10 text-violet-300"><ListTree size={17} /></span><span className="font-mono text-[8px] uppercase tracking-widest text-slate-600">Entrada: 8 bytes</span></div>
      <h3 className="mt-5 text-sm font-medium text-slate-300">Entradas necesarias</h3><p className="mt-2 text-3xl font-semibold text-white">{metrics.pageTableEntries.toLocaleString('es-AR')}</p>
      <p className="mt-2 font-mono text-[10px] text-violet-300">Tabla ≈ {formatMemory(metrics.pageTableWasteKb)}</p>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">{metrics.pageSizeKb <= 16 ? 'Mayor tabla de páginas' : 'Menos entradas administrativas'}</p>
    </article>
  )
}
