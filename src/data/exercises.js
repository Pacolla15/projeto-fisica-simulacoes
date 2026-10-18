/**
 * Banco de Exercícios Interativos de Cinemática
 */

export const EXERCISES = [
  // --- VELOCIDADE MÉDIA ---
  {
    id: 'ex-vm-1',
    moduleId: 'velocidade-media',
    type: 'numeric',
    difficulty: 'Iniciante',
    title: 'Deslocamento e Velocidade Média',
    question: 'Um veículo parte do marco quilométrico s₀ = 30 m e atinge a posição final sf = 150 m em um intervalo de tempo de 12 segundos. Calcule a velocidade média do veículo em m/s.',
    correctValue: 10,
    unit: 'm/s',
    tolerance: 0.1,
    hint: 'Lembre-se de calcular primeiro a variação da posição Δs = sf - s0 e depois dividir pelo intervalo de tempo Δt.',
    explanation: [
      'Passo 1: Identificar os dados fornecidos: s₀ = 30 m, sf = 150 m e Δt = 12 s.',
      'Passo 2: Calcular o deslocamento: Δs = sf - s₀ = 150 - 30 = 120 m.',
      'Passo 3: Aplicar a definição de velocidade média: vm = Δs / Δt = 120 / 12 = 10 m/s.'
    ]
  },
  {
    id: 'ex-vm-2',
    moduleId: 'velocidade-media',
    type: 'choice',
    difficulty: 'Intermediário',
    title: 'Deslocamento vs Distância Percorrida',
    question: 'Um atleta corre 400 metros completando exatamente uma volta completa em uma pista circular de atletismo e retorna ao ponto de partida em 50 segundos. Qual é o seu deslocamento escalar e sua velocidade média vetorial/escalar correspondente?',
    options: [
      'Deslocamento = 400 m; Velocidade Média = 8 m/s',
      'Deslocamento = 0 m; Velocidade Média = 0 m/s',
      'Deslocamento = 200 m; Velocidade Média = 4 m/s',
      'Deslocamento = 0 m; Velocidade Média = 8 m/s'
    ],
    correctIndex: 1,
    hint: 'Analise onde o atleta iniciou o movimento e onde ele terminou. O deslocamento depende da trajetória ou apenas da posição inicial e final?',
    explanation: [
      'O deslocamento vetorial/escalar é definido por Δs = sf - s₀.',
      'Como o atleta retornou exatamente ao ponto de partida, sua posição final coincide com a inicial (sf = s₀), logo o deslocamento é rigorosamente Δs = 0 m.',
      'Como a velocidade média escalar média global é vm = Δs / Δt = 0 / 50 = 0 m/s.',
      'Atenção: A distância percorrida foi de 400 m (rapidez média escalar = 400 / 50 = 8 m/s), mas o deslocamento e a velocidade média são nulos!'
    ]
  },

  // --- MRU ---
  {
    id: 'ex-mru-1',
    moduleId: 'mru',
    type: 'numeric',
    difficulty: 'Iniciante',
    title: 'Posição no MRU',
    question: 'Um móvel executa MRU obedecendo à função horária s(t) = 15 + 8 · t (em unidades do SI). Qual será a posição do móvel no instante t = 6 segundos?',
    correctValue: 63,
    unit: 'm',
    tolerance: 0.1,
    hint: 'Substitua o valor de t = 6 s diretamente na função horária da posição.',
    explanation: [
      'Dada a função s(t) = 15 + 8 · t:',
      'Substituindo t = 6 s: s(6) = 15 + 8 · (6) = 15 + 48 = 63 m.',
      'Portanto, aos 6 segundos o móvel se encontra a 63 metros da origem.'
    ]
  },
  {
    id: 'ex-mru-2',
    moduleId: 'mru',
    type: 'choice',
    difficulty: 'Intermediário',
    title: 'Interpretação Gráfica do MRU',
    question: 'No gráfico da posição em função do tempo (s × t) de um Movimento Retilíneo Uniforme, o que representa a inclinação (coeficiente angular) da reta?',
    options: [
      'A aceleração constante do móvel.',
      'O deslocamento total percorrido.',
      'A velocidade constante do móvel.',
      'A força resultante aplicada ao corpo.'
    ],
    correctIndex: 2,
    hint: 'A inclinação é calculada dividindo a variação no eixo vertical (Δs) pela variação no eixo horizontal (Δt). O que resulta de Δs / Δt?',
    explanation: [
      'A inclinação do gráfico s × t é dada pela razão matemática Δs / Δt.',
      'Na física, essa razão define a velocidade: v = Δs / Δt.',
      'Se a reta for inclinada para cima, a velocidade é positiva (progressivo); se for horizontal, v = 0; se for inclinada para baixo, v < 0 (retrógrado).'
    ]
  },

  // --- MRUV ---
  {
    id: 'ex-mruv-1',
    moduleId: 'mruv',
    type: 'numeric',
    difficulty: 'Intermediário',
    title: 'Cálculo de Deslocamento no MRUV',
    question: 'Um carro parte do repouso (v₀ = 0) com aceleração constante de a = 3 m/s². Qual é a distância percorrida pelo veículo após 4 segundos?',
    correctValue: 24,
    unit: 'm',
    tolerance: 0.1,
    hint: 'Use a função horária do espaço no MRUV: Δs = v₀ · t + (1/2) · a · t² com v₀ = 0.',
    explanation: [
      'Dados: v₀ = 0 m/s, a = 3 m/s², t = 4 s.',
      'Equação: Δs = v₀ · t + 0.5 · a · t².',
      'Substituindo: Δs = 0 · 4 + 0.5 · 3 · (4)² = 0 + 1.5 · 16 = 24 metros.'
    ]
  },
  {
    id: 'ex-mruv-2',
    moduleId: 'mruv',
    type: 'numeric',
    difficulty: 'Avançado',
    title: 'Equação de Torricelli',
    question: 'Um trem que trafega a uma velocidade de 25 m/s aciona os freios de emergência, desacelerando a uma taxa constante de magnitude a = 2,5 m/s² até parar completamente. Quantos metros ele percorre durante essa frenagem?',
    correctValue: 125,
    unit: 'm',
    tolerance: 0.5,
    hint: 'Como o problema não menciona o tempo de frenagem, a Equação de Torricelli v² = v₀² + 2 · a · Δs é a ferramenta ideal (com vf = 0 e a negativa).',
    explanation: [
      'Dados: v₀ = 25 m/s, vf = 0 m/s (parou), a = -2,5 m/s² (frenagem).',
      'Equação de Torricelli: vf² = v₀² + 2 · a · Δs.',
      '0² = (25)² + 2 · (-2,5) · Δs.',
      '0 = 625 - 5 · Δs  =>  5 · Δs = 625  =>  Δs = 125 metros.'
    ]
  },

  // --- QUEDA LIVRE ---
  {
    id: 'ex-ql-1',
    moduleId: 'queda-livre',
    type: 'numeric',
    difficulty: 'Intermediário',
    title: 'Tempo de Queda Livre',
    question: 'Uma esfera de metal é solta do repouso a partir de uma altura de h = 44,145 metros em relação ao solo. Adotando g = 9,81 m/s² e desprezando o atrito com o ar, quantos segundos ela demora para atingir o solo?',
    correctValue: 3,
    unit: 's',
    tolerance: 0.1,
    hint: 'Para queda a partir do repouso (v₀ = 0), a distância de queda é h = (1/2) · g · t². Isole o tempo t.',
    explanation: [
      'Dados: h = 44,145 m, v₀ = 0 m/s, g = 9,81 m/s².',
      'Equação de queda: h = (1/2) · g · t²  =>  44,145 = 0,5 · 9,81 · t².',
      '44,145 = 4,905 · t²  =>  t² = 44,145 / 4,905 = 9.',
      't = √9 = 3,0 segundos.'
    ]
  },
  {
    id: 'ex-ql-2',
    moduleId: 'queda-livre',
    type: 'choice',
    difficulty: 'Intermediário',
    title: 'Velocidade Terminal com Resistência do Ar',
    question: 'Quando um objeto cai em um fluido (como a atmosfera) sujeito à resistência do ar que aumenta com o quadrado da velocidade, o que acontece com a aceleração e com a velocidade quando o corpo atinge a velocidade terminal?',
    options: [
      'A aceleração se torna nula (a = 0) e a velocidade permanece constante.',
      'A velocidade se anula e o corpo para no ar.',
      'A aceleração atinge seu valor máximo e a velocidade continua aumentando.',
      'A aceleração se torna infinita devido ao atrito.'
    ],
    correctIndex: 0,
    hint: 'Na velocidade terminal, a força de resistência do ar para cima equilibra perfeitamente o peso para baixo. Qual é a força resultante?',
    explanation: [
      'Conforme a velocidade de queda aumenta, a força de arrasto do ar (oposta ao movimento) cresce até se igualar em módulo à força peso do objeto.',
      'Quando Força de Arrasto = Peso, a força resultante sobre o corpo se anula (Fr = 0).',
      'Pela 2ª Lei de Newton (Fr = m · a), a aceleração torna-se zero (a = 0).',
      'Sem aceleração, o corpo atinge a velocidade terminal e passa a descer em Movimento Retilíneo Uniforme.'
    ]
  },

  // --- LANÇAMENTO VERTICAL ---
  {
    id: 'ex-lv-1',
    moduleId: 'lancamento-vertical',
    type: 'numeric',
    difficulty: 'Intermediário',
    title: 'Altura Máxima no Lançamento',
    question: 'Um projétil é disparado verticalmente para cima a partir do solo com velocidade v₀ = 19,62 m/s. Adotando g = 9,81 m/s², qual é a altura máxima atingida (em metros)?',
    correctValue: 19.62,
    unit: 'm',
    tolerance: 0.1,
    hint: 'No ponto mais alto a velocidade se anula (v = 0). Utilize Torricelli ou h_max = v₀² / (2g).',
    explanation: [
      'Dados: v₀ = 19,62 m/s, v = 0 m/s no ápice, g = 9,81 m/s².',
      'Fórmula da altura máxima: h_max = v₀² / (2 · g).',
      'h_max = (19,62)² / (2 · 9,81) = 384,9444 / 19,62 = 19,62 metros.'
    ]
  },
  {
    id: 'ex-lv-2',
    moduleId: 'lancamento-vertical',
    type: 'choice',
    difficulty: 'Avançado',
    title: 'Estado Físico no Ponto Mais Alto',
    question: 'No ponto de altura máxima de um lançamento vertical para cima (desprezando a resistência do ar), quais são os valores da velocidade e da aceleração do corpo?',
    options: [
      'Velocidade = 0 e Aceleração = 0',
      'Velocidade = 0 e Aceleração = 9,81 m/s² orientada para baixo',
      'Velocidade = 9,81 m/s e Aceleração = 0',
      'Velocidade máxima e Aceleração = 9,81 m/s² orientada para cima'
    ],
    correctIndex: 1,
    hint: 'Lembre-se: a atração gravitacional da Terra deixa de atuar sobre o objeto em algum instante?',
    explanation: [
      'No ponto de altura máxima (inversão do movimento), a velocidade instantânea é exatamente zero (v = 0 m/s).',
      'No entanto, a força gravitacional da Terra continua atuando ininterruptamente sobre o corpo.',
      'Portanto, a aceleração NÃO é nula! Ela permanece sendo a aceleração da gravidade: a = g = 9,81 m/s² orientada para o centro da Terra (para baixo).'
    ]
  },

  // --- MOVIMENTO RELATIVO E ENCONTRO ---
  {
    id: 'ex-rel-1',
    moduleId: 'movimento-relativo',
    type: 'numeric',
    difficulty: 'Intermediário',
    title: 'Instante de Encontro entre Móveis',
    question: 'Dois carros, A e B, movem-se na mesma estrada retilínea no mesmo sentido. O carro A parte da posição sA₀ = 0 m com vA = 25 m/s. O carro B parte da posição sB₀ = 100 m com vB = 15 m/s. Após quantos segundos o carro A alcançará o carro B?',
    correctValue: 10,
    unit: 's',
    tolerance: 0.1,
    hint: 'No instante do encontro: sA(t) = sB(t). Igualando 0 + 25t = 100 + 15t.',
    explanation: [
      'Função horária de A: sA(t) = 0 + 25 · t.',
      'Função horária de B: sB(t) = 100 + 15 · t.',
      'Condição de encontro: sA(t) = sB(t).',
      '25 · t = 100 + 15 · t  =>  10 · t = 100  =>  t = 10 segundos.',
      'Posição de encontro: s(10) = 25 · 10 = 250 metros.'
    ]
  },
  {
    id: 'ex-rel-2',
    moduleId: 'movimento-relativo',
    type: 'choice',
    difficulty: 'Iniciante',
    title: 'Condição para Não Haver Encontro no MRU',
    question: 'Dois automóveis trafegam em uma rodovia plana e reta no mesmo sentido em Movimento Retilíneo Uniforme (MRU). Em qual situação é fisicamente impossível que eles venham a se encontrar no futuro?',
    options: [
      'Quando o automóvel que está atrás possui velocidade estritamente maior que o da frente.',
      'Quando ambos possuem posições iniciais distintas e velocidades rigorosamente iguais.',
      'Quando ambos partem da mesma posição inicial com velocidades diferentes.',
      'Quando trafegam em sentidos opostos.'
    ],
    correctIndex: 1,
    hint: 'Se a velocidade de aproximação relativa (vA - vB) for zero, a distância entre eles diminuirá?',
    explanation: [
      'No MRU com velocidades iguais (v₁ = v₂), a velocidade relativa entre os dois veículos é zero (v_rel = 0).',
      'A distância que os separa permanece rigorosamente constante ao longo do tempo.',
      'Se iniciaram em posições distintas (s₁₀ ≠ s₂₀), as retas no gráfico s × t são perfeitamente paralelas e nunca se cruzam.'
    ]
  }
];
