import { CircleDot, PauseCircle } from 'lucide-react'
import type { Process } from '../../types/simulation'

interface ProcessCardProps {
  process: Process
  residentFrames: number
  swapped?: boolean
}

export function ProcessCard({ process, residentFrames, swapped = false }: ProcessCardProps) {
  return (
    <article className={`rounded-xl border p-4 transition-all ${swapped ? 'border-amber-400/20 bg-amber-400/[0.06]' : 'border-white/[0.08] bg-black/10'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {swapped ? <PauseCircle size={14} className="text-amber-300" /> : <CircleDot size={14} className="text-lime" />}
          <span className="font-mono text-sm font-semibold text-white">{process.name}</span>
        </div>
        <span className={`rounded px-2 py-1 font-mono text-[8px] uppercase tracking-widest ${swapped ? 'bg-amber-400/10 text-amber-300' : 'bg-lime/10 text-lime'}`}>
          {swapped ? 'Suspendido' : 'Activo'}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div><p className="font-mono text-[8px] uppercase tracking-wider text-slate-600">Demanda</p><p className="mt-1 text-sm text-slate-300">{process.frameDemand} marcos</p></div>
        {!swapped && <p className="font-mono text-[10px] text-slate-500">{residentFrames}/{process.frameDemand} residentes</p>}
      </div>
    </article>
  )
}
