import { ArrowLeftRight, Copy, Gauge, Layers3 } from 'lucide-react'
import type { Topic } from '../types/topic'

export const topics: Topic[] = [
  {
    id: 'local-global',
    order: '01',
    title: 'Políticas de asignación local vs. global + PFF',
    shortTitle: 'Local vs Global',
    member: 'Mariano',
    description: 'Cómo se reparten los marcos y quién puede competir por ellos.',
    detail: 'Exploraremos cómo las políticas locales y globales condicionan el reemplazo de páginas, y cómo PFF ayuda a ajustar la asignación según la frecuencia de fallos.',
    path: '/local-vs-global',
    accent: 'cyan',
    icon: ArrowLeftRight,
    concepts: [
      { title: 'Asignación local', description: 'Cada proceso reemplaza páginas únicamente dentro de sus marcos asignados.' },
      { title: 'Asignación global', description: 'Un proceso puede tomar marcos disponibles o asignados a otros procesos.' },
      { title: 'PFF', description: 'La frecuencia de fallos de página guía el aumento o reducción de marcos.' },
    ],
  },
  {
    id: 'thrashing',
    order: '02',
    title: 'Control de carga, thrashing y swapping',
    shortTitle: 'Thrashing',
    member: 'Fede',
    description: 'Cuando mover páginas ocupa más tiempo que ejecutar procesos.',
    detail: 'Veremos qué ocurre cuando los working sets superan la memoria física, por qué cae el rendimiento y qué mecanismos permiten recuperar la estabilidad.',
    path: '/thrashing',
    accent: 'violet',
    icon: Gauge,
    concepts: [
      { title: 'Working set', description: 'Conjunto de páginas que un proceso necesita activamente durante un intervalo.' },
      { title: 'Thrashing', description: 'Actividad excesiva de paginación que desplaza el trabajo útil del procesador.' },
      { title: 'Control de carga', description: 'Reducir procesos activos permite que los restantes recuperen marcos suficientes.' },
    ],
  },
  {
    id: 'page-size',
    order: '03',
    title: 'Tamaño de página + fórmula de Tanenbaum',
    shortTitle: 'Tamaño de Página',
    member: 'Noel',
    description: 'El equilibrio entre fragmentación, tablas, TLB y rendimiento.',
    detail: 'Analizaremos por qué no existe un tamaño de página universal y cómo la fórmula de Tanenbaum expresa el compromiso entre desperdicio interno y tamaño de tabla.',
    path: '/tamano-de-pagina',
    accent: 'amber',
    icon: Layers3,
    concepts: [
      { title: 'Fragmentación interna', description: 'El espacio sin usar en la última página asignada a cada proceso.' },
      { title: 'Tabla de páginas', description: 'Páginas más pequeñas requieren más entradas y mayor sobrecarga administrativa.' },
      { title: 'TLB', description: 'El tamaño de página modifica el alcance efectivo de sus traducciones almacenadas.' },
    ],
  },
  {
    id: 'id-cow',
    order: '04',
    title: 'Espacios I/D + páginas compartidas + Copy-on-Write',
    shortTitle: 'I/D + COW',
    member: 'Dilan',
    description: 'Separar, proteger y compartir memoria sin duplicarla antes de tiempo.',
    detail: 'Recorreremos la separación de instrucciones y datos, el uso seguro de páginas compartidas y la copia diferida que hace eficiente la creación de procesos.',
    path: '/id-cow',
    accent: 'lime',
    icon: Copy,
    concepts: [
      { title: 'Espacios I/D', description: 'La memoria virtual se divide en dos regiones independientes: Espacio I para instrucciones y Espacio D para datos. Esta separación duplica el espacio de direcciones disponible y simplifica la resolución de direcciones en la MMU.' },
      { title: 'Páginas compartidas', description: 'Múltiples procesos pueden compartir las mismas páginas físicas de solo lectura, como el código ejecutable. El sistema mantiene estructuras de control para no liberar páginas que siguen en uso y gestionar su desalojo de forma segura.' },
      { title: 'Copiar en Escritura (Copy-On-Write / COW)', description: 'Con fork(), padre e hijo comparten inicialmente páginas de datos marcadas como solo lectura, sin clonar la memoria física. Ante una escritura, el sistema operativo copia únicamente la página modificada y la configura como lectura-escritura.' },
    ],
  },
]

export const topicById = (id: string) => topics.find((topic) => topic.id === id)
