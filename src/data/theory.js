/**
 * Conteúdo Didático Completo de Teoria da Cinemática
 */

export const THEORY_SECTIONS = [
  {
    id: 'referencial-trajetoria',
    title: '1. Referencial e Trajetória',
    badge: 'Conceitos Fundamentais',
    moduleId: 'velocidade-media',
    summary: 'O movimento e o repouso são estados relativos que dependem exclusivamente do sistema de referência adotado.',
    content: `Na Física, nenhum corpo está em repouso ou em movimento absoluto. Dizemos que um corpo está em movimento em relação a um **referencial** quando sua posição espacial varia com o passar do tempo. Se a posição não se altera com o tempo, o corpo está em repouso em relação a esse mesmo referencial.

A **trajetória** é a linha geométrica contínua descrita pelas sucessivas posições ocupadas pelo móvel durante o seu deslocamento. A forma da trajetória também depende do referencial: por exemplo, um objeto solto dentro de um trem em movimento retilíneo descreve uma linha reta vertical para um passageiro no trem, mas uma parábola para um observador fixo na estação exterior.`,
    example: {
      problem: 'Uma lâmpada se desprende do teto de um vagão que se move com velocidade constante de 20 m/s em relação aos trilhos. Qual a trajetória para o passageiro e para quem está na estação?',
      resolution: [
        'Para o passageiro no trem (referencial solidário ao trem): a lâmpada cai em linha reta vertical diretamente sob o ponto de fixação.',
        'Para o observador na plataforma externa: a lâmpada possui tanto o movimento vertical de queda quanto a velocidade horizontal do trem, descrevendo um arco parabólico.'
      ]
    }
  },
  {
    id: 'posicao-deslocamento-distancia',
    title: '2. Posição, Deslocamento e Distância Percorrida',
    badge: 'Grandezas Fundamentais',
    moduleId: 'velocidade-media',
    formula: '\\Delta s = s_f - s_0',
    summary: 'Deslocamento vetorial/escalar depende apenas dos pontos inicial e final, enquanto distância percorrida é a extensão total do caminho percorrido.',
    content: `A **posição** ($s$) de um móvel representa sua localização sobre uma trajetória orientada em relação a uma origem convencionada ($s = 0$).

O **deslocamento** ($\\Delta s$) é a variação líquida entre a posição final ($s_f$) e a posição inicial ($s_0$):
$$\\Delta s = s_f - s_0$$

A **distância percorrida** ($d$) é uma grandeza escalar sempre positiva (ou nula) que mede o comprimento total da trajetória efetivamente percorrida.
- Se um móvel sai de $s = 0\\text{ m}$, avança até $s = 80\\text{ m}$ e depois recua para $s = 30\\text{ m}$:
  - O deslocamento é: $\\Delta s = 30 - 0 = +30\\text{ m}$.
  - A distância total percorrida é: $d = 80 + |30 - 80| = 80 + 50 = 130\\text{ m}$.`,
    example: {
      problem: 'Um ciclista parte da posição s₀ = 20 m, vai até a posição 120 m e retorna para a posição 70 m. Determine o deslocamento escalar e a distância percorrida.',
      resolution: [
        'Deslocamento escalar: Δs = sf - s0 = 70 m - 20 m = +50 m.',
        'Distância na ida: d₁ = |120 m - 20 m| = 100 m.',
        'Distância no retorno: d₂ = |70 m - 120 m| = 50 m.',
        'Distância total: d = d₁ + d₂ = 100 m + 50 m = 150 m.'
      ]
    }
  },
  {
    id: 'velocidade-media-instantanea',
    title: '3. Velocidade Média e Velocidade Instantânea',
    badge: 'Taxa de Variação',
    moduleId: 'velocidade-media',
    formula: 'v_m = \\frac{\\Delta s}{\\Delta t}, \\quad v(t) = \\lim_{\\Delta t \\to 0} \\frac{\\Delta s}{\\Delta t}',
    summary: 'A velocidade média resume o percurso global; a velocidade instantânea indica a rapidez e direção em um instante exato.',
    content: `A **velocidade média** ($v_m$) avalia a rapidez com que a posição varia ao longo de um intervalo de tempo $\\Delta t = t_f - t_0$:
$$v_m = \\frac{\\Delta s}{\\Delta t} = \\frac{s_f - s_0}{t_f - t_0}$$

A unidade fundamental no Sistema Internacional (SI) é o **metro por segundo** ($\\text{m/s}$). Na prática cotidiana, é comum utilizar **quilômetros por hora** ($\\text{km/h}$), com a conversão:
$$1\\text{ m/s} = 3{,}6\\text{ km/h} \\quad \\Longleftrightarrow \\quad 1\\text{ km/h} = \\frac{1}{3{,}6}\\text{ m/s}$$

A **velocidade instantânea** $v(t)$ é a derivada da posição em relação ao tempo, correspondendo à leitura que o velocímetro de um carro marca a cada fração infinitesimal de segundo. No gráfico $s \\times t$, ela equivale à inclinação (coeficiente angular) da reta tangente à curva naquele instante.`,
    example: {
      problem: 'Um automóvel viaja entre duas cidades distantes 180 km em 2 horas e 30 minutos (2,5 h). Calcule sua velocidade média em km/h e em m/s.',
      resolution: [
        'Intervalo de tempo: Δt = 2,5 h.',
        'Deslocamento: Δs = 180 km.',
        'Velocidade média em km/h: vm = 180 / 2,5 = 72 km/h.',
        'Conversão para m/s: vm = 72 / 3,6 = 20 m/s.'
      ]
    }
  },
  {
    id: 'mru-teoria',
    title: '4. Movimento Retilíneo Uniforme (MRU)',
    badge: 'Velocidade Constante',
    moduleId: 'mru',
    formula: 's(t) = s_0 + v \\cdot t',
    summary: 'O corpo percorre distâncias iguais em intervalos de tempo iguais, sem aceleração (a = 0).',
    content: `No **Movimento Retilíneo Uniforme (MRU)**:
1. A trajetória é retilínea.
2. A velocidade escalar é constante e diferente de zero ($v = \\text{constante} \\neq 0$).
3. A aceleração escalar é nula em todo instante ($a = 0$).

A **função horária da posição** é uma equação linear do primeiro grau:
$$s(t) = s_0 + v \\cdot t$$
- $s(t)$: posição no instante $t$ (metros, $\\text{m}$)
- $s_0$: posição inicial no instante $t = 0$ (metros, $\\text{m}$)
- $v$: velocidade constante ($\\text{m/s}$)
- $t$: tempo decorrido (segundos, $\\text{s}$)

**Classificação do Movimento:**
- **Progressivo:** $v > 0$, o móvel caminha no sentido positivo da orientação da trajetória (as posições aumentam).
- **Retrógrado:** $v < 0$, o móvel caminha no sentido oposto à orientação da trajetória (as posições diminuem).`,
    example: {
      problem: 'Um objeto parte da posição s₀ = -30 m com velocidade constante v = 5 m/s. Em que instante ele passará pela origem das posições (s = 0)?',
      resolution: [
        'Função horária: s(t) = -30 + 5 · t.',
        'Condição de passagem pela origem: s(t) = 0.',
        '0 = -30 + 5 · t  =>  5 · t = 30  =>  t = 6 s.',
        'Conclusão: O móvel cruza a origem no instante t = 6 segundos.'
      ]
    }
  },
  {
    id: 'aceleracao-teoria',
    title: '5. Aceleração Média e Aceleração Escalar',
    badge: 'Variação da Velocidade',
    moduleId: 'mruv',
    formula: 'a_m = \\frac{\\Delta v}{\\Delta t} = \\frac{v_f - v_0}{t_f - t_0}',
    summary: 'A aceleração quantifica a taxa com que a velocidade varia por unidade de tempo.',
    content: `A **aceleração média** ($a_m$) expressa o ritmo de alteração da velocidade vetorial/escalar ao longo do tempo:
$$a_m = \\frac{\\Delta v}{\\Delta t}$$
No Sistema Internacional, a unidade é o **metro por segundo ao quadrado** ($\\text{m/s}^2$). Uma aceleração de $3\\text{ m/s}^2$ significa que a cada 1 segundo transcorrido, a velocidade do corpo é alterada em $3\\text{ m/s}$.

**Tipos de Movimento:**
- **Acelerado:** velocidade e aceleração têm o mesmo sinal ($v \\cdot a > 0$). O módulo da velocidade (rapidez) aumenta com o tempo.
- **Retardado:** velocidade e aceleração têm sinais contrários ($v \\cdot a < 0$). O módulo da velocidade diminui ao longo do tempo (frenagem).`,
    example: {
      problem: 'Um carro de Fórmula 1 acelera de 0 a 108 km/h em 3,0 segundos. Qual a sua aceleração média em m/s²?',
      resolution: [
        'Conversão da velocidade final: vf = 108 / 3,6 = 30 m/s.',
        'Velocidade inicial: v0 = 0 m/s.',
        'Intervalo de tempo: Δt = 3,0 s.',
        'Cálculo da aceleração: am = (30 - 0) / 3,0 = 10 m/s².'
      ]
    }
  },
  {
    id: 'mruv-teoria',
    title: '6. Movimento Retilíneo Uniformemente Variado (MRUV)',
    badge: 'Aceleração Constante',
    moduleId: 'mruv',
    formula: 'v(t) = v_0 + a t, \\quad s(t) = s_0 + v_0 t + \\frac{1}{2} a t^2, \\quad v^2 = v_0^2 + 2 a \\Delta s',
    summary: 'A velocidade varia linearmente com o tempo e a posição varia de forma quadrática (parabólica).',
    content: `No **MRUV**, a trajetória é reta e a aceleração é constante e não-nula ($a = \\text{constante} \\neq 0$).

As três equações fundamentais são:
1. **Função horária da velocidade:**
$$v(t) = v_0 + a \\cdot t$$
2. **Função horária da posição:**
$$s(t) = s_0 + v_0 \\cdot t + \\frac{1}{2} a \\cdot t^2$$
3. **Equação de Torricelli:**
$$v^2 = v_0^2 + 2 \\cdot a \\cdot \\Delta s$$
A equação de Torricelli relaciona velocidade, aceleração e deslocamento **sem depender diretamente do tempo**, sendo extremamente útil quando o tempo não é fornecido e nem solicitado.`,
    example: {
      problem: 'Um trem trafegando a 20 m/s é freado com aceleração constante de magnitude 2 m/s² até parar completamente. Calcule a distância percorrida durante a frenagem.',
      resolution: [
        'Dados: v0 = 20 m/s, vf = 0 m/s (parou), a = -2 m/s² (frenagem).',
        'Usando Torricelli: v² = v0² + 2 · a · Δs.',
        '0² = 20² + 2 · (-2) · Δs  =>  0 = 400 - 4 · Δs.',
        '4 · Δs = 400  =>  Δs = 100 metros.'
      ]
    }
  },
  {
    id: 'queda-livre-lancamento-teoria',
    title: '7. Queda Livre e Lançamento Vertical',
    badge: 'Gravidade Terrestre',
    moduleId: 'queda-livre',
    formula: 'h(t) = h_0 + v_0 t - \\frac{1}{2} g t^2, \\quad v(t) = v_0 - g t',
    summary: 'Movimento vertical sob a influência exclusiva do campo gravitacional com aceleração g = 9,81 m/s².',
    content: `Próximo à superfície terrestre e desprezando os efeitos da resistência do ar, todos os corpos caem com a **mesma aceleração**, independentemente de sua massa ou formato geométrico.

Adotando o referencial vertical com sentido positivo apontando para **cima**:
- Aceleração: $a = -g = -9{,}81\\text{ m/s}^2$
- Velocidade: $v(t) = v_0 - g \\cdot t$
- Altura: $h(t) = h_0 + v_0 \\cdot t - \\frac{1}{2} g \\cdot t^2$

**Propriedades notáveis do Lançamento Vertical:**
- No ponto mais alto (ápice), a velocidade instantânea é exatamente nula ($v = 0$), porém a aceleração da gravidade continua atuando ($a = -g$).
- Tempo de subida: $t_{\\text{subida}} = \\frac{v_0}{g}$.
- Altura máxima: $h_{\\max} = h_0 + \\frac{v_0^2}{2g}$.
- Em um mesmo nível de altura, o módulo da velocidade de subida é igual ao módulo da velocidade de descida.`,
    example: {
      problem: 'Uma bola de tênis é lançada verticalmente para cima a partir do solo (h₀ = 0) com velocidade de 19,62 m/s. Adotando g = 9,81 m/s², determine o tempo até o ponto mais alto e a altura máxima.',
      resolution: [
        'Tempo de subida: t_pico = v0 / g = 19,62 / 9,81 = 2,0 segundos.',
        'Altura máxima: h_max = (19,62)² / (2 · 9,81) = 384,94 / 19,62 = 19,62 metros.',
        'No instante t = 2,0 s, a velocidade se anula instantaneamente e a bola inicia a descida.'
      ]
    }
  },
  {
    id: 'interpretacao-graficos-teoria',
    title: '8. Interpretação Geométrica de Gráficos',
    badge: 'Análise Gráfica',
    moduleId: 'mru',
    summary: 'Aprenda a extrair informações físicas por meio do cálculo de inclinações e áreas sob as curvas.',
    content: `A análise gráfica é um dos pilares do raciocínio físico em cinemática:

### 1. Inclinação (Coeficiente Angular / Tangente)
- No gráfico **Posição × Tempo ($s \\times t$):**
  A inclinação da reta tangente em qualquer ponto fornece a **velocidade** do corpo:
  $$\\text{inclinação} = \\frac{\\Delta s}{\\Delta t} = v$$
  - Reta horizontal: inclinação nula $\\implies v = 0$ (repouso).
  - Reta inclinada para cima: $v > 0$ (movimento progressivo).
  - Reta inclinada para baixo: $v < 0$ (movimento retrógrado).
  - Curva parabólica côncava para cima: $a > 0$.
  - Curva parabólica côncava para baixo: $a < 0$.

- No gráfico **Velocidade × Tempo ($v \\times t$):**
  A inclinação fornece a **aceleração**:
  $$\\text{inclinação} = \\frac{\\Delta v}{\\Delta t} = a$$

### 2. Área sob a Curva
- No gráfico **Velocidade × Tempo ($v \\times t$):**
  A área algébrica limitada pela curva e pelo eixo temporal representa o **deslocamento** ($\\Delta s$):
  $$\\text{Área} = \\Delta s$$
  - Áreas acima do eixo $t$ representam deslocamento positivo.
  - Áreas abaixo do eixo $t$ representam deslocamento negativo.
  - A **distância percorrida total** é a soma dos módulos das áreas.

- No gráfico **Aceleração × Tempo ($a \\times t$):**
  A área sob a curva representa a variação de velocidade ($\\Delta v$).`,
    example: {
      problem: 'Em um gráfico v × t, a velocidade parte de 0 e cresce linearmente até 20 m/s em 6 segundos. Calcule o deslocamento.',
      resolution: [
        'A figura geométrica sob a reta é um triângulo retângulo de base b = 6 s e altura h = 20 m/s.',
        'Área = (base · altura) / 2 = (6 · 20) / 2 = 60.',
        'Propriedade física: Área = Δs = 60 metros.'
      ]
    }
  }
];
