export const MODULES = [
  {
    id: 'velocidade-media',
    number: 1,
    title: 'Velocidade Média',
    subtitle: 'Relação fundamental entre deslocamento e tempo',
    formula: 'v_m = \\frac{\\Delta s}{\\Delta t}',
    description: 'Compreenda a velocidade média como a taxa de variação da posição em relação ao tempo e diferencie deslocamento de distância percorrida.',
    iconName: 'Gauge',
    color: '#0284c7', // Sky Blue
    badge: 'Conceito Base',
    tags: ['Δs', 'Δt', 'vm', 'Distância']
  },
  {
    id: 'mru',
    number: 2,
    title: 'Movimento Retilíneo Uniforme (MRU)',
    subtitle: 'Velocidade constante e aceleração nula',
    formula: 's(t) = s_0 + v \\cdot t',
    description: 'Observe um objeto em movimento com velocidade constante, analise a função horária da posição e veja como a inclinação do gráfico s × t representa a velocidade.',
    iconName: 'TrendingUp',
    color: '#059669', // Emerald Green
    badge: 'Movimento Uniforme',
    tags: ['s(t)', 'Velocidade Constante', 'a = 0']
  },
  {
    id: 'mruv',
    number: 3,
    title: 'Movimento Uniformemente Variado (MRUV)',
    subtitle: 'Aceleração constante e Equação de Torricelli',
    formula: 's(t) = s_0 + v_0 t + \\frac{1}{2} a t^2',
    formulaTorricelli: 'v^2 = v_0^2 + 2 a \\Delta s',
    description: 'Explore a aceleração constante, a curvatura parabólica do gráfico de posição, a variação linear da velocidade e a clássica equação de Torricelli.',
    iconName: 'Zap',
    color: '#d97706', // Amber
    badge: 'Aceleração Constante',
    tags: ['Aceleração', 'Torricelli', 'Parábola']
  },
  {
    id: 'queda-livre',
    number: 4,
    title: 'Queda Livre',
    subtitle: 'Gravidade e comparação com resistência do ar',
    formula: 'h(t) = h_0 - \\frac{1}{2} g t^2',
    description: 'Solte corpos a partir de diferentes alturas com gravidade real (g = 9,81 m/s²) e ative a resistência do ar para visualizar a velocidade terminal.',
    iconName: 'ArrowDownCircle',
    color: '#dc2626', // Red
    badge: 'Gravidade',
    tags: ['Gravidade g', 'Velocidade Terminal', 'Impacto']
  },
  {
    id: 'lancamento-vertical',
    number: 5,
    title: 'Lançamento Vertical',
    subtitle: 'Subida contra a gravidade, ápice e retorno',
    formula: 't_{\\text{pico}} = \\frac{v_0}{g}, \\quad h_{\\max} = h_0 + \\frac{v_0^2}{2g}',
    description: 'Lance corpos para cima, analise o instante no qual a velocidade se anula no topo da trajetória enquanto a gravidade permanece inalterada.',
    iconName: 'Rocket',
    color: '#7c3aed', // Purple
    badge: 'Movimento Vertical',
    tags: ['Ápice', 'v = 0 no topo', 'Tempo de Voo']
  },
  {
    id: 'movimento-relativo',
    number: 6,
    title: 'Movimento Relativo e Encontro',
    subtitle: 'Intersecção de trajetórias de dois móveis',
    formula: 't_{\\text{encontro}} = \\frac{s_{20} - s_{10}}{v_1 - v_2}',
    description: 'Coloque dois veículos em uma mesma pista com velocidades e sentidos distintos e determine analiticamente o instante e a posição de encontro.',
    iconName: 'GitFork',
    color: '#2563eb', // Royal Blue
    badge: 'Dois Corpos',
    tags: ['Cruzamento de Gráficos', 'Ultrapassagem', 'Sentidos Opostos']
  }
];
