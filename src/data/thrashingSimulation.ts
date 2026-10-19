import type { Process, SimulationPhase, SystemMetrics } from '../types/simulation'

export const TOTAL_MEMORY_FRAMES = 16

export const simulationProcesses: Process[] = [
  { id: 'p1', name: 'P1', color: 'cyan', frameDemand: 3 },
  { id: 'p2', name: 'P2', color: 'violet', frameDemand: 4 },
  { id: 'p3', name: 'P3', color: 'amber', frameDemand: 3 },
  { id: 'p4', name: 'P4', color: 'lime', frameDemand: 4 },
  { id: 'p5', name: 'P5', color: 'rose', frameDemand: 3 },
  { id: 'p6', name: 'P6', color: 'blue', frameDemand: 4 },
]

export function getPhase(activeCount: number, stabilized: boolean): SimulationPhase {
  if (stabilized) return 'stabilized'
  if (activeCount >= 5) return 'thrashing'
  if (activeCount >= 3) return 'pressure'
  return 'normal'
}

export function getMetrics(phase: SimulationPhase, activeCount: number, usedFrames: number): SystemMetrics {
  const byPhase = {
    normal: { cpuUsage: activeCount === 1 ? 68 : 84, diskActivity: 12, pageFaults: 5 },
    pressure: { cpuUsage: activeCount === 3 ? 69 : 51, diskActivity: activeCount === 3 ? 44 : 67, pageFaults: activeCount === 3 ? 24 : 43 },
    thrashing: { cpuUsage: activeCount === 5 ? 23 : 14, diskActivity: activeCount === 5 ? 93 : 98, pageFaults: activeCount === 5 ? 84 : 96 },
    stabilized: { cpuUsage: 87, diskActivity: 16, pageFaults: 6 },
  } satisfies Record<SimulationPhase, Pick<SystemMetrics, 'cpuUsage' | 'diskActivity' | 'pageFaults'>>

  return { ...byPhase[phase], activeProcesses: activeCount, usedFrames, totalFrames: TOTAL_MEMORY_FRAMES }
}
