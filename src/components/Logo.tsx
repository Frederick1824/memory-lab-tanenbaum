import { Blocks } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Memory Lab, inicio">
      <span className="grid size-9 place-items-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan transition group-hover:bg-cyan/15">
        <Blocks size={19} />
      </span>
      <span className="font-mono text-sm font-semibold tracking-[0.16em] text-white">
        MEMORY<span className="text-cyan">/</span>LAB
      </span>
    </Link>
  )
}
