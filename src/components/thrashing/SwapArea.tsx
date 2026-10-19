import { Database, MoveDown } from 'lucide-react'
import { ProcessCard } from './ProcessCard'
import type { Process } from '../../types/simulation'

export function SwapArea({ processes }: { processes: Process[] }) {
  return (
    <section className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.025] p-5" aria-label="Área de swap en disco">
      <div className="flex items-center gap-3 border-b border-white/[0.07] pb-4">
        <span className="grid size-9 place-items-center rounded-lg bg-amber-400/10 text-amber-300"><Database size={17} /></span>
        <div><h3 className="font-medium text-white">Swap / Disco</h3><p className="font-mono text-[8px] uppercase tracking-widest text-slate-600">Procesos suspendidos</p></div>
      </div>
      {processes.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {processes.map((process) => <ProcessCard key={process.id} process={process} residentFrames={0} swapped />)}
        </div>
      ) : (
        <div className="grid min-h-32 place-items-center text-center">
          <div><MoveDown className="mx-auto text-slate-700" size={20} /><p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-slate-700">Sin procesos suspendidos</p></div>
        </div>
      )}
    </section>
  )
}
