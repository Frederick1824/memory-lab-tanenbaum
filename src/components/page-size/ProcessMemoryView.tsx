import { Box, PackageOpen } from 'lucide-react'
import type { PageSizeMetrics } from '../../types/pageSize'

export function ProcessMemoryView({ metrics }: { metrics: PageSizeMetrics }) {
  const visiblePages = Array.from({ length: metrics.visualPageCount }, (_, index) => index)
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/65">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4"><div className="flex items-center gap-3"><Box size={18} className="text-amber-300" /><div><h3 className="font-medium text-white">Proceso de 64 MB</h3><p className="font-mono text-[8px] uppercase tracking-widest text-slate-600">Representación proporcional simplificada</p></div></div><span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{metrics.pageTableEntries.toLocaleString('es-AR')} páginas</span></div>
      <div className="p-5">
        <div className="flex min-h-36 items-stretch gap-1.5 rounded-xl border border-white/[0.06] bg-black/15 p-3">
          {visiblePages.map((page) => {
            const last = page === visiblePages.length - 1
            return <div key={page} className={`relative min-w-0 flex-1 overflow-hidden rounded border ${last ? 'border-amber-300/45 bg-amber-300/[0.04]' : 'border-cyan/25 bg-cyan/10'}`} title={last ? 'Última página parcialmente utilizada' : `Página ${page + 1}`}>
              {last ? <><div className="absolute inset-x-0 bottom-0 h-1/2 bg-cyan/20" /><div className="absolute inset-x-0 top-0 h-1/2 bg-amber-300/20 page-waste-stripes" /></> : null}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[7px] text-slate-500">{page + 1}</span>
            </div>
          })}
          <div className="grid w-8 shrink-0 place-items-center font-mono text-xs text-slate-700">•••</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><i className="size-2 rounded-sm bg-cyan/40" /> Memoria utilizada</span><span className="flex items-center gap-2"><i className="size-2 rounded-sm bg-amber-300/40" /> Fragmentación en última página</span><span className="ml-auto flex items-center gap-2 text-amber-300"><PackageOpen size={14} /> desperdicio medio ≈ ½ página</span></div>
      </div>
    </section>
  )
}
