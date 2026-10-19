interface MemoryBlockProps {
  label?: string
  status?: 'active' | 'shared' | 'idle'
  delay?: number
}

export function MemoryBlock({ label, status = 'idle', delay = 0 }: MemoryBlockProps) {
  const styles = {
    active: 'border-cyan/45 bg-cyan/15 text-cyan',
    shared: 'border-lime/40 bg-lime/10 text-lime',
    idle: 'border-white/10 bg-white/[0.035] text-slate-600',
  }

  return (
    <div
      className={`memory-cell grid min-h-14 place-items-center rounded-md border font-mono text-[10px] tracking-widest ${styles[status]}`}
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      {label ?? 'FREE'}
    </div>
  )
}
