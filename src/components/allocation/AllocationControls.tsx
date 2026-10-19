import { Activity, MinusCircle, RotateCcw, Sparkles } from 'lucide-react'

interface AllocationControlsProps {
  onFault: () => void
  onIncreaseP1: () => void
  onReduceP3: () => void
  onReset: () => void
}

export function AllocationControls({ onFault, onIncreaseP1, onReduceP3, onReset }: AllocationControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="primary-button" onClick={onFault}><Sparkles size={15} /> Generar fallo de P1</button>
      <button type="button" className="control-button" onClick={onIncreaseP1}><Activity size={15} /> Aumentar demanda de P1</button>
      <button type="button" className="control-button" onClick={onReduceP3}><MinusCircle size={15} /> Reducir demanda de P3</button>
      <button type="button" className="grid size-10 place-items-center rounded-lg border border-white/10 text-slate-500 transition hover:text-white" onClick={onReset} aria-label="Reiniciar simulación"><RotateCcw size={16} /></button>
    </div>
  )
}
