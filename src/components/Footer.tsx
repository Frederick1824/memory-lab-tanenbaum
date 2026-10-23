import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center lg:px-8">
        <Logo />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">Sistemas Operativos · Gestión de memoria</p>
      </div>
    </footer>
  )
}
