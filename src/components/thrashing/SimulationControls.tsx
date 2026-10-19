import { Minus, Plus, RotateCcw } from 'lucide-react'

interface SimulationControlsProps {
  activeCount: number
  canAdd: boolean
  canRemove: boolean
  onAdd: () => void
  onRemove: () => void
  onReset: () => void
}

export function SimulationControls({ activeCount, canAdd, canRemove, onAdd, onRemove, onReset }: SimulationControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">Carga del sistema</p>
        <p className="mt-1 text-sm text-slate-300">{activeCount} procesos compitiendo por memoria</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="control-button" onClick={onRemove} disabled={!canRemove}><Minus size={15} /> Reducir carga</button>
        <button type="button" className="control-button" onClick={onAdd} disabled={!canAdd}><Plus size={15} /> Aumentar carga</button>
        <button type="button" className="grid size-10 place-items-center rounded-lg border border-white/10 text-slate-500 transition hover:text-white disabled:opacity-40" onClick={onReset} aria-label="Reiniciar simulación"><RotateCcw size={16} /></button>
      </div>
    </div>
  )
}
