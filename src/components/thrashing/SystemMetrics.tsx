import { Cpu, DatabaseZap, HardDrive, Layers3, UsersRound } from 'lucide-react'
import type { SystemMetrics as Metrics, SimulationPhase } from '../../types/simulation'

interface SystemMetricsProps {
  metrics: Metrics
  phase: SimulationPhase
}

export function SystemMetrics({ metrics, phase }: SystemMetricsProps) {
  const items = [
    { label: 'Uso de CPU', value: metrics.cpuUsage, suffix: '%', Icon: Cpu, danger: phase === 'thrashing' },
    { label: 'Actividad de disco', value: metrics.diskActivity, suffix: '%', Icon: HardDrive, danger: phase === 'thrashing' },
    { label: 'Fallos de página', value: metrics.pageFaults, suffix: '/s', Icon: DatabaseZap, danger: phase === 'thrashing' },
    { label: 'Procesos activos', value: metrics.activeProcesses, suffix: '', Icon: UsersRound, danger: false },
    { label: 'Marcos utilizados', value: metrics.usedFrames, suffix: `/${metrics.totalFrames}`, Icon: Layers3, danger: false },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-label="Métricas del sistema">
      {items.map(({ label, value, suffix, Icon, danger }) => (
        <div key={label} className={`rounded-xl border p-4 ${danger ? 'border-rose-400/25 bg-rose-400/[0.06]' : 'border-white/[0.08] bg-black/10'}`}>
          <div className="flex items-center gap-2 text-slate-500"><Icon size={14} /><span className="font-mono text-[8px] uppercase tracking-wider">{label}</span></div>
          <p className={`mt-3 text-2xl font-semibold ${danger ? 'text-rose-300' : 'text-white'}`}>{value}<span className="ml-0.5 text-xs text-slate-500">{suffix}</span></p>
          {typeof suffix === 'string' && suffix === '%' && <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full rounded-full transition-all duration-500 ${danger ? 'bg-rose-400' : 'bg-cyan'}`} style={{ width: `${value}%` }} /></div>}
        </div>
      ))}
    </div>
  )
}
