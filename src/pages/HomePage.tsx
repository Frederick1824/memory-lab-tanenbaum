import { ArrowRight, Braces, CircleDot, MonitorUp, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MemoryVisualizer } from '../components/MemoryVisualizer'
import { SectionHeader } from '../components/SectionHeader'
import { TopicCard } from '../components/TopicCard'
import { topics } from '../data/topics'

export function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden px-5 pb-24 pt-20 sm:pt-28 lg:px-8 lg:pb-32">
        <div className="hero-glow absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/[0.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-lime">
              <CircleDot size={12} className="animate-pulse" /> Laboratorio online
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.8rem] lg:leading-[0.93]">
              Memory <span className="text-gradient">Lab</span>
            </h1>
            <p className="mt-6 max-w-xl text-xl font-medium leading-relaxed text-slate-200 sm:text-2xl">La memoria no es un espacio. Es una decisión constante.</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Un laboratorio visual para explorar cómo un sistema operativo asigna, protege, comparte y recupera su recurso más disputado.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#modulos" className="primary-button group">
                Iniciar laboratorio <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </a>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-600">4 módulos · 4 simulaciones · 1 desafío</span>
            </div>
          </div>
          <MemoryVisualizer />
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-white/[0.018] px-5 py-5 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 sm:grid-cols-4">
          {[
            [MonitorUp, 'Visual', 'Conceptos proyectables'],
            [Braces, 'Modular', 'Un tema por integrante'],
            [ShieldCheck, 'Fundamentos', 'Basado en Tanenbaum'],
            [CircleDot, 'Interactivo', 'Simulaciones en vivo'],
          ].map(([Icon, title, caption]) => {
            const ItemIcon = Icon as typeof MonitorUp
            return (
              <div key={title as string} className="flex items-center gap-3 py-2">
                <ItemIcon size={17} className="shrink-0 text-cyan" />
                <div><p className="text-sm font-medium text-slate-200">{title as string}</p><p className="mt-0.5 text-xs text-slate-600">{caption as string}</p></div>
              </div>
            )
          })}
        </div>
      </section>

      <section id="modulos" className="scroll-mt-24 px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Mapa del laboratorio"
            title="Cuatro formas de mirar la memoria"
            description="Cada módulo aísla una decisión crítica del sistema operativo. Recorré el circuito completo en orden o entrá directamente al tema que quieras explorar."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan/[0.08] to-lime/[0.03] p-7 sm:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-lime">Kernel Challenge</p>
              <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">¿El concepto quedó en memoria?</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-slate-400">Cuatro retos interactivos para poner a prueba decisiones sobre thrashing, tamaño de página, Copy-on-Write y memoria virtual.</p>
            </div>
            <Link to="/kernel-challenge" className="secondary-button">Iniciar desafío <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
