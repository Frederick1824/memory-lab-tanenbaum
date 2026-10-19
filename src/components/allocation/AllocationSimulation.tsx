import { MemoryStick, Network } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cloneInitialProcesses, createInitialAllocationFrames, PFF_MAX_THRESHOLD, PFF_MIN_THRESHOLD } from '../../data/allocationSimulation'
import type { AllocationMode, AllocationProcess, AllocationState } from '../../types/allocation'
import { AllocationControls } from './AllocationControls'
import { AllocationMemoryFrame } from './AllocationMemoryFrame'
import { AllocationMetrics } from './AllocationMetrics'
import { AllocationModeSelector } from './AllocationModeSelector'
import { PageFaultEvent } from './PageFaultEvent'
import { PFFMonitor } from './PFFMonitor'
import { ProcessMemoryPanel } from './ProcessMemoryPanel'

const createInitialState = (mode: AllocationMode = 'local', pffEnabled = false): AllocationState => ({
  mode,
  pffEnabled,
  processes: cloneInitialProcesses(),
  frames: createInitialAllocationFrames(),
  event: { kind: 'info', message: 'Escenario inicial listo', detail: 'P1, P2 y P3 comienzan con cuatro marcos cada uno para facilitar una comparación directa.' },
  highlightedProcessIds: [],
  highlightedFrameId: null,
})

function findLastOwnerIndex(frames: AllocationState['frames'], ownerId: AllocationProcess['id']) {
  for (let index = frames.length - 1; index >= 0; index -= 1) {
    if (frames[index].ownerId === ownerId) return index
  }
  return -1
}

