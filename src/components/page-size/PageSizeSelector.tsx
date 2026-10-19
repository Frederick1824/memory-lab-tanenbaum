import { Ruler } from 'lucide-react'
import { PAGE_SIZE_OPTIONS } from '../../data/pageSizeSimulation'

interface PageSizeSelectorProps {
  selectedKb: number
  onChange: (sizeKb: number) => void
}

export function PageSizeSelector({ selectedKb, onChange }: PageSizeSelectorProps) {
  return (
    <section className="rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-400/[0.07] to-transparent p-5">
      <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><Ruler size={19} /></span><div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-300">Control principal</p><h3 className="mt-0.5 font-medium text-white">Tamaño de página</h3></div></div>
      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Tamaño de página">
        {PAGE_SIZE_OPTIONS.map((option) => (
          <button key={option.sizeKb} type="button" role="radio" aria-checked={selectedKb === option.sizeKb} onClick={() => onChange(option.sizeKb)} className={`relative rounded-xl border px-2 py-3 font-mono text-xs transition ${selectedKb === option.sizeKb ? 'border-amber-300 bg-amber-300 text-ink shadow-lg shadow-amber-300/10' : 'border-white/[0.08] bg-black/10 text-slate-500 hover:border-amber-300/25 hover:text-white'}`}>
            {option.label}
            {selectedKb === option.sizeKb ? <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-amber-300" /> : null}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-between font-mono text-[8px] uppercase tracking-widest text-slate-600"><span>Más páginas</span><span>Menos páginas</span></div>
    </section>
  )
}
