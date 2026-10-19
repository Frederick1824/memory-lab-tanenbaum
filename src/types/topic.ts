import type { LucideIcon } from 'lucide-react'

export type TopicAccent = 'cyan' | 'violet' | 'amber' | 'lime'

export interface Topic {
  id: string
  order: string
  title: string
  shortTitle: string
  member: string
  description: string
  detail: string
  path: string
  accent: TopicAccent
  icon: LucideIcon
  concepts: Array<{ title: string; description: string }>
}
