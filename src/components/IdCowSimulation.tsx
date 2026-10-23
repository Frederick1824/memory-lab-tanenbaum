import { BookOpen, Copy, RotateCcw, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

const DATA_PAGES = ['D1', 'D2', 'D3']
type ProcessId = 'parent' | 'child'

export function IdCowSimulation() {
  const [privatePages, setPrivatePages] = useState<Record<ProcessId, boolean[]>>({
    parent: DATA_PAGES.map(() => false),
    child: DATA_PAGES.map(() => false),
  })
  const [copiedPages, setCopiedPages] = useState(0)
  const [event, setEvent] = useState('Después de fork(), las páginas de datos se comparten en modo solo lectura.')

  function writePage(process: ProcessId, pageIndex: number) {
    if (privatePages[process][pageIndex]) {
      setEvent(`${process === 'parent' ? 'Padre' : 'Hijo'} escribe en ${DATA_PAGES[pageIndex]}: la página ya es privada y de lectura-escritura.`)
      return
    }

    const otherProcess: ProcessId = process === 'parent' ? 'child' : 'parent'
    const needsCopy = !privatePages[otherProcess][pageIndex]
    setPrivatePages((current) => ({
      ...current,
      [process]: current[process].map((isPrivate, index) => index === pageIndex || isPrivate),
    }))
    if (needsCopy) {
      setCopiedPages((count) => count + 1)
      setEvent(`Fallo de protección en ${DATA_PAGES[pageIndex]}: la MMU detecta la escritura y el kernel copia la página para ${process === 'parent' ? 'el padre' : 'el hijo'}.`)
    } else {
      setEvent(`Fallo de protección en ${DATA_PAGES[pageIndex]}: como ya no hay otro proceso que comparta el marco, el kernel puede habilitar escritura sin copiarlo.`)
    }
  }

  function reset() {
    setPrivatePages({ parent: DATA_PAGES.map(() => false), child: DATA_PAGES.map(() => false) })
    setCopiedPages(0)
    setEvent('Después de fork(), las páginas de datos se comparten en modo solo lectura.')
  }

  const sharedPages = privatePages.parent.filter((isPrivate, index) => !isPrivate && !privatePages.child[index]).length

  return (
    <section className="space-y-5" aria-label="Simulación de espacios I/D, páginas compartidas y Copy-on-Write">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-lime/20 bg-lime/[0.04] p-5">
          <div className="flex items-center gap-2 text-lime"><BookOpen size={18} /><h2 className="font-mono text-xs font-semibold uppercase tracking-wider">Espacios virtuales I / D</h2></div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">Las instrucciones y los datos viven en regiones virtuales independientes. Cada espacio puede tener su propio rango de direcciones y permisos.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-cyan/20 bg-cyan/[0.06] p-3"><p className="font-mono text-[10px] uppercase tracking-widest text-cyan">Espacio I · instrucciones</p><p className="mt-2 text-xs text-slate-300">Código ejecutable · lectura</p></div>
            <div className="rounded-lg border border-amber-300/20 bg-amber-300/[0.05] p-3"><p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Espacio D · datos</p><p className="mt-2 text-xs text-slate-300">Datos del proceso · escritura controlada</p></div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">En arquitecturas con un rango de direcciones limitado, separar I y D permite disponer de rangos independientes. Los permisos de página también ayudan a proteger el código.</p>
        </article>

        <article className="rounded-xl border border-white/[0.08] bg-panel/60 p-5">
          <div className="flex items-center gap-2 text-cyan"><ShieldCheck size={18} /><h2 className="font-mono text-xs font-semibold uppercase tracking-wider">Código compartido</h2></div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">El código reentrante o de texto puro no modifica su contenido durante la ejecución, por eso varios procesos pueden mapear las mismas páginas físicas de solo lectura.</p>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-cyan/15 bg-cyan/[0.04] p-3">
            <div><p className="font-mono text-[10px] uppercase tracking-widest text-cyan">Página física compartida</p><p className="mt-1 text-xs text-slate-300">Código ejecutable · solo lectura</p></div>
            <div className="flex gap-2 font-mono text-[10px] text-slate-400"><span className="rounded border border-white/10 px-2 py-1">Padre</span><span className="rounded border border-white/10 px-2 py-1">Hijo</span></div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">El sistema debe llevar la cuenta de las referencias para conservar las páginas mientras algún proceso las use y liberarlas cuando ya no estén mapeadas.</p>
        </article>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-panel/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <div><p className="font-mono text-xs uppercase tracking-wider text-lime">Copy-on-Write · después de fork()</p><p className="mt-1 text-xs text-slate-500">Escribe en una página del padre o del hijo para observar la copia diferida.</p></div>
          <button type="button" onClick={reset} className="control-button"><RotateCcw size={14} /> Reiniciar</button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          {(['parent', 'child'] as const).map((process) => (
            <article key={process} className="rounded-lg border border-white/[0.08] bg-black/10 p-4">
              <h3 className="text-sm font-semibold text-white">{process === 'parent' ? 'Proceso padre' : 'Proceso hijo'}</h3>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between rounded-md border border-cyan/20 bg-cyan/[0.05] px-3 py-2">
                  <span className="font-mono text-xs text-cyan">I · código compartido</span><span className="text-[10px] uppercase tracking-wider text-slate-500">solo lectura</span>
                </div>
                {DATA_PAGES.map((page, index) => {
                  const isPrivate = privatePages[process][index]
                  const isShared = !privatePages.parent[index] && !privatePages.child[index]
                  return (
                    <div key={page} className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 ${isPrivate ? 'border-lime/25 bg-lime/[0.05]' : 'border-amber-300/20 bg-amber-300/[0.04]'}`}>
                      <div><span className={`font-mono text-xs ${isPrivate ? 'text-lime' : 'text-amber-300'}`}>{page} · datos</span><p className="mt-0.5 text-[10px] text-slate-500">{isPrivate ? 'Marco privado · lectura-escritura' : `Marco ${isShared ? 'compartido' : 'original · solo lectura'}`}</p></div>
                      <button type="button" onClick={() => writePage(process, index)} className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-lime/30 hover:text-lime focus:outline-none focus:ring-2 focus:ring-lime/40">{isPrivate ? 'Escribir' : 'Intentar escribir'}</button>
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-3 border-t border-white/[0.07] p-5 sm:grid-cols-2">
          <div className="flex gap-3 rounded-lg border border-amber-300/15 bg-amber-300/[0.04] p-3" role="status" aria-live="polite"><TriangleAlert size={17} className="mt-0.5 shrink-0 text-amber-300" /><p className="text-xs leading-relaxed text-slate-300">{event}</p></div>
          <div className="flex items-center gap-3 rounded-lg border border-lime/15 bg-lime/[0.04] p-3"><Copy size={17} className="shrink-0 text-lime" /><p className="text-xs leading-relaxed text-slate-300"><strong>{sharedPages}</strong> páginas de datos aún compartidas · <strong>{copiedPages}</strong> copias privadas creadas. La copia ocurre solo cuando una escritura necesita separar una página compartida.</p></div>
        </div>
      </div>
    </section>
  )
}
