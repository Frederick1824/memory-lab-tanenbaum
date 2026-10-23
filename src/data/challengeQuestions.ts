export interface ChallengeQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export const challengeQuestions: ChallengeQuestion[] = [
  {
    question: '¿Qué sucede cuando la tasa de fallos de página de un proceso supera el límite superior establecido por PFF (Page Fault Frequency)?',
    options: [
      'Se le asignan más marcos para responder a su conjunto de trabajo.',
      'Se le quitan marcos para dárselos a procesos más eficientes.',
      'El sistema operativo cambia automáticamente el algoritmo de reemplazo a FIFO.',
      'El proceso se suspende inmediatamente y se termina por falta de memoria.',
    ],
    answer: 0,
    explanation: 'PFF monitorea los fallos: si superan el límite superior, el proceso necesita más memoria, por lo que se le asignan marcos adicionales.',
  },
  {
    question: '¿Cuál es el propósito principal del algoritmo de control de carga PFF?',
    options: [
      'Determinar exactamente qué página física debe reemplazarse ante un fallo.',
      'Controlar dinámicamente la cantidad de marcos asignados a cada proceso.',
      'Calcular el tamaño óptimo de página con la fórmula de Belady.',
      'Gestionar el intercambio directo de procesos inactivos hacia el archivo de paginación.',
    ],
    answer: 1,
    explanation: 'PFF ajusta la asignación de marcos según la frecuencia de fallos para ayudar a evitar el thrashing.',
  },
  {
    question: 'Si PFF indica que varios procesos necesitan más marcos, pero la RAM está saturada y ninguno puede cederlos, ¿cuál es una solución real?',
    options: [
      'Implementar un algoritmo de reemplazo más rápido, como LRU aproximado.',
      'Aumentar el tamaño de página para reducir las tablas de páginas.',
      'Suspender temporalmente (swap out) uno o más procesos para liberar memoria.',
      'Cambiar de asignación global a asignación local.',
    ],
    answer: 2,
    explanation: 'Cuando no hay marcos libres suficientes, reducir temporalmente la carga mediante swap out de procesos puede liberar memoria.',
  },
  {
    question: '¿Qué consecuencia puede producirse si se suspenden demasiados procesos mediante swap out?',
    options: [
      'Aumentan exponencialmente los fallos de página globales en el bus.',
      'Disminuye la multiprogramación y la CPU puede quedar desaprovechada.',
      'Desaparece la fragmentación interna en las tablas secundarias.',
      'Todas las páginas activas pasan automáticamente a modo solo lectura.',
    ],
    answer: 1,
    explanation: 'Al sacar demasiados procesos a disco, baja el grado de multiprogramación y la CPU puede quedarse sin procesos listos para ejecutar.',
  },
  {
    question: 'Con un segmento s = 1 MB y un costo de entrada e = 8 bytes, ¿cuál es el tamaño óptimo de página según p = √(2·s·e)?',
    options: ['1024 bytes (1 KB)', '2048 bytes (2 KB)', '4096 bytes (4 KB)', '65536 bytes (64 KB)'],
    answer: 2,
    explanation: 'p = √(2 × 1,048,576 × 8) = √16,777,216 = 4096 bytes (4 KB).',
  },
  {
    question: 'Si se incrementa considerablemente el tamaño de página p, ¿cómo cambian la tabla de páginas y la fragmentación interna?',
    options: [
      'La tabla de páginas se reduce y la fragmentación interna promedio aumenta.',
      'Ambas disminuyen de forma lineal y proporcional.',
      'Ambas aumentan debido al espacio desperdiciado.',
      'La tabla de páginas se duplica y la fragmentación interna desaparece.',
    ],
    answer: 0,
    explanation: 'En la sobrecarga s·e/p + p/2, al aumentar p baja el costo de la tabla y sube la fragmentación interna promedio.',
  },
  {
    question: '¿Qué páginas se pueden compartir de forma segura entre un proceso padre y su hijo tras un fork()?',
    options: [
      'Las páginas modificables del heap.',
      'Las páginas de la pila de ejecución.',
      'Las páginas de solo lectura, como el segmento de código.',
      'Ninguna página se puede compartir.',
    ],
    answer: 2,
    explanation: 'Las páginas de solo lectura, como el código, se pueden compartir. Las páginas modificables pueden compartirse inicialmente con Copy-on-Write.',
  },
  {
    question: 'Tras fork(), el proceso hijo intenta escribir en una página compartida marcada como solo lectura. ¿Qué ocurre?',
    options: [
      'El sistema operativo termina el proceso hijo por violación de segmento.',
      'La página correspondiente del padre también se modifica.',
      'Se copian de golpe todas las páginas del padre al espacio del hijo.',
      'Se genera una excepción; el sistema operativo copia esa página y actualiza sus permisos.',
    ],
    answer: 3,
    explanation: 'El intento de escritura genera una excepción de protección; el sistema operativo crea una copia privada de esa página y actualiza el mapeo.',
  },
]
