import { ArrowRight, Check, CircleDot, Copy, Cpu, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { challengeQuestions } from '../data/challengeQuestions'
import { supabase } from '../lib/supabase'

const RANKING_KEY = 'memory_lab_ranking_v1'
const PAGE_SIZES = [
  { bytes: 1024, label: '1 KB' },
  { bytes: 2048, label: '2 KB' },
  { bytes: 4096, label: '4 KB' },
  { bytes: 8192, label: '8 KB' },
  { bytes: 16384, label: '16 KB' },
]
const COW_CHALLENGES = [
  { actor: 'Hijo', action: 'lee', page: 1, question: 'El hijo lee la página P1 compartida. ¿El kernel debe crear una copia física?' },
  { actor: 'Padre', action: 'escribe', page: 2, question: 'Padre e hijo comparten P2. El padre intenta escribir. ¿Se debe crear una copia?' },
  { actor: 'Hijo', action: 'escribe', page: 2, question: 'Después de la escritura del padre, el hijo conserva la referencia original de P2. ¿Hace falta duplicarla para poder escribir?' },
  { actor: 'Hijo', action: 'escribe', page: 3, question: 'El hijo intenta escribir por primera vez sobre la página P3 compartida. ¿Se debe crear una copia?' },
  { actor: 'Padre', action: 'lee', page: 0, question: 'El padre solamente lee la página P0 compartida. ¿Hace falta crear una copia?' },
  { actor: 'Hijo', action: 'escribe', page: 1, question: 'La página P1 sigue compartida y el hijo intenta escribir. ¿Se debe crear una copia privada?' },
]
const PROCESS_COLORS = ['bg-cyan', 'bg-fuchsia-400', 'bg-amber-300', 'bg-emerald-400', 'bg-violet-400', 'bg-sky-400']
const LETTERS = ['A', 'B', 'C', 'D']

interface ProcessState {
  id: number
  workingSet: number
  active: boolean
}

interface RankingEntry {
  id: string
  name: string
  score: number
  date: string
}

interface PageSizeScenario {
  bytes: number
  entryBytes: number
}

type Stage = 'intro' | 'thrashing' | 'thrashing-result' | 'page-size' | 'cow' | 'cow-feedback' | 'quiz' | 'quiz-feedback' | 'result'
type CowMapping = 'shared' | 'exclusive' | 'private'

function shuffle<T>(items: T[]) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

function createPageSizeScenarios(): PageSizeScenario[] {
  return [
    { bytes: 524288, entryBytes: 8 },
    { bytes: 2097152, entryBytes: 8 },
    { bytes: 8388608, entryBytes: 8 },
  ]
}

function createInitialCowMappings(): CowMapping[][] {
  return Array.from({ length: 4 }, () => ['shared', 'shared'] as CowMapping[])
}

function getCowMappingLabel(mapping: CowMapping) {
  if (mapping === 'private') return 'Privada · lectura/escritura'
  if (mapping === 'exclusive') return 'Única referencia · solo lectura'
  return 'Compartida · solo lectura'
}

function normalizeRanking(entries: RankingEntry[]) {
  const bestByName = new Map<string, RankingEntry>()
  for (const entry of entries) {
    const key = entry.name.trim().toLowerCase()
    const current = bestByName.get(key)
    if (!current || entry.score > current.score) bestByName.set(key, entry)
  }
  return [...bestByName.values()].sort((a, b) => b.score - a.score).slice(0, 10)
}

function readRanking(): RankingEntry[] {
  const stored = localStorage.getItem(RANKING_KEY)
  if (!stored) return []
  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed)) throw new Error('El ranking guardado no tiene un formato válido.')

  return parsed
    .filter((entry): entry is RankingEntry => Boolean(
      entry &&
      typeof entry.name === 'string' &&
      entry.name.trim() &&
      Number.isFinite(entry.score) &&
      entry.score >= 0,
    ))
    .map((entry) => ({
      id: typeof entry.id === 'string' ? entry.id : '',
      name: entry.name.trim().slice(0, 20),
      score: Math.round(entry.score),
      date: typeof entry.date === 'string' ? entry.date : '',
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

async function fetchSharedRanking(): Promise<RankingEntry[]> {
  const { data, error } = await supabase
    .from('scores')
    .select('id, name, score, created_at')
    .order('score', { ascending: false })
    .limit(100)

  if (error) throw error

  return normalizeRanking((data ?? []).map((entry) => ({
    id: String(entry.id),
    name: String(entry.name).trim().slice(0, 20),
    score: Math.round(Number(entry.score)),
    date: entry.created_at ? new Date(entry.created_at).toLocaleDateString() : '',
  })))
}

async function saveSharedScore(name: string, score: number) {
  const { error } = await supabase.from('scores').insert({ name, score })
  if (error) throw error
}

function getPageSizeMetrics(pageSize: number, segmentSize: number, entryBytes: number) {
  const tableOverhead = (segmentSize / pageSize) * entryBytes
  const fragmentation = pageSize / 2
  return { tableOverhead, fragmentation, total: tableOverhead + fragmentation }
}

function formatBytes(bytes: number) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${Math.round(bytes)} B`
}

function getProcessStats(processes: ProcessState[]) {
  const active = processes.filter((process) => process.active)
  const demand = active.reduce((sum, process) => sum + process.workingSet, 0)
  let cpu = active.length ? Math.round(100 * (1 - Math.pow(0.35, active.length))) : 0
  if (demand > 16) cpu = Math.round(cpu * Math.pow(16 / demand, 3))
  return { demand, cpu, thrashing: demand > 16 }
}

function getOptimalPageIndex(segmentSize: number, entryBytes: number) {
  const optimalSize = Math.sqrt(2 * segmentSize * entryBytes)
  return PAGE_SIZES.reduce((bestIndex, size, index) => (
    Math.abs(size.bytes - optimalSize) < Math.abs(PAGE_SIZES[bestIndex].bytes - optimalSize) ? index : bestIndex
  ), 0)
}

function ScorePill({ score }: { score: number }) {
  return <span className="rounded-lg border border-white/[0.08] bg-black/20 px-3 py-1.5 font-mono text-xs text-lime">{score} pts</span>
}

function LevelHeader({ level, title, score, subtitle }: { level: number; title: string; score: number; subtitle: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-panel/70 p-4">
      <div><span className="font-mono text-[10px] uppercase tracking-widest text-lime">Nivel {level} de 4 · {subtitle}</span><h2 className="mt-1 text-xl font-semibold text-white">{title}</h2></div>
      <ScorePill score={score} />
    </header>
  )
}

export function ChallengeGame() {
  const [stage, setStage] = useState<Stage>('intro')
  const [name, setName] = useState('')
  const [score, setScore] = useState(0)
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [storageError, setStorageError] = useState('')
  const [loadState, setLoadState] = useState({ processes: [] as ProcessState[], seconds: 0, goodSeconds: 0 })
  const { processes, seconds, goodSeconds } = loadState
  const [pageRounds, setPageRounds] = useState<PageSizeScenario[]>(createPageSizeScenarios)
  const [pageRound, setPageRound] = useState(0)
  const [pageSizeIndex, setPageSizeIndex] = useState(2)
  const [pageRoundScore, setPageRoundScore] = useState(0)
  const [pageFeedback, setPageFeedback] = useState<{ optimal: boolean; earned: number; theoretical: number; nearest: string } | null>(null)
  const [cowStep, setCowStep] = useState(0)
  const [cowMappings, setCowMappings] = useState<CowMapping[][]>(createInitialCowMappings)
  const [cowCopies, setCowCopies] = useState(0)
  const [cowScore, setCowScore] = useState(0)
  const [cowFeedback, setCowFeedback] = useState<{ correct: boolean; copied: boolean; action: string; fault: boolean } | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [questionScore, setQuestionScore] = useState(0)
  const [questionFeedback, setQuestionFeedback] = useState<{ correct: boolean; earned: number; selected: number } | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState(() => Date.now())

  useEffect(() => {
    let active = true

    async function loadRanking() {
      try {
        const sharedRanking = await fetchSharedRanking()
        if (active) {
          setRanking(sharedRanking)
          setStorageError('')
        }
      } catch {
        try {
          const localRanking = readRanking()
          if (active) {
            setRanking(localRanking)
            setStorageError('No se pudo conectar al ranking compartido. Mostrando el ranking local de este navegador.')
          }
        } catch {
          if (active) setStorageError('No se pudo cargar el ranking compartido ni el ranking local.')
        }
      }
    }

    void loadRanking()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (stage !== 'thrashing') return
    const timer = window.setInterval(() => {
      setLoadState((current) => {
        const nextSeconds = Math.min(30, current.seconds + 1)
        const nextProcesses = nextSeconds % 5 === 0 && current.processes.length < 6
          ? [...current.processes, { id: current.processes.length, workingSet: 3 + Math.floor(Math.random() * 3), active: true }]
          : current.processes
        const { cpu } = getProcessStats(nextProcesses)
        return {
          seconds: nextSeconds,
          goodSeconds: current.goodSeconds + (cpu >= 70 ? 1 : 0),
          processes: nextProcesses,
        }
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [stage])

  useEffect(() => {
    if (stage === 'thrashing' && seconds >= 30) setStage('thrashing-result')
  }, [seconds, stage])

  const processStats = useMemo(() => getProcessStats(processes), [processes])
  const currentSegment = pageRounds[pageRound]
  const pageMetrics = getPageSizeMetrics(PAGE_SIZES[pageSizeIndex].bytes, currentSegment.bytes, currentSegment.entryBytes)
  const currentChallenge = COW_CHALLENGES[cowStep]
  const currentQuestion = challengeQuestions[questionIndex]

  function beginGame() {
    setScore(0)
    setLoadState({
      seconds: 0,
      goodSeconds: 0,
      processes: [
        { id: 0, workingSet: 4, active: true },
        { id: 1, workingSet: 5, active: true },
      ],
    })
    setPageRound(0)
    setPageRoundScore(0)
    setPageRounds(createPageSizeScenarios())
    setPageSizeIndex(2)
    setPageFeedback(null)
    setCowStep(0)
    setCowMappings(createInitialCowMappings())
    setCowCopies(0)
    setCowScore(0)
    setCowFeedback(null)
    setQuestionIndex(0)
    setQuestionScore(0)
    setQuestionFeedback(null)
    setQuestionStartTime(Date.now())
    setStorageError('')
    setStage('thrashing')
  }

  function toggleProcess(id: number) {
    setLoadState((current) => ({
      ...current,
      processes: current.processes.map((process) => process.id === id ? { ...process, active: !process.active } : process),
    }))
  }

  function advanceFromThrashing() {
    setScore((current) => current + Math.min(300, goodSeconds * 10))
    setStage('page-size')
  }

  function confirmPageSize() {
    if (pageFeedback) return
    const optimalIndex = getOptimalPageIndex(currentSegment.bytes, currentSegment.entryBytes)
    const optimalSize = Math.sqrt(2 * currentSegment.bytes * currentSegment.entryBytes)
    const optimal = pageSizeIndex === optimalIndex
    const earned = optimal ? 100 : 40
    setPageRoundScore((current) => current + earned)
    setPageFeedback({
      optimal,
      earned,
      theoretical: optimalSize / 1024,
      nearest: PAGE_SIZES[optimalIndex].label,
    })
  }

  function advancePageRound() {
    if (pageRound < pageRounds.length - 1) {
      setPageRound((current) => current + 1)
      setPageSizeIndex(2)
      setPageFeedback(null)
      return
    }
    setScore((current) => current + pageRoundScore)
    setStage('cow')
  }

  function answerCow(userSaysCopy: boolean) {
    if (cowFeedback) return
    const actorIndex = currentChallenge.actor === 'Padre' ? 0 : 1
    const otherIndex = actorIndex === 0 ? 1 : 0
    const actorMapping = cowMappings[currentChallenge.page][actorIndex]
    const otherMapping = cowMappings[currentChallenge.page][otherIndex]
    const isWrite = currentChallenge.action === 'escribe'
    const shouldCopy = isWrite && actorMapping === 'shared' && otherMapping === 'shared'
    const correct = userSaysCopy === shouldCopy
    if (correct) setCowScore((current) => current + 50)
    if (shouldCopy) setCowCopies((current) => current + 1)

    if (isWrite && actorMapping !== 'private') {
      setCowMappings((current) => current.map((mappings, pageIndex) => {
        if (pageIndex !== currentChallenge.page) return mappings
        const updated: CowMapping[] = [...mappings]
        updated[actorIndex] = 'private'
        if (shouldCopy) updated[otherIndex] = 'exclusive'
        return updated
      }))
    }
    setCowFeedback({ correct, copied: shouldCopy, action: currentChallenge.action, fault: isWrite && actorMapping !== 'private' })
    setStage('cow-feedback')
  }

  function advanceCow() {
    if (cowStep < COW_CHALLENGES.length - 1) {
      setCowStep((current) => current + 1)
      setCowFeedback(null)
      setStage('cow')
      return
    }
    setScore((current) => current + cowScore)
    setQuestionIndex(0)
    setQuestionScore(0)
    setQuestionStartTime(Date.now())
    setStage('quiz')
  }

  function answerQuestion(selected: number) {
    if (questionFeedback) return
    const correct = selected === currentQuestion.answer
    const elapsedSeconds = Math.floor((Date.now() - questionStartTime) / 1000)
    const speedBonus = correct ? Math.max(0, 10 - elapsedSeconds) : 0
    const earned = correct ? 25 + speedBonus : 0
    if (correct) setQuestionScore((current) => current + earned)
    setQuestionFeedback({ correct, earned, selected })
    setStage('quiz-feedback')
  }

  async function finishGame() {
    const finalScore = score + questionScore
    const playerName = name.trim().slice(0, 20) || 'Estudiante Anónimo'
    setScore(finalScore)

    try {
      await saveSharedScore(playerName, finalScore)
      const sharedRanking = await fetchSharedRanking()
      setRanking(sharedRanking)
      localStorage.setItem(RANKING_KEY, JSON.stringify(sharedRanking))
      setStorageError('')
    } catch {
      try {
        const localRanking = normalizeRanking([
          ...readRanking(),
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            name: playerName,
            score: finalScore,
            date: new Date().toLocaleDateString(),
          },
        ])
        localStorage.setItem(RANKING_KEY, JSON.stringify(localRanking))
        setRanking(localRanking)
        setStorageError('No se pudo guardar el puntaje en el ranking compartido. Se guardó solo en este navegador.')
      } catch {
        setStorageError('No se pudo guardar el puntaje en Supabase ni en este navegador, pero el resultado sigue disponible.')
      }
    }

    setStage('result')
  }

  const level = stage === 'thrashing' || stage === 'thrashing-result' ? 1
    : stage === 'page-size' ? 2
      : stage === 'cow' || stage === 'cow-feedback' ? 3
        : stage === 'quiz' || stage === 'quiz-feedback' ? 4 : 0

  return (
    <div className="space-y-5">
      {stage !== 'intro' && stage !== 'result' && (
        <div className="flex gap-1.5" aria-label={`Progreso: nivel ${level} de 4`}>
          {[1, 2, 3, 4].map((item) => <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= level ? 'bg-lime' : 'bg-white/10'}`} />)}
        </div>
      )}

      {stage === 'intro' && (
        <>
          <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/70 p-6 sm:p-8">
            <div className="simulation-grid absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/[0.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-lime"><CircleDot size={12} /> Desafío interactivo</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">¿El concepto quedó en memoria?</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-slate-400">Resolvé cuatro retos sobre gestión de memoria: estabilizá la carga del sistema, elegí el tamaño de página, anticipá las copias COW y cerrá con una trivia.</p>
              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-500">Puntaje máximo: 1180 puntos. Nivel 1: hasta 300 por CPU estable; Nivel 2: hasta 300; Nivel 3: 50 por cada predicción COW correcta; trivia: 25 por acierto más hasta 10 puntos de bonus por velocidad.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Cpu, title: '01 · Control de carga', detail: 'Mantené la CPU útil y evitá thrashing.' },
                  { icon: CircleDot, title: '02 · Tamaño de página', detail: 'Buscá el menor costo total.' },
                  { icon: Copy, title: '03 · Copy-on-Write', detail: 'Decidí cuándo hace falta una copia.' },
                  { icon: Sparkles, title: '04 · Trivia final', detail: 'Poné a prueba los conceptos.' },
                ].map(({ icon: Icon, title, detail }) => <div key={title} className="flex gap-3 rounded-lg border border-white/[0.07] bg-black/10 p-3"><Icon size={17} className="mt-0.5 shrink-0 text-cyan" /><div><p className="text-sm font-medium text-slate-200">{title}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div></div>)}
              </div>
              <div className="mt-6">
                <label htmlFor="challenge-name" className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-slate-500">Nombre para el ranking · opcional</label>
                <input id="challenge-name" maxLength={20} value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre o apodo" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan/40 sm:max-w-sm" />
              </div>
              <button type="button" className="primary-button mt-5 w-full sm:w-auto" onClick={beginGame}>Comenzar desafío <ArrowRight size={16} /></button>
            </div>
          </section>
          <RankingTable ranking={ranking} highlightName={name} error={storageError} />
        </>
      )}

      {stage === 'thrashing' && (
        <>
          <LevelHeader level={1} title="Control de carga y thrashing" subtitle={`${seconds}/30 s · ${goodSeconds * 10} pts acumulados`} score={score + goodSeconds * 10} />
          <section className="space-y-5 rounded-2xl border border-white/[0.08] bg-panel/70 p-5">
            <p className="text-sm leading-relaxed text-slate-400">Mantené la CPU útil al <strong className="text-slate-200">70% o más</strong>. Cuando la demanda de working sets supera los 16 marcos, aparece thrashing. Cada 5 segundos entra un proceso nuevo, hasta un máximo de 6: mandalo a disco o traelo de vuelta para ajustar la carga.</p>
            <div>
              <div className="mb-2 flex flex-wrap justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500"><span>RAM · 16 marcos</span><span className={processStats.thrashing ? 'text-rose-300' : ''}>Demanda {processStats.demand}/16 {processStats.thrashing ? '· THRASHING' : ''}</span></div>
              <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-white/[0.06] bg-black/20 p-3 sm:grid-cols-8">
                {Array.from({ length: 16 }, (_, index) => {
                  let usedBy: ProcessState | undefined
                  let cursor = 0
                  for (const process of processes.filter((item) => item.active)) {
                    if (index >= cursor && index < cursor + process.workingSet) usedBy = process
                    cursor += process.workingSet
                  }
                  return <div key={index} className={`grid h-8 place-items-center rounded text-[9px] font-bold text-ink transition-colors ${usedBy ? PROCESS_COLORS[usedBy.id % PROCESS_COLORS.length] : 'border border-white/[0.06] bg-white/[0.025]'}`}>{usedBy ? `P${usedBy.id + 1}` : ''}</div>
                })}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricBar label="CPU útil" value={processStats.cpu} good={processStats.cpu >= 70} />
              <MetricBar label="Actividad de intercambio" value={processStats.thrashing ? Math.min(100, 40 + (processStats.demand - 16) * 12) : processes.filter((process) => process.active).length * 6} />
            </div>
            <div><p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">Procesos · activar / enviar al disco</p><div className="flex flex-wrap gap-2">{processes.map((process) => <button key={process.id} type="button" onClick={() => toggleProcess(process.id)} aria-pressed={process.active} className={`rounded-lg border px-3 py-2 text-xs transition focus:outline-none focus:ring-2 focus:ring-cyan/30 ${process.active ? 'border-white/10 bg-white/[0.05] text-slate-200' : 'border-dashed border-white/10 text-slate-500'}`}><span className={`mr-2 inline-block size-2 rounded-full ${process.active ? PROCESS_COLORS[process.id % PROCESS_COLORS.length] : 'bg-slate-600'}`} />P{process.id + 1} · {process.workingSet} marcos {process.active ? '' : '· en disco'}</button>)}</div></div>
            <p className={`min-h-5 text-center text-xs font-medium ${processStats.thrashing ? 'text-rose-300' : processStats.cpu >= 70 ? 'text-lime' : 'text-slate-500'}`} role="status" aria-live="polite">{processStats.thrashing ? 'Demanda excesiva: despachá procesos al disco.' : processStats.cpu < 70 ? 'La CPU está desaprovechada: activá más procesos.' : 'Buen equilibrio: mantené la carga estable.'}</p>
          </section>
        </>
      )}

      {stage === 'thrashing-result' && (
        <LevelResult level={1} title="¡Nivel 1 completado!" detail={`Mantuviste la CPU útil en niveles óptimos durante ${goodSeconds} segundos.`} earned={Math.min(300, goodSeconds * 10)} onContinue={advanceFromThrashing} />
      )}

      {stage === 'page-size' && (
        <>
          <LevelHeader level={2} title="Tamaño óptimo de página" subtitle={`Ronda ${pageRound + 1}/${pageRounds.length} · e = ${currentSegment.entryBytes} B`} score={score + pageRoundScore} />
          <section className="space-y-5 rounded-2xl border border-white/[0.08] bg-panel/70 p-5">
            <p className="text-sm leading-relaxed text-slate-400">Ajustá el tamaño de página para reducir la sobrecarga total: costo de la tabla de páginas más fragmentación interna promedio. En cada ronda cambian tanto el tamaño del segmento s como el costo de entrada e.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider text-slate-500"><span>Segmento s: <strong className="text-slate-300">{formatBytes(currentSegment.bytes)}</strong></span><span>Entrada e: <strong className="text-slate-300">{currentSegment.entryBytes} bytes</strong></span><span>Fórmula: <strong className="text-cyan">p = √(2·s·e)</strong></span></div>
            <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Tamaño de página (p)</p><span className="font-mono text-sm text-cyan">{PAGE_SIZES[pageSizeIndex].label}</span></div>
            <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Seleccionar tamaño de página">{PAGE_SIZES.map((size, index) => <button key={size.bytes} type="button" role="radio" aria-checked={pageSizeIndex === index} onClick={() => !pageFeedback && setPageSizeIndex(index)} className={`rounded-lg border px-2 py-3 font-mono text-xs transition ${pageSizeIndex === index ? 'border-cyan bg-cyan text-ink' : 'border-white/[0.08] bg-black/10 text-slate-400 hover:border-cyan/30'}`}>{size.label}</button>)}</div>
            <div className="space-y-4">
              <MetricBar label="Tabla de páginas" value={Math.min(100, pageMetrics.tableOverhead / Math.max(...PAGE_SIZES.map((size) => getPageSizeMetrics(size.bytes, currentSegment.bytes, currentSegment.entryBytes).total)) * 100)} valueLabel={formatBytes(pageMetrics.tableOverhead)} />
              <MetricBar label="Fragmentación interna promedio" value={Math.min(100, pageMetrics.fragmentation / Math.max(...PAGE_SIZES.map((size) => getPageSizeMetrics(size.bytes, currentSegment.bytes, currentSegment.entryBytes).total)) * 100)} valueLabel={formatBytes(pageMetrics.fragmentation)} />
              <div className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-black/15 p-3"><span className="text-xs font-medium text-slate-400">Sobrecarga total</span><span className="font-mono text-sm font-semibold text-white">{formatBytes(pageMetrics.total)}</span></div>
            </div>
            {pageFeedback ? (
              <div className={`rounded-xl border p-4 ${pageFeedback.optimal ? 'border-lime/20 bg-lime/[0.05]' : 'border-amber-300/20 bg-amber-300/[0.04]'}`} role="status" aria-live="polite">
                <p className={`text-sm font-semibold ${pageFeedback.optimal ? 'text-lime' : 'text-amber-300'}`}>{pageFeedback.optimal ? '¡Elegiste la opción más cercana al óptimo!' : 'No elegiste la opción más cercana.'}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">El óptimo teórico es {pageFeedback.theoretical.toFixed(2)} KB; la opción disponible más cercana es {pageFeedback.nearest}. Ganaste {pageFeedback.earned} puntos.</p>
                <button type="button" className="secondary-button mt-4 w-full" onClick={advancePageRound}>{pageRound < pageRounds.length - 1 ? 'Siguiente ronda' : 'Avanzar al nivel 3'} <ArrowRight size={15} /></button>
              </div>
            ) : <button type="button" className="primary-button w-full" onClick={confirmPageSize}>Confirmar tamaño</button>}
          </section>
        </>
      )}

      {(stage === 'cow' || stage === 'cow-feedback') && currentChallenge && (
        <>
          <LevelHeader level={3} title="Copy-on-Write (COW)" subtitle={`Pregunta ${cowStep + 1}/${COW_CHALLENGES.length} · ${cowCopies} copias`} score={score + cowScore} />
          <section className="space-y-5 rounded-2xl border border-white/[0.08] bg-panel/70 p-5">
            <p className="text-sm leading-relaxed text-slate-400">Después de <code className="rounded bg-black/20 px-1.5 py-0.5 text-cyan">fork()</code>, padre e hijo pueden apuntar al mismo marco de solo lectura. Marcá si el kernel debe duplicar físicamente la página; si queda una única referencia, puede habilitar escritura sin copiar.</p>
            <div className="overflow-hidden rounded-lg border border-white/[0.07]">
              <div className="grid grid-cols-3 bg-black/15 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-slate-500"><span>Página</span><span>Padre</span><span>Hijo</span></div>
              {cowMappings.map((mappings, index) => <div key={index} className="grid grid-cols-3 border-t border-white/[0.05] px-3 py-2.5 text-[10px]"><span className="font-mono text-slate-300">P{index}</span>{mappings.map((mapping, processIndex) => <span key={processIndex} className={mapping === 'shared' ? 'text-cyan' : mapping === 'exclusive' ? 'text-amber-300' : 'text-lime'}>{getCowMappingLabel(mapping)}</span>)}</div>)}
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-black/15 p-5 text-center"><p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Decisión COW</p><p className="mt-2 text-base font-semibold leading-relaxed text-white">{currentChallenge.question}</p></div>
            {stage === 'cow' ? (
              <div className="grid grid-cols-2 gap-3"><button type="button" className="primary-button w-full" onClick={() => answerCow(true)}>Sí, se copia</button><button type="button" className="secondary-button w-full" onClick={() => answerCow(false)}>No se copia</button></div>
            ) : cowFeedback && (
              <div className={`rounded-xl border p-4 ${cowFeedback.correct ? 'border-lime/20 bg-lime/[0.04]' : 'border-rose-300/20 bg-rose-300/[0.04]'}`} role="status" aria-live="polite">
                <p className={`text-sm font-semibold ${cowFeedback.correct ? 'text-lime' : 'text-rose-300'}`}>{cowFeedback.correct ? '¡Correcto! +50 puntos' : 'Respuesta incorrecta.'}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{cowFeedback.copied ? 'La escritura en una página compartida genera una excepción de protección. Como ambos procesos apuntaban al marco, el kernel crea una copia privada y actualiza las tablas de páginas.' : cowFeedback.action === 'lee' ? 'Leer una página compartida no genera una copia ni cambia los permisos.' : cowFeedback.fault ? 'La escritura genera una excepción, pero el marco ya tiene una sola referencia. El kernel puede habilitar lectura-escritura sin duplicar los datos.' : 'La página ya es privada y de lectura-escritura; no hace falta una copia ni una nueva excepción.'}</p>
                <p className="mt-2 text-xs font-medium text-slate-300">{cowFeedback.fault ? 'Se genera una excepción de protección.' : 'No se genera una excepción de protección.'}</p>
                <button type="button" className="secondary-button mt-4 w-full" onClick={advanceCow}>{cowStep < COW_CHALLENGES.length - 1 ? 'Siguiente pregunta' : 'Ir a la trivia final'} <ArrowRight size={15} /></button>
              </div>
            )}
          </section>
        </>
      )}

      {(stage === 'quiz' || stage === 'quiz-feedback') && currentQuestion && (
        <>
          <LevelHeader level={4} title="Trivia de memoria virtual" subtitle={`Pregunta ${questionIndex + 1}/8`} score={score + questionScore} />
          <section className="space-y-5 rounded-2xl border border-white/[0.08] bg-panel/70 p-5 sm:p-6">
            <h3 className="text-base font-semibold leading-relaxed text-white">{currentQuestion.question}</h3>
            <div className="grid gap-2.5">
              {currentQuestion.options.map((option, index) => {
                const selected = questionFeedback?.selected === index
                const correct = questionFeedback && currentQuestion.answer === index
                const incorrect = questionFeedback && selected && !questionFeedback.correct
                return <button key={option} type="button" disabled={Boolean(questionFeedback)} onClick={() => answerQuestion(index)} className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition disabled:cursor-default ${correct ? 'border-lime/30 bg-lime/[0.06] text-lime' : incorrect ? 'border-rose-300/30 bg-rose-300/[0.05] text-rose-200' : 'border-white/[0.07] bg-black/10 text-slate-300 hover:border-cyan/25 hover:bg-cyan/[0.03]'}`}><span className="grid size-6 shrink-0 place-items-center rounded-md border border-white/10 font-mono text-[10px] text-cyan">{correct ? <Check size={13} /> : LETTERS[index]}</span><span>{option}</span></button>
              })}
            </div>
            {stage === 'quiz-feedback' && questionFeedback && (
              <div className={`rounded-xl border p-4 ${questionFeedback.correct ? 'border-lime/20 bg-lime/[0.04]' : 'border-rose-300/20 bg-rose-300/[0.04]'}`} role="status" aria-live="polite">
                <p className={`text-sm font-semibold ${questionFeedback.correct ? 'text-lime' : 'text-rose-300'}`}>{questionFeedback.correct ? `¡Correcto! +${questionFeedback.earned} puntos` : 'Respuesta incorrecta.'}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{currentQuestion.explanation}</p>
                <button type="button" className="secondary-button mt-4 w-full" onClick={() => {
                  if (questionIndex < challengeQuestions.length - 1) {
                    setQuestionIndex((current) => current + 1)
                    setQuestionFeedback(null)
                    setQuestionStartTime(Date.now())
                    setStage('quiz')
                  } else void finishGame()
                }}>{questionIndex < challengeQuestions.length - 1 ? 'Siguiente pregunta' : 'Ver resultado final'} <ArrowRight size={15} /></button>
              </div>
            )}
          </section>
        </>
      )}

      {stage === 'result' && (
        <>
          <section className="rounded-2xl border border-lime/15 bg-gradient-to-br from-lime/[0.06] to-cyan/[0.03] p-7 text-center sm:p-9">
            <Trophy size={34} className="mx-auto text-lime" />
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-lime">Desafío concluido</p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{name.trim() || 'Estudiante Anónimo'} · {score} puntos</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400">Completaste los cuatro retos de gestión de memoria virtual basados en los conceptos del laboratorio.</p>
            {storageError && <p className="mt-4 text-xs text-amber-300" role="alert">{storageError}</p>}
            <button type="button" className="primary-button mt-6" onClick={beginGame}><RotateCcw size={15} /> Jugar nuevamente</button>
          </section>
          <RankingTable ranking={ranking} highlightName={name} error={storageError} />
        </>
      )}
    </div>
  )
}

function MetricBar({ label, value, valueLabel, good }: { label: string; value: number; valueLabel?: string; good?: boolean }) {
  const boundedValue = Math.max(0, Math.min(100, value))
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-3 text-xs"><span className="text-slate-400">{label}</span><span className={`font-mono ${good ? 'text-lime' : 'text-slate-300'}`}>{valueLabel ?? `${Math.round(boundedValue)}%`}</span></div>
      <div className="h-2 overflow-hidden rounded-full border border-white/[0.05] bg-black/20"><div className={`h-full rounded-full transition-all duration-300 ${good ? 'bg-lime' : 'bg-cyan'}`} style={{ width: `${boundedValue}%` }} /></div>
    </div>
  )
}

function LevelResult({ level, title, detail, earned, onContinue }: { level: number; title: string; detail: string; earned: number; onContinue: () => void }) {
  return (
    <section className="rounded-2xl border border-lime/15 bg-panel/70 p-7 text-center">
      <Trophy size={30} className="mx-auto text-lime" /><p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-lime">Nivel {level} completado</p><h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2><p className="mt-3 text-sm text-slate-400">{detail}</p><p className="mt-4 font-mono text-lg text-lime">+{earned} puntos</p><button type="button" className="primary-button mt-5 w-full" onClick={onContinue}>Continuar <ArrowRight size={15} /></button>
    </section>
  )
}

function RankingTable({ ranking, highlightName, error }: { ranking: RankingEntry[]; highlightName: string; error: string }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-panel/60 p-5">
      <div className="mb-4 flex items-center gap-2"><Trophy size={17} className="text-cyan" /><h2 className="text-sm font-semibold text-slate-200">Ranking general del curso</h2></div>
      {error && <p className="mb-3 text-xs text-amber-300" role="status">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs"><thead className="border-b border-white/[0.08] font-mono uppercase tracking-wider text-slate-600"><tr><th className="pb-2">#</th><th className="pb-2">Nombre</th><th className="pb-2 text-right">Puntaje</th></tr></thead>
          <tbody className="divide-y divide-white/[0.05]">{ranking.length ? ranking.map((entry, index) => <tr key={entry.id || `${entry.name}-${index}`} className={entry.name.toLowerCase() === highlightName.trim().toLowerCase() ? 'text-lime' : 'text-slate-400'}><td className="py-2.5 font-mono text-slate-600">{index + 1}</td><td className="py-2.5">{entry.name}</td><td className="py-2.5 text-right font-mono">{entry.score} pts</td></tr>) : <tr><td colSpan={3} className="py-5 text-center text-slate-600">Todavía no hay puntajes. ¡Sé el primero!</td></tr>}</tbody>
        </table>
      </div>
    </section>
  )
}
