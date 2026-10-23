import { ArrowLeft, TerminalSquare } from 'lucide-react'
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
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">Un minijuego de cuatro niveles para poner en práctica los conceptos de memoria virtual, inspirado en Modern Operating Systems de Tanenbaum.</p>
        </header>
        <ChallengeGame />
      </div>
    </main>
  )
}
