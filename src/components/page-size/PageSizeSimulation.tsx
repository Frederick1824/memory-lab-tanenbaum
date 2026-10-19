import { Info, Scale } from 'lucide-react'
import { useMemo, useState } from 'react'
import { calculatePageSizeMetrics } from '../../data/pageSizeSimulation'
import { FragmentationMeter } from './FragmentationMeter'
import { PageSizeSelector } from './PageSizeSelector'
import { PageTableMetrics } from './PageTableMetrics'
import { ProcessMemoryView } from './ProcessMemoryView'
import { TanenbaumCalculator } from './TanenbaumCalculator'
import { TLBCoverage } from './TLBCoverage'
import { WasteComparison } from './WasteComparison'

function getTradeoffMessage(pageSizeKb: number) {
  if (pageSizeKb <= 16) return { title: 'Menor fragmentación interna · mayor tabla de páginas', detail: 'El espacio se aprovecha con precisión, pero hacen falta muchas entradas para describir el proceso.' }
  if (pageSizeKb <= 64) return { title: 'Zona de compromiso equilibrada', detail: 'La tabla disminuye sin que la fragmentación interna domine todavía el costo total.' }
  if (pageSizeKb <= 256) return { title: 'Mayor cobertura TLB', detail: 'Cada traducción cubre más memoria, aunque el redondeo comienza a desperdiciar más espacio.' }
  return { title: 'Mayor desperdicio por redondeo', detail: 'Hay muy pocas entradas de tabla y gran alcance TLB, pero cada última página puede dejar mucho espacio sin usar.' }
}

export function PageSizeSimulation() {
  const [pageSizeKb, setPageSizeKb] = useState(16)
  const metrics = useMemo(() => calculatePageSizeMetrics(pageSizeKb), [pageSizeKb])
  const message = getTradeoffMessage(pageSizeKb)

  return (
    <section className="space-y-5" aria-label="Simulación de tamaño de página">
      <PageSizeSelector selectedKb={pageSizeKb} onChange={setPageSizeKb} />
      <div className="rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-4" role="status" aria-live="polite"><div className="flex gap-3"><Scale size={19} className="shrink-0 text-amber-300" /><div><p className="font-mono text-xs font-semibold uppercase tracking-wider text-white">{message.title}</p><p className="mt-1 text-sm text-slate-400">{message.detail}</p></div></div></div>
      <ProcessMemoryView metrics={metrics} />
      <div className="grid gap-4 md:grid-cols-3"><FragmentationMeter metrics={metrics} /><PageTableMetrics metrics={metrics} /><TLBCoverage metrics={metrics} /></div>
      <WasteComparison metrics={metrics} />
      <div className="flex gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 text-sm leading-relaxed text-slate-400"><Info size={18} className="mt-0.5 shrink-0 text-cyan" /><p><strong className="text-slate-200">No existe un tamaño perfecto universal.</strong> El punto conveniente depende del tamaño de los procesos, el costo de las entradas, el hardware TLB y el patrón de acceso.</p></div>
      <TanenbaumCalculator />
    </section>
  )
}
