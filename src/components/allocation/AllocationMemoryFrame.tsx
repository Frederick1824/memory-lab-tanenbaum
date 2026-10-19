import type { AllocationFrame, AllocationProcess, AllocationMode } from '../../types/allocation'

const frameColors: Record<AllocationProcess['color'], string> = {
  cyan: 'border-cyan/40 bg-cyan/15 text-cyan',
  violet: 'border-violet-400/40 bg-violet-400/15 text-violet-300',
  amber: 'border-amber-400/40 bg-amber-400/15 text-amber-300',
  lime: 'border-lime/40 bg-lime/15 text-lime',
  rose: 'border-rose-400/40 bg-rose-400/15 text-rose-300',
  blue: 'border-blue-400/40 bg-blue-400/15 text-blue-300',
}

interface AllocationMemoryFrameProps {
  frame: AllocationFrame
  owner?: AllocationProcess
  mode: AllocationMode
  highlightedProcessIds: AllocationProcess['id'][]
  highlightedFrameId: number | null
}

export function AllocationMemoryFrame({ frame, owner, mode, highlightedProcessIds, highlightedFrameId }: AllocationMemoryFrameProps) {
  const isHighlightedOwner = owner ? highlightedProcessIds.includes(owner.id) : false
  const hasHighlight = highlightedProcessIds.length > 0
  const shouldDim = mode === 'local' && hasHighlight && !isHighlightedOwner
  const isMoved = highlightedFrameId === frame.id

  return (
    <div className={`relative flex min-h-20 flex-col justify-between rounded-lg border p-3 transition-all duration-300 ${owner ? frameColors[owner.color] : 'border-dashed border-white/10 bg-white/[0.02] text-slate-700'} ${shouldDim ? 'opacity-30' : 'opacity-100'} ${isMoved ? 'ring-2 ring-lime ring-offset-2 ring-offset-panel' : ''}`} aria-label={owner ? `Marco ${frame.id}, ${owner.name}, página ${frame.page}` : `Marco ${frame.id}, libre`}>
      <span className="font-mono text-[8px] uppercase tracking-widest opacity-60">F{String(frame.id).padStart(2, '0')}</span>
      <div><p className="font-mono text-sm font-semibold">{owner?.name ?? 'LIBRE'}</p><p className="mt-0.5 font-mono text-[8px] opacity-60">{frame.page ? `PÁG ${frame.page}` : 'DISPONIBLE'}</p></div>
    </div>
  )
}
