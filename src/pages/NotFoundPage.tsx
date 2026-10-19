import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <main className="grid min-h-[70vh] place-items-center px-5 text-center"><div><p className="font-mono text-cyan">ERROR 404</p><h1 className="mt-3 text-4xl font-semibold text-white">Dirección fuera de memoria</h1><Link className="primary-button mt-8" to="/">Volver al inicio</Link></div></main>
}
