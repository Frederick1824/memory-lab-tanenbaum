import { Activity, Power } from 'lucide-react'
import { PFF_MAX_THRESHOLD, PFF_MIN_THRESHOLD } from '../../data/allocationSimulation'
import type { AllocationProcess } from '../../types/allocation'

interface PFFMonitorProps {
  enabled: boolean
  processes: AllocationProcess[]
  onToggle: () => void
}

export function PFFMonitor({ enabled, processes, onToggle }: PFFMonitorProps) {
  return (
    <section className={`rounded-2xl border p-5 transition ${enabled ? 'border-lime/25 bg-lime/[0.035]' : 'border-white/[0.08] bg-panel/65'}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
        <div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-lg ${enabled ? 'bg-lime/10 text-lime' : 'bg-white/[0.04] text-slate-500'}`}><Activity size={17} /></span><div><h3 className="font-medium text-white">PFF · Page Fault Frequency</h3><p className="font-mono text-[8px] uppercase tracking-widest text-slate-600">Ajuste dinámico de marcos</p></div></div>
        <button type="button" role="switch" aria-checked={enabled} onClick={onToggle} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[9px] uppercase tracking-wider transition ${enabled ? 'border-lime/30 bg-lime/10 text-lime' : 'border-white/10 text-slate-500 hover:text-white'}`}><Power size={13} /> {enabled ? 'PFF activo' : 'Activar PFF'}</button>
      </div>
      <div className="mt-5 space-y-4">
        {processes.map((process) => {
          const below = process.faultRate < PFF_MIN_THRESHOLD
          const above = process.faultRate > PFF_MAX_THRESHOLD
          return (
            <div key={process.id}>
              <div className="mb-2 flex items-center justify-between"><span className="font-mono text-xs font-semibold text-slate-200">{process.name}</span><span className={`font-mono text-[10px] ${above ? 'text-rose-300' : below ? 'text-amber-300' : 'text-slate-400'}`}>{process.faultRate} fallos/min</span></div>
              <div className="relative h-2 overflow-visible rounded-full bg-white/[0.06]">
                <div className={`h-full rounded-full transition-all duration-300 ${above ? 'bg-rose-400' : below ? 'bg-amber-400' : 'bg-cyan'}`} style={{ width: `${process.faultRate}%` }} />
                <i className="absolute -top-1 h-4 w-px bg-amber-300/70" style={{ left: `${PFF_MIN_THRESHOLD}%` }} title="Umbral mínimo" />
                <i className="absolute -top-1 h-4 w-px bg-rose-300/70" style={{ left: `${PFF_MAX_THRESHOLD}%` }} title="Umbral máximo" />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-5 flex justify-between border-t border-white/[0.07] pt-3 font-mono text-[8px] uppercase tracking-wider text-slate-600"><span>Mínimo: {PFF_MIN_THRESHOLD}</span><span>Zona estable</span><span>Máximo: {PFF_MAX_THRESHOLD}</span></div>
    </section>
  )
}
