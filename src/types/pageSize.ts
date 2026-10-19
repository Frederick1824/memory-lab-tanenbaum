export interface PageSizeOption {
  label: string
  sizeKb: number
}

export interface PageSizeMetrics {
  pageSizeKb: number
  pageTableEntries: number
  pageTableWasteKb: number
  internalFragmentationKb: number
  tlbCoverageKb: number
  totalWasteKb: number
  visualPageCount: number
}

export interface TanenbaumInputs {
  averageProcessMb: number
  pageTableEntryBytes: number
}
