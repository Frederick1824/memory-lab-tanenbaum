import { Activity, Layers3 } from 'lucide-react'
import type { AllocationProcess } from '../../types/allocation'

interface ProcessMemoryPanelProps {
  process: AllocationProcess
  frameCount: number
  isHighlighted: boolean
}

export function ProcessMemoryPanel({ process, frameCount, isHighlighted }: ProcessMemoryPanelProps) {
  return (
    <article className={`rounded-xl border p-4 transition ${isHighlighted ? 'border-cyan/35 bg-cyan/[0.06]' : 'border-white/[0.08] bg-black/10'}`}>
      <div className="flex items-center justify-between"><span className="font-mono text-base font-semibold text-white">{process.name}</span><span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-widest text-slate-500"><Activity size={12} /> activo</span></div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div><p className="font-mono text-[8px] uppercase tracking-wider text-slate-600">Marcos</p><p className="mt-1 flex items-center gap-2 text-xl font-semibold text-white"><Layers3 size={15} className="text-cyan" />{frameCount}</p></div>
        <div><p className="font-mono text-[8px] uppercase tracking-wider text-slate-600">Fallos</p><p className="mt-1 text-xl font-semibold text-white">{process.pageFaults}</p></div>
      </div>
    </article>
  )
}
