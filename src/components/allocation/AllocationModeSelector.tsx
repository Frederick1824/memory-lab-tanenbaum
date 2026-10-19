import { Globe2, ShieldCheck } from 'lucide-react'
import type { AllocationMode } from '../../types/allocation'

interface AllocationModeSelectorProps {
  mode: AllocationMode
  onChange: (mode: AllocationMode) => void
}

export function AllocationModeSelector({ mode, onChange }: AllocationModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 rounded-xl border border-white/[0.08] bg-black/15 p-1" role="radiogroup" aria-label="Política de asignación">
      <button type="button" role="radio" aria-checked={mode === 'local'} onClick={() => onChange('local')} className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${mode === 'local' ? 'bg-cyan text-ink' : 'text-slate-400 hover:text-white'}`}>
        <ShieldCheck size={16} /> Local
      </button>
      <button type="button" role="radio" aria-checked={mode === 'global'} onClick={() => onChange('global')} className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${mode === 'global' ? 'bg-lime text-ink' : 'text-slate-400 hover:text-white'}`}>
        <Globe2 size={16} /> Global
      </button>
    </div>
  )
}
