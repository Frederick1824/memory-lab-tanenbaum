import type { Process } from './simulation'

export type AllocationMode = 'local' | 'global'

export interface AllocationProcess {
  id: 'p1' | 'p2' | 'p3'
  name: string
  color: Process['color']
  faultRate: number
  pageFaults: number
}

export interface AllocationFrame {
  id: number
  ownerId: AllocationProcess['id'] | null
  page: number | null
}

export interface AllocationEvent {
  kind: 'fault' | 'pff' | 'info'
  message: string
  detail: string
}

export interface AllocationState {
  mode: AllocationMode
  pffEnabled: boolean
  processes: AllocationProcess[]
  frames: AllocationFrame[]
  event: AllocationEvent
  highlightedProcessIds: AllocationProcess['id'][]
  highlightedFrameId: number | null
}
