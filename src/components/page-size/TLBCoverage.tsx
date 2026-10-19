import { ScanSearch } from 'lucide-react'
import { formatMemory } from '../../data/pageSizeSimulation'
import type { PageSizeMetrics } from '../../types/pageSize'

export function TLBCoverage({ metrics }: { metrics: PageSizeMetrics }) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-panel/65 p-5">
      <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-lime/10 text-lime"><ScanSearch size={17} /></span><span className="font-mono text-[8px] uppercase tracking-widest text-slate-600">64 entradas TLB</span></div>
      <h3 className="mt-5 text-sm font-medium text-slate-300">Cobertura estimada de TLB</h3><p className="mt-2 text-3xl font-semibold text-white">{formatMemory(metrics.tlbCoverageKb)}</p>
      <div className="mt-5 grid grid-cols-8 gap-1">{Array.from({ length: 8 }, (_, index) => <i key={index} className={`h-2 rounded-sm ${index < Math.max(1, Math.ceil(Math.log2(metrics.pageSizeKb / 4 + 1))) ? 'bg-lime' : 'bg-white/[0.06]'}`} />)}</div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">{metrics.pageSizeKb >= 256 ? 'Mayor cobertura TLB' : 'Cobertura menor, con más traducciones'}</p>
    </article>
  )
}
