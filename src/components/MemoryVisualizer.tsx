import { Activity, Cpu, HardDrive } from 'lucide-react'
import { MemoryBlock } from './MemoryBlock'

const cells = [
  ['P1', 'active'], ['P1', 'active'], ['P2', 'shared'], ['P2', 'shared'],
  ['OS', 'active'], ['OS', 'active'], ['FREE', 'idle'], ['P3', 'shared'],
  ['P3', 'shared'], ['FREE', 'idle'], ['P1', 'active'], ['FREE', 'idle'],
] as const

export function MemoryVisualizer() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-12 rounded-full bg-cyan/10 blur-3xl" aria-hidden="true" />
      <div className="tech-panel relative overflow-hidden rounded-2xl border border-white/10 bg-panel/90 p-4 shadow-2xl shadow-black/40 sm:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-white/[0.07] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5"><i className="size-2 rounded-full bg-cyan" /><i className="size-2 rounded-full bg-lime" /><i className="size-2 rounded-full bg-slate-700" /></div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Physical memory map</span>
          </div>
          <span className="flex items-center gap-2 font-mono text-[10px] text-lime"><Activity size={12} /> ONLINE</span>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {cells.map(([label, status], index) => <MemoryBlock key={index} label={label} status={status} delay={index * 70} />)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/[0.07] bg-black/15 p-3">
            <Cpu className="mb-2 text-cyan" size={16} />
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Marcos activos</p>
            <p className="mt-1 text-xl font-medium text-white">09 <span className="text-xs text-slate-500">/ 12</span></p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-black/15 p-3">
            <HardDrive className="mb-2 text-lime" size={16} />
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Uso de RAM</p>
            <p className="mt-1 text-xl font-medium text-white">75<span className="text-xs text-slate-500">%</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
