import { ArrowLeft, CheckCircle2, UserRound } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { SimulationPlaceholder } from '../components/SimulationPlaceholder'
import { AllocationSimulation } from '../components/allocation/AllocationSimulation'
import { IdCowSimulation } from '../components/thrashing/IdCowSimulation'
import { PageSizeSimulation } from '../components/page-size/PageSizeSimulation'
import { ThrashingSimulation } from '../components/thrashing/ThrashingSimulation'
import { topicById } from '../data/topics'

export function TopicPage({ topicId }: { topicId: string }) {
  const topic = topicById(topicId)
  if (!topic) return <Navigate to="/" replace />
  const Icon = topic.icon

  return (
    <main className="px-5 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan"><ArrowLeft size={16} /> Volver al inicio</Link>
        <header className="mt-10 grid gap-8 border-b border-white/[0.08] pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-4xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan"><Icon size={20} /></span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Módulo {topic.order}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:leading-tight">{topic.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">{topic.detail}</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-panel px-5 py-4">
            <UserRound size={18} className="text-cyan" />
            <div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Presenta</p><p className="mt-0.5 font-medium text-slate-200">{topic.member}</p></div>
          </div>
        </header>

        <section className="mt-12">
          {topic.id === 'thrashing' ? <ThrashingSimulation /> : topic.id === 'local-global' ? <AllocationSimulation /> : topic.id === 'page-size' ? <PageSizeSimulation /> : topic.id === 'id-cow' ? <IdCowSimulation /> : <SimulationPlaceholder />}
        </section>

        <section className="mt-16">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan">// Base conceptual</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Conceptos clave</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {topic.concepts.map((concept, index) => (
              <article key={concept.title} className="rounded-xl border border-white/[0.08] bg-panel/60 p-6">
                <div className="flex items-center justify-between">
                  <CheckCircle2 size={18} className="text-lime" />
                  <span className="font-mono text-[10px] text-slate-700">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-100">{concept.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{concept.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-16 border-t border-white/[0.08] pt-8">
          <Link to="/" className="secondary-button"><ArrowLeft size={16} /> Volver al inicio</Link>
        </div>
      </div>
    </main>
  )
}
