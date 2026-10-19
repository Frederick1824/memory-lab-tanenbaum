import { ArrowLeft, LockKeyhole, TerminalSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ChallengePage() {
  return (
    <main className="grid min-h-[calc(100vh-129px)] place-items-center px-5 py-20 lg:px-8">
      <div className="mx-auto w-full max-w-3xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl border border-lime/20 bg-lime/10 text-lime"><TerminalSquare size={28} /></span>
        <p className="mt-7 font-mono text-xs uppercase tracking-[0.24em] text-lime">Evaluación final</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">Kernel Challenge</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-400">El desafío interactivo se habilitará cuando todos los módulos estén completos.</p>
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/[0.08] bg-panel/70 p-8">
          <LockKeyhole className="mx-auto text-slate-600" size={24} />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Módulo bloqueado · próxima etapa</p>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-1/4 rounded-full bg-gradient-to-r from-cyan to-lime" /></div>
          <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-700"><span>Base visual</span><span>25%</span></div>
        </div>
        <Link to="/" className="secondary-button mt-10"><ArrowLeft size={16} /> Volver al laboratorio</Link>
      </div>
    </main>
  )
}
