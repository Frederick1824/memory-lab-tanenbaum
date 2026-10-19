interface SectionHeaderProps {
  eyebrow: string
  title: string
  description: string
  align?: 'left' | 'center'
}

export function SectionHeader({ eyebrow, title, description, align = 'left' }: SectionHeaderProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-cyan">// {eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">{description}</p>
    </div>
  )
}
