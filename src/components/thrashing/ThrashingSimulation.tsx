import { ArrowDownToLine, MemoryStick } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getMetrics, getPhase, simulationProcesses, TOTAL_MEMORY_FRAMES } from '../../data/thrashingSimulation'
import type { MemoryFrame as MemoryFrameType, SimulationState } from '../../types/simulation'
import { MemoryFrame } from './MemoryFrame'
import { ProcessCard } from './ProcessCard'
import { SimulationControls } from './SimulationControls'
import { SwapArea } from './SwapArea'
import { SystemMetrics } from './SystemMetrics'
import { ThrashingAlert } from './ThrashingAlert'

const INITIAL_ACTIVE_IDS = ['p1', 'p2']

function createFrames(activeIds: string[]): MemoryFrameType[] {
  const frames: MemoryFrameType[] = Array.from({ length: TOTAL_MEMORY_FRAMES }, (_, index) => ({ id: index + 1, processId: null, pageNumber: null }))
  let cursor = 0
  for (const processId of activeIds) {
    const process = simulationProcesses.find((item) => item.id === processId)
    if (!process) continue
    for (let page = 1; page <= process.frameDemand && cursor < frames.length; page += 1) {
      frames[cursor] = { ...frames[cursor], processId, pageNumber: page }
      cursor += 1
    }
  }
  return frames
}

export function ThrashingSimulation() {
  const [activeIds, setActiveIds] = useState<string[]>(INITIAL_ACTIVE_IDS)
  const [swappedIds, setSwappedIds] = useState<string[]>([])
  const [stabilized, setStabilized] = useState(false)

  const simulation = useMemo<SimulationState>(() => {
    const frames = createFrames(activeIds)
    const usedFrames = frames.filter((frame) => frame.processId !== null).length
    const phase = getPhase(activeIds.length, stabilized)
    return { phase, activeProcessIds: activeIds, swappedProcessIds: swappedIds, frames, metrics: getMetrics(phase, activeIds.length, usedFrames) }
  }, [activeIds, stabilized, swappedIds])

  const activeProcesses = simulationProcesses.filter((process) => activeIds.includes(process.id))
  const swappedProcesses = simulationProcesses.filter((process) => swappedIds.includes(process.id))

  const addProcess = () => {
    const nextProcess = simulationProcesses.find((process) => !activeIds.includes(process.id))
    if (!nextProcess) return
    setActiveIds((current) => [...current, nextProcess.id])
    setSwappedIds((current) => current.filter((id) => id !== nextProcess.id))
    setStabilized(false)
  }

  const removeProcess = () => {
    if (activeIds.length <= 1) return
    setActiveIds((current) => current.slice(0, -1))
    setStabilized(false)
  }

  const applySwapOut = () => {
    const processesToSwap = activeIds.slice(2)
    setActiveIds(activeIds.slice(0, 2))
    setSwappedIds((current) => [...new Set([...current, ...processesToSwap])])
    setStabilized(true)
  }

  const reset = () => {
    setActiveIds(INITIAL_ACTIVE_IDS)
    setSwappedIds([])
    setStabilized(false)
  }

  return (
    <section className="space-y-5" aria-label="Simulación de thrashing y swapping">
      <SimulationControls activeCount={activeIds.length} canAdd={activeIds.length < simulationProcesses.length} canRemove={activeIds.length > 1} onAdd={addProcess} onRemove={removeProcess} onReset={reset} />
      <ThrashingAlert phase={simulation.phase} />
      <SystemMetrics metrics={simulation.metrics} phase={simulation.phase} />

      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className={`rounded-2xl border bg-panel/70 p-5 transition-colors ${simulation.phase === 'thrashing' ? 'border-rose-400/30' : 'border-white/[0.08]'}`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
            <div className="flex items-center gap-3"><MemoryStick size={18} className="text-cyan" /><div><h3 className="font-medium text-white">Memoria RAM</h3><p className="font-mono text-[8px] uppercase tracking-widest text-slate-600">16 marcos físicos</p></div></div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{simulation.metrics.usedFrames} ocupados · {TOTAL_MEMORY_FRAMES - simulation.metrics.usedFrames} libres</span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {simulation.frames.map((frame) => <MemoryFrame key={frame.id} frame={frame} process={simulationProcesses.find((process) => process.id === frame.processId)} phase={simulation.phase} />)}
          </div>
          {simulation.phase === 'thrashing' && (
            <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-400 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300/60" onClick={applySwapOut}>
              <ArrowDownToLine size={17} /> Aplicar Swap Out
            </button>
          )}
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-panel/70 p-5">
          <div className="mb-4"><h3 className="font-medium text-white">Procesos activos</h3><p className="mt-1 font-mono text-[8px] uppercase tracking-widest text-slate-600">Working sets en competencia</p></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {activeProcesses.map((process) => {
              const residentFrames = simulation.frames.filter((frame) => frame.processId === process.id).length
              return <ProcessCard key={process.id} process={process} residentFrames={residentFrames} />
            })}
          </div>
        </section>
      </div>
      <SwapArea processes={swappedProcesses} />
    </section>
  )
}