export function AllocationSimulation() {
  const [state, setState] = useState<AllocationState>(() => createInitialState())

  const frameCounts = useMemo(() => {
    const counts: Record<AllocationProcess['id'], number> = { p1: 0, p2: 0, p3: 0 }
    for (const frame of state.frames) if (frame.ownerId) counts[frame.ownerId] += 1
    return counts
  }, [state.frames])

  const setMode = (mode: AllocationMode) => setState((current) => ({
    ...createInitialState(mode, current.pffEnabled),
    event: { kind: 'info', message: `Modo ${mode === 'local' ? 'Local' : 'Global'} seleccionado`, detail: 'La distribución volvió a 4/4/4 para comparar ambas políticas desde la misma situación.' },
  }))

  const generateFault = () => setState((current) => {
    const nextProcesses = current.processes.map((process) => process.id === 'p1' ? { ...process, pageFaults: process.pageFaults + 1, faultRate: Math.min(99, process.faultRate + 6) } : process)
    const nextFrames = current.frames.map((frame) => ({ ...frame }))
    const p1 = current.processes.find((process) => process.id === 'p1')!
    let targetIndex = nextFrames.findIndex((frame) => frame.ownerId === 'p1')
    let victimId: AllocationProcess['id'] = 'p1'

    if (current.mode === 'global') {
      const p3Frames = nextFrames.filter((frame) => frame.ownerId === 'p3').length
      victimId = p3Frames > 2 ? 'p3' : 'p2'
      targetIndex = findLastOwnerIndex(nextFrames, victimId)
      nextFrames[targetIndex] = { ...nextFrames[targetIndex], ownerId: 'p1', page: p1.pageFaults + 5 }
    } else {
      nextFrames[targetIndex] = { ...nextFrames[targetIndex], page: p1.pageFaults + 5 }
    }

    return {
      ...current,
      processes: nextProcesses,
      frames: nextFrames,
      highlightedProcessIds: current.mode === 'local' ? ['p1'] : ['p1', victimId],
      highlightedFrameId: targetIndex + 1,
      event: current.mode === 'local'
        ? { kind: 'fault', message: 'P1 reemplazó una página propia', detail: 'En asignación local, cada proceso compite únicamente dentro de su propio conjunto de marcos.' }
        : { kind: 'fault', message: `P1 tomó un marco de ${victimId.toUpperCase()}`, detail: 'En asignación global, los marcos se distribuyen dinámicamente según la demanda del sistema.' },
    }
  })

  const increaseP1Demand = () => setState((current) => {
    const nextRate = Math.min(99, current.processes.find((process) => process.id === 'p1')!.faultRate + 15)
    const nextProcesses = current.processes.map((process) => process.id === 'p1' ? { ...process, faultRate: nextRate } : process)
    const nextFrames = current.frames.map((frame) => ({ ...frame }))
    let movedFrameId: number | null = null

    if (current.pffEnabled && nextRate > PFF_MAX_THRESHOLD) {
      let sourceIndex = nextFrames.findIndex((frame) => frame.ownerId === null)
      if (sourceIndex < 0) sourceIndex = findLastOwnerIndex(nextFrames, 'p3')
      if (sourceIndex >= 0) {
        nextFrames[sourceIndex] = { ...nextFrames[sourceIndex], ownerId: 'p1', page: 9 }
        movedFrameId = sourceIndex + 1
      }
    }

    return {
      ...current,
      processes: nextProcesses,
      frames: nextFrames,
      highlightedProcessIds: ['p1'],
      highlightedFrameId: movedFrameId,
      event: current.pffEnabled && nextRate > PFF_MAX_THRESHOLD
        ? { kind: 'pff', message: 'PFF asignó un marco adicional a P1', detail: `La tasa de P1 superó el umbral máximo de ${PFF_MAX_THRESHOLD} fallos/min.` }
        : { kind: 'info', message: 'Proceso con alta frecuencia de fallos', detail: `La demanda de P1 aumentó a ${nextRate} fallos/min${current.pffEnabled ? '.' : '; activá PFF para ajustar recursos.'}` },
    }
  })

  const reduceP3Demand = () => setState((current) => {
    const nextRate = Math.max(2, current.processes.find((process) => process.id === 'p3')!.faultRate - 12)
    const nextProcesses = current.processes.map((process) => process.id === 'p3' ? { ...process, faultRate: nextRate } : process)
    const nextFrames = current.frames.map((frame) => ({ ...frame }))
    let releasedFrameId: number | null = null

    if (current.pffEnabled && nextRate < PFF_MIN_THRESHOLD) {
      const sourceIndex = findLastOwnerIndex(nextFrames, 'p3')
      if (sourceIndex >= 0) {
        nextFrames[sourceIndex] = { ...nextFrames[sourceIndex], ownerId: null, page: null }
        releasedFrameId = sourceIndex + 1
      }
    }

    return {
      ...current,
      processes: nextProcesses,
      frames: nextFrames,
      highlightedProcessIds: ['p3'],
      highlightedFrameId: releasedFrameId,
      event: current.pffEnabled && nextRate < PFF_MIN_THRESHOLD
        ? { kind: 'pff', message: 'PFF liberó un marco de P3', detail: `La tasa de P3 cayó por debajo del umbral mínimo de ${PFF_MIN_THRESHOLD} fallos/min.` }
        : { kind: 'info', message: 'Demanda de P3 reducida', detail: `P3 registra ahora ${nextRate} fallos/min${current.pffEnabled ? '.' : '; activá PFF para liberar recursos.'}` },
    }
  })

  const usedFrames = state.frames.filter((frame) => frame.ownerId !== null).length
  const modeCopy = state.mode === 'local'
    ? { title: 'Aislamiento alto', detail: 'P1 sólo puede elegir víctimas dentro de sus propios marcos.' }
    : { title: 'Distribución flexible', detail: 'P1 puede competir por marcos de todo el sistema.' }

  return (
    <section className="space-y-5" aria-label="Simulación de asignación local, global y PFF">
      <div className="grid gap-4 lg:grid-cols-[360px_1fr] lg:items-center">
        <AllocationModeSelector mode={state.mode} onChange={setMode} />
        <AllocationControls onFault={generateFault} onIncreaseP1={increaseP1Demand} onReduceP3={reduceP3Demand} onReset={() => setState(createInitialState(state.mode, state.pffEnabled))} />
      </div>

      <div className={`rounded-xl border p-4 ${state.mode === 'local' ? 'border-cyan/20 bg-cyan/[0.05]' : 'border-lime/20 bg-lime/[0.05]'}`}>
        <div className="flex gap-3"><Network size={19} className={state.mode === 'local' ? 'text-cyan' : 'text-lime'} /><div><p className="font-mono text-xs font-semibold uppercase tracking-wider text-white">{modeCopy.title}</p><p className="mt-1 text-sm text-slate-400">{modeCopy.detail}</p></div></div>
      </div>

      <AllocationMetrics mode={state.mode} processes={state.processes} usedFrames={usedFrames} totalFrames={state.frames.length} />

      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-2xl border border-white/[0.08] bg-panel/70 p-5">
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.07] pb-4"><div className="flex items-center gap-3"><MemoryStick size={18} className="text-cyan" /><div><h3 className="font-medium text-white">Memoria RAM</h3><p className="font-mono text-[8px] uppercase tracking-widest text-slate-600">12 marcos físicos</p></div></div><span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Distribución {frameCounts.p1}/{frameCounts.p2}/{frameCounts.p3}</span></div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {state.frames.map((frame) => <AllocationMemoryFrame key={frame.id} frame={frame} owner={state.processes.find((process) => process.id === frame.ownerId)} mode={state.mode} highlightedProcessIds={state.highlightedProcessIds} highlightedFrameId={state.highlightedFrameId} />)}
          </div>
        </section>
        <section className="rounded-2xl border border-white/[0.08] bg-panel/70 p-5">
          <h3 className="font-medium text-white">Procesos</h3><p className="mt-1 font-mono text-[8px] uppercase tracking-widest text-slate-600">Asignación y fallos acumulados</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">{state.processes.map((process) => <ProcessMemoryPanel key={process.id} process={process} frameCount={frameCounts[process.id]} isHighlighted={state.highlightedProcessIds.includes(process.id)} />)}</div>
        </section>
      </div>

      <PageFaultEvent event={state.event} />
      <PFFMonitor enabled={state.pffEnabled} processes={state.processes} onToggle={() => setState((current) => ({ ...current, pffEnabled: !current.pffEnabled, event: { kind: 'info', message: !current.pffEnabled ? 'PFF activado' : 'PFF desactivado', detail: !current.pffEnabled ? 'Las tasas que crucen los umbrales producirán un ajuste de marcos.' : 'La asignación deja de ajustarse automáticamente.' } }))} />
    </section>
  )
}
