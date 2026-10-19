import { Construction, ScanLine } from 'lucide-react'

export function SimulationPlaceholder() {
  return (
    <div className="relative grid min-h-[380px] place-items-center overflow-hidden rounded-2xl border border-dashed border-cyan/25 bg-panel/55 p-8 text-center">
      <div className="simulation-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <ScanLine className="scan-line absolute left-0 top-0 w-full text-cyan/15" size={48} strokeWidth={0.6} aria-hidden="true" />
      <div className="relative max-w-md">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-cyan/20 bg-cyan/10 text-cyan">
          <Construction size={24} />
        </span>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-cyan">Área de simulación</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Simulación interactiva disponible en la próxima etapa</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">Este espacio está dimensionado para incorporar controles, estados de memoria y visualizaciones en tiempo real.</p>
      </div>
    </div>
  )
}
