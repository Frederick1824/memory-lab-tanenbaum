import { AlertTriangle, CheckCircle2, ShieldAlert, Workflow } from 'lucide-react'
import type { SimulationPhase } from '../../types/simulation'

const content = {
  normal: {
    title: 'Sistema estable',
    description: 'Los procesos disponen de marcos suficientes. La CPU puede dedicar la mayor parte del tiempo al trabajo útil.',
    style: 'border-lime/20 bg-lime/[0.06] text-lime',
    Icon: CheckCircle2,
  },
  pressure: {
    title: 'Presión de memoria detectada',
    description: 'La memoria libre disminuye. Crecen los fallos de página y el disco comienza a intervenir con mayor frecuencia.',
    style: 'border-amber-400/25 bg-amber-400/[0.07] text-amber-300',
    Icon: ShieldAlert,
  },
  thrashing: {
    title: 'THRASHING DETECTADO',
    description: 'Los procesos compiten constantemente por marcos de memoria. El sistema pasa más tiempo intercambiando páginas que ejecutando trabajo útil.',
    style: 'border-rose-400/35 bg-rose-400/[0.08] text-rose-300',
    Icon: AlertTriangle,
  },
  stabilized: {
    title: 'Sistema estabilizado',
    description: 'El planificador a mediano plazo reduce el grado de multiprogramación suspendiendo procesos completos y liberando memoria física.',
    style: 'border-cyan/25 bg-cyan/[0.07] text-cyan',
    Icon: Workflow,
  },
} satisfies Record<SimulationPhase, { title: string; description: string; style: string; Icon: typeof AlertTriangle }>

export function ThrashingAlert({ phase }: { phase: SimulationPhase }) {
  const { title, description, style, Icon } = content[phase]
  return (
    <div className={`rounded-xl border p-5 transition-all duration-300 ${style}`} role={phase === 'thrashing' ? 'alert' : 'status'} aria-live="polite">
      <div className="flex gap-4">
        <Icon className="mt-0.5 shrink-0" size={21} />
        <div><h3 className="font-mono text-sm font-semibold tracking-wide">{title}</h3><p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-300">{description}</p></div>
      </div>
    </div>
  )
}
