import type { PageSizeMetrics, PageSizeOption } from '../types/pageSize'

export const PROCESS_SIZE_MB = 64
export const TLB_ENTRIES = 64
export const DEFAULT_ENTRY_BYTES = 8

export const PAGE_SIZE_OPTIONS: PageSizeOption[] = [
  { label: '4 KB', sizeKb: 4 },
  { label: '16 KB', sizeKb: 16 },
  { label: '64 KB', sizeKb: 64 },
  { label: '256 KB', sizeKb: 256 },
  { label: '1 MB', sizeKb: 1024 },
  { label: '2 MB', sizeKb: 2048 },
]

export function calculatePageSizeMetrics(pageSizeKb: number, entryBytes = DEFAULT_ENTRY_BYTES): PageSizeMetrics {
  const processSizeKb = PROCESS_SIZE_MB * 1024
  const pageTableEntries = Math.ceil(processSizeKb / pageSizeKb)
  const pageTableWasteKb = (pageTableEntries * entryBytes) / 1024
  const internalFragmentationKb = pageSizeKb / 2
  const tlbCoverageKb = pageSizeKb * TLB_ENTRIES
  return {
    pageSizeKb,
    pageTableEntries,
    pageTableWasteKb,
    internalFragmentationKb,
    tlbCoverageKb,
    totalWasteKb: pageTableWasteKb + internalFragmentationKb,
    visualPageCount: Math.max(4, Math.min(18, Math.round(18 - Math.log2(pageSizeKb / 4) * 2))),
  }
}

export function calculateOptimalPageKb(averageProcessMb: number, entryBytes: number) {
  const processBytes = averageProcessMb * 1024 * 1024
  return Math.sqrt(2 * processBytes * entryBytes) / 1024
}

export function formatMemory(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(kb >= 10240 ? 0 : 1)} MB`
  if (kb < 1) return `${Math.round(kb * 1024)} B`
  return `${kb.toFixed(kb >= 10 ? 0 : 1)} KB`
}
