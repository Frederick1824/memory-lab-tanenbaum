import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'

const links = [
  { label: 'Inicio', path: '/' },
  { label: 'Local vs Global', path: '/local-vs-global' },
  { label: 'Thrashing', path: '/thrashing' },
  { label: 'Tamaño de Página', path: '/tamano-de-pagina' },
  { label: 'I/D + COW', path: '/id-cow' },
  { label: 'Challenge', path: '/kernel-challenge' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm transition ${
      isActive ? 'bg-white/[0.07] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {links.map((link) => <NavLink key={link.path} to={link.path} className={navLinkClass}>{link.label}</NavLink>)}
        </nav>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg border border-white/10 text-slate-300 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/[0.07] bg-ink px-5 py-4 lg:hidden" aria-label="Navegación móvil">
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan/40 to-transparent" aria-hidden="true" key={pathname} />
    </header>
  )
}
