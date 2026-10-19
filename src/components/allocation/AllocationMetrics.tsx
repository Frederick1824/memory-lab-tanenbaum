import { Gauge, Layers3, Shield, Zap } from 'lucide-react'
import type { AllocationMode, AllocationProcess } from '../../types/allocation'

interface AllocationMetricsProps {
  mode: AllocationMode
  processes: AllocationProcess[]
  usedFrames: number
  totalFrames: number
}

export function AllocationMetrics({ mode, processes, usedFrames, totalFrames }: AllocationMetricsProps) {
  const totalFaults = processes.reduce((sum, process) => sum + process.pageFaults, 0)
  const items = [
    { label: 'Marcos asignados', value: `${usedFrames}/${totalFrames}`, Icon: Layers3 },
    { label: 'Fallos acumulados', value: totalFaults, Icon: Zap },
    { label: 'Estabilidad', value: mode === 'local' ? 'Alta' : 'Adaptativa', Icon: Shield },
    { label: 'Uso de RAM', value: `${Math.round((usedFrames / totalFrames) * 100)}%`, Icon: Gauge },
  ]
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{items.map(({ label, value, Icon }) => <div key={label} className="rounded-xl border border-white/[0.08] bg-black/10 p-4"><div className="flex items-center gap-2 text-slate-500"><Icon size={14} /><span className="font-mono text-[8px] uppercase tracking-wider">{label}</span></div><p className="mt-3 text-xl font-semibold text-white">{value}</p></div>)}</div>
}
