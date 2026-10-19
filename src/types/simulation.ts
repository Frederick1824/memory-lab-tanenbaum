export type SimulationPhase = 'normal' | 'pressure' | 'thrashing' | 'stabilized'

export interface Process {
  id: string
  name: string
  color: 'cyan' | 'violet' | 'amber' | 'lime' | 'rose' | 'blue'
  frameDemand: number
}

export interface MemoryFrame {
  id: number
  processId: string | null
  pageNumber: number | null
}

export interface SystemMetrics {
  cpuUsage: number
  diskActivity: number
  pageFaults: number
  activeProcesses: number
  usedFrames: number
  totalFrames: number
}

export interface SimulationState {
  phase: SimulationPhase
  activeProcessIds: string[]
  swappedProcessIds: string[]
  frames: MemoryFrame[]
  metrics: SystemMetrics
}
