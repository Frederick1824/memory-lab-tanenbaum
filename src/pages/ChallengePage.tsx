import { ArrowLeft, CheckCircle2, TerminalSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChallengeGame } from '../components/ChallengeGame'

export function ChallengePage() {
  return (
    <main className="px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan"><ArrowLeft size={16} /> Volver al laboratorio</Link>
        <header className="mb-8 mt-8 border-b border-white/[0.08] pb-7">
          <div className="mb-4 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl border border-lime/20 bg-lime/10 text-lime"><TerminalSquare size={20} /></span><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">Evaluación final</span></div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">Kernel Challenge</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">Un minijuego de cuatro niveles para poner en práctica los conceptos de memoria virtual trabajados durante la exposición.</p>
        </header>

        <ChallengeGame />

        <section className="mt-12 rounded-2xl border border-white/[0.08] bg-panel/60 p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Cierre de la clase</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Cuatro decisiones, un mismo problema</h2>
          <p className="mt-3 leading-relaxed text-slate-400">
            Reparto de marcos, control de carga, tamaño de página y compartición trabajan juntos para equilibrar rendimiento, seguridad y aprovechamiento de la RAM.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              'Repartir marcos según la demanda sin perjudicar al resto.',
              'Evitar thrashing reduciendo la carga cuando la RAM no alcanza.',
              'Elegir un tamaño de página que equilibre tabla y fragmentación.',
              'Compartir memoria y copiar solo cuando una escritura lo requiere.',
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-white/[0.06] bg-black/15 p-4">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-lime" />
                <p className="text-sm leading-relaxed text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
