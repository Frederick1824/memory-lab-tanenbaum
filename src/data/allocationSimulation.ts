import type { AllocationFrame, AllocationProcess } from '../types/allocation'

export const PFF_MIN_THRESHOLD = 20
export const PFF_MAX_THRESHOLD = 60

export const INITIAL_ALLOCATION_PROCESSES: AllocationProcess[] = [
  { id: 'p1', name: 'P1', color: 'cyan', faultRate: 48, pageFaults: 3 },
  { id: 'p2', name: 'P2', color: 'violet', faultRate: 32, pageFaults: 2 },
  { id: 'p3', name: 'P3', color: 'amber', faultRate: 26, pageFaults: 1 },
]

export const createInitialAllocationFrames = (): AllocationFrame[] =>
  Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    ownerId: index < 4 ? 'p1' : index < 8 ? 'p2' : 'p3',
    page: (index % 4) + 1,
  }))

export const cloneInitialProcesses = () => INITIAL_ALLOCATION_PROCESSES.map((process) => ({ ...process }))
