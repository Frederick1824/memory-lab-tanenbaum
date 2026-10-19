import { Calculator, Equal, Radical } from 'lucide-react'
import { useMemo, useState } from 'react'
import { calculateOptimalPageKb, formatMemory } from '../../data/pageSizeSimulation'

export function TanenbaumCalculator() {
  const [averageProcessMb, setAverageProcessMb] = useState(64)
  const [entryBytes, setEntryBytes] = useState(8)
  const optimalKb = useMemo(() => calculateOptimalPageKb(averageProcessMb, entryBytes), [averageProcessMb, entryBytes])

  return (
    <section className="relative overflow-hidden rounded-2xl border border-amber-300/20 bg-[#10191d] p-6 sm:p-8">
      <div className="absolute right-0 top-0 size-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-amber-300/[0.06] blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-center">
        <div>
          <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-300"><Calculator size={20} /></span><div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-300">Fórmula de Tanenbaum</p><h3 className="mt-1 text-xl font-semibold text-white">Calculadora de tamaño óptimo</h3></div></div>
          <div className="mt-7 space-y-6">
            <label className="block"><span className="flex justify-between text-sm text-slate-300"><span>Tamaño promedio del proceso (s)</span><strong className="font-mono text-amber-300">{averageProcessMb} MB</strong></span><input type="range" min="16" max="512" step="16" value={averageProcessMb} onChange={(event) => setAverageProcessMb(Number(event.target.value))} className="page-size-range mt-3 w-full" /></label>
            <fieldset><legend className="text-sm text-slate-300">Tamaño de entrada de tabla (e)</legend><div className="mt-3 grid grid-cols-3 gap-2">{[4, 8, 16].map((value) => <button key={value} type="button" onClick={() => setEntryBytes(value)} className={`rounded-lg border py-2 font-mono text-xs transition ${entryBytes === value ? 'border-amber-300 bg-amber-300 text-ink' : 'border-white/10 text-slate-500 hover:text-white'}`}>{value} bytes</button>)}</div></fieldset>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 text-center">
          <div className="flex items-center justify-center gap-3 font-mono text-sm text-slate-400"><span>p</span><Equal size={14} /><Radical size={19} className="text-amber-300" /><span>2 × s × e</span></div>
          <div className="mt-6 border-y border-white/[0.07] py-6"><p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Resultado aproximado</p><p className="mt-2 text-5xl font-semibold tracking-tight text-white">{formatMemory(optimalKb)}</p></div>
          <p className="mt-5 text-xs leading-relaxed text-slate-500">√(2 × {averageProcessMb} MB × {entryBytes} bytes) ≈ {optimalKb.toFixed(1)} KB</p>
        </div>
      </div>
    </section>
  )
}
