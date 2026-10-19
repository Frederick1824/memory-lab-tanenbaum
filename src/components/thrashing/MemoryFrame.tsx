import type { MemoryFrame as MemoryFrameType, Process, SimulationPhase } from '../../types/simulation'

const colors: Record<Process['color'], string> = {
  cyan: 'border-cyan/45 bg-cyan/15 text-cyan',
  violet: 'border-violet-400/45 bg-violet-400/15 text-violet-300',
  amber: 'border-amber-400/45 bg-amber-400/15 text-amber-300',
  lime: 'border-lime/45 bg-lime/15 text-lime',
  rose: 'border-rose-400/45 bg-rose-400/15 text-rose-300',
  blue: 'border-blue-400/45 bg-blue-400/15 text-blue-300',
}

interface MemoryFrameProps {
  frame: MemoryFrameType
  process?: Process
  phase: SimulationPhase
}

export function MemoryFrame({ frame, process, phase }: MemoryFrameProps) {
  const occupied = Boolean(process)
  return (
    <div
      className={`relative flex min-h-16 flex-col justify-between rounded-lg border p-2.5 transition-all duration-300 ${
        process ? colors[process.color] : 'border-white/[0.08] bg-white/[0.025] text-slate-700'
      } ${phase === 'thrashing' && occupied ? 'thrashing-frame' : ''}`}
      aria-label={occupied ? `Marco ${frame.id}, ${process?.name}, página ${frame.pageNumber}` : `Marco ${frame.id}, libre`}
    >
      <span className="font-mono text-[8px] uppercase tracking-widest opacity-60">F{String(frame.id).padStart(2, '0')}</span>
      <span className="font-mono text-xs font-semibold">{process?.name ?? 'LIBRE'}</span>
    </div>
  )
}
