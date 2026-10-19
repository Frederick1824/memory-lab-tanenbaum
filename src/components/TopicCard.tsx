import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Topic } from '../types/topic'

const accents = {
  cyan: 'text-cyan border-cyan/20 bg-cyan/10 group-hover:border-cyan/40',
  violet: 'text-violet-300 border-violet-400/20 bg-violet-400/10 group-hover:border-violet-400/40',
  amber: 'text-amber-300 border-amber-400/20 bg-amber-400/10 group-hover:border-amber-400/40',
  lime: 'text-lime border-lime/20 bg-lime/10 group-hover:border-lime/40',
}

export function TopicCard({ topic }: { topic: Topic }) {
  const Icon = topic.icon
  return (
    <article className="group flex min-h-72 flex-col rounded-2xl border border-white/[0.08] bg-panel/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-panel">
      <div className="flex items-start justify-between">
        <span className={`grid size-11 place-items-center rounded-xl border transition ${accents[topic.accent]}`}><Icon size={21} /></span>
        <span className="font-mono text-xs tracking-[0.2em] text-slate-600">MODULE_{topic.order}</span>
      </div>
      <h3 className="mt-7 text-xl font-semibold text-white">{topic.shortTitle}</h3>
      <p className="mt-3 flex-1 leading-relaxed text-slate-400">{topic.description}</p>
      <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{topic.member}</span>
        <Link to={topic.path} className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 transition group-hover:text-cyan">
          Entrar <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  )
}
