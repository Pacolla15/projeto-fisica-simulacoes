# 🔬 FísicaLab — Plataforma Educacional Interativa de Cinemática

Uma plataforma educacional completa, moderna e interativa dedicada ao ensino de **Cinemática**, inspirada na filosofia pedagógica e visual do *PhET Interactive Simulations* (Universidade do Colorado, Boulder).

O projeto une teoria rigorosa, fórmulas matemáticas renderizadas com KaTeX, simulações visuais em tempo real movidas por equações físicas reais, gráficos científicos sincronizados e um banco interativo de exercícios com correção imediata e resolução passo a passo.

---

## 🎯 Objetivos Educacionais

- **Para Professores:**
  - Utilizar as simulações em sala de aula através do **Modo Professor (Apresentação / Projetor)**, com tipografia de alta legibilidade, contraste reforçado e ocultação de menus secundários.
  - Demonstrar fenômenos físicos manipulando variáveis em tempo real (posição, velocidade, aceleração, resistência do ar).
  - Explicar visualmente o significado das equações horárias, da Equação de Torricelli e da interpretação geométrica de gráficos (inclinações como taxas de variação e áreas como grandezas acumuladas).

- **Para Alunos:**
  - Estudar os fundamentos em sequência didática estruturada.
  - Testar hipóteses através das **Perguntas de Investigação** presentes em cada módulo.
  - Resolver exercícios conceituais e numéricos com feedback imediato, sem que a resposta seja revelada antes da tentativa.
  - Desenvolver intuição científica observando a relação entre causa e efeito nas variáveis físicas.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** [React 18](https://react.dev/) com [Vite](https://vitejs.dev/)
- **Linguagem:** JavaScript Moderno (ES6+)
- **Estilização:** CSS3 puro modularizado com variáveis de design e suporte a temas (Modo Normal e Modo Professor)
- **Gráficos Científicos:** [Recharts](https://recharts.org/) com indicadores de tempo simulado e interpretação física de inclinações e áreas
- **Fórmulas Matemáticas:** [KaTeX](https://katex.org/) para renderização tipográfica precisa no padrão LaTeX com substituição viva de valores
- **Ícones Profissionais:** [Lucide React](https://lucide.dev/) (sem utilização de emojis na interface)
- **Testes Automatizados:** [Vitest](https://vitest.dev/) para validação científica de todas as equações
- **Deploy & SPA:** [Vercel](https://vercel.com/) com suporte a rewrites de roteamento estático (`vercel.json`)

---

## 📐 Fórmulas e Módulos Implementados

A plataforma implementa 6 módulos completos de Cinemática:

### 1. Velocidade Média
$$v_m = \frac{\Delta s}{\Delta t} = \frac{s_f - s_0}{t_f - t_0}$$
- **Simulação:** Trajetória retilínea em pista horizontal com régua graduada, controle de posição inicial ($s_0$), final ($s_f$) e intervalo de tempo ($\Delta t$).
- **Conceitos:** Diferenciação visual entre deslocamento escalar ($\Delta s$) e distância percorrida ($d$). Gráfico $s \times t$.

### 2. Movimento Retilíneo Uniforme (MRU)
$$s(t) = s_0 + v \cdot t, \quad a = 0$$
- **Simulação:** Velocidade constante e aceleração nula. Suporte a velocidades positivas (progressivo) e negativas (retrógrado).
- **Recurso Avançado:** **Modo Comparativo de Dois Móveis**, permitindo observar ultrapassagens e analisar quando um móvel mais rápido alcança o outro. Gráficos de $s \times t$ e $v \times t$.

### 3. Movimento Retilíneo Uniformemente Variado (MRUV)
$$v(t) = v_0 + a \cdot t$$
$$s(t) = s_0 + v_0 t + \frac{1}{2} a t^2$$
$$v^2 = v_0^2 + 2 a \Delta s \quad \text{(Equação de Torricelli)}$$
- **Simulação:** Veículo com aceleração positiva ou negativa (frenagem). Curvatura parabólica no gráfico $s \times t$ com comparação em tempo real com MRU equivalente.
- **Destaque:** Demonstração interativa da **Equação de Torricelli** calculando a velocidade a partir de $\Delta s$ sem depender do tempo.

### 4. Queda Livre e Resistência do Ar
$$v(t) = v_0 - g t$$
$$h(t) = h_0 + v_0 t - \frac{1}{2} g t^2$$
- **Simulação:** Objeto em queda vertical solto de uma torre de altura $h_0$ sob aceleração gravitacional ($g = 9{,}81\text{ m/s}^2$). Identificação precisa do impacto com o solo.
- **Modelo de Resistência do Ar:** Integração numérica do arrasto aerodinâmico ($F_{\text{drag}} = -k \cdot v \cdot |v|$), demonstrando como a aceleração tende a zero e a velocidade se estabiliza na **velocidade terminal** $v_{\text{terminal}} = \sqrt{\frac{m \cdot g}{k}}$.

### 5. Lançamento Vertical para Cima
$$t_{\text{pico}} = \frac{v_0}{g}, \quad h_{\max} = h_0 + \frac{v_0^2}{2g}$$
- **Simulação:** Subida e descida com controle de velocidade de lançamento ($v_0$) e altura inicial ($h_0$).
- **Rigor Científico:** Demonstração explícita de que no ponto mais alto a velocidade se anula instantaneamente ($v = 0$), enquanto a aceleração da gravidade continua atuando ininterruptamente ($a = -g$).

### 6. Movimento Relativo e Encontro de Objetos
$$s_1(t) = s_{10} + v_1 t, \quad s_2(t) = s_{20} + v_2 t$$
$$t_{\text{encontro}} = \frac{s_{20} - s_{10}}{v_1 - v_2}$$
- **Simulação:** Pista horizontal dupla com dois carros em sentidos iguais ou opostos.
- **Tratamento Físico:** Identificação analítica do ponto exato de encontro, casos de paralelismo sem encontro ($v_1 = v_2$), e gráfico $s \times t$ destacando a intersecção das trajetórias.

---

## 🗂️ Estrutura das Pastas

```text
projeto-fisica/
├── public/
├── src/
│   ├── components/
│   │   ├── FormulaCard.jsx           # Renderização KaTeX com substituição viva
│   │   ├── Header.jsx                # Cabeçalho, navegação, Modo Professor e Fullscreen
│   │   ├── Footer.jsx                # Rodapé com metadados e atalhos didáticos
│   │   ├── NumericInput.jsx          # Slider e caixa numérica sincronizados
│   │   ├── PhysicsChart.jsx          # Gráficos Recharts com notas de inclinação e área
│   │   ├── SimulationCanvas.jsx      # Canvas SVG interativo (pistas, torres, vetores)
│   │   └── SimulationControls.jsx    # Play, Pause, Passo, Reset e Seletor de Velocidade
│   ├── data/
│   │   ├── exercises.js              # Banco de questões (conceituais e numéricas)
│   │   ├── modulesMeta.js            # Metadados e identificação dos 6 módulos
│   │   └── theory.js                 # Textos teóricos completos e exemplos passo a passo
│   ├── pages/
│   │   ├── Exercises.jsx             # Página de exercícios com placar e resolução
│   │   ├── Home.jsx                  # Página inicial com hero e cards dos módulos
│   │   ├── NotFound.jsx              # Página 404 amigável
│   │   ├── Simulations.jsx           # Hub de simulações com alternância rápida
│   │   └── Theory.jsx                # Enciclopédia de teoria com busca e índice
│   ├── physics/
│   │   ├── kinematics.js             # Motor matemático com cálculos físicos SI
│   │   ├── kinematics.test.js        # Testes automatizados com Vitest
│   │   ├── units.js                  # Grandezas SI e conversores de unidade
│   │   └── validation.js             # Validação numérica e resolução de equações
│   ├── styles/
│   │   ├── components.css            # Estilização dos componentes e Modo Professor
│   │   └── index.css                 # Variáveis CSS globais e tipografia
│   ├── App.jsx                       # Componente raiz com roteador SPA e persistência
│   └── main.jsx                      # Ponto de entrada do React
├── index.html                        # Template HTML com KaTeX e fontes
├── package.json                      # Dependências e scripts
├── vercel.json                       # Configuração de rewrites para Vercel
├── vite.config.js                    # Configuração Vite com chunk splitting
├── .gitignore                        # Arquivos ignorados pelo Git
└── README.md                         # Documentação completa do projeto
```

---

## 💻 Pré-requisitos

- **Node.js:** Versão 18.0.0 ou superior (testado com sucesso no Node.js v24.14.0)
- **npm:** Versão 9.0.0 ou superior

---

## ⚙️ Instalação e Execução Local

### No Windows (PowerShell ou Prompt de Comando):

1. **Instalar as dependências:**
   ```powershell
   npm install
   ```

2. **Executar o servidor de desenvolvimento:**
   ```powershell
   npm run dev
   ```
   Abra no seu navegador o endereço indicado (por padrão, `http://localhost:5173`).

3. **Executar os testes automatizados:**
   ```powershell
   npm test
   ```

4. **Gerar o build otimizado para produção:**
   ```powershell
   npm run build
   ```

5. **Testar localmente o build de produção:**
   ```powershell
   npm run preview
   ```

---

### No Linux ou macOS (Bash / Zsh):

```bash
# 1. Instalar dependências
npm install

# 2. Executar em modo de desenvolvimento
npm run dev

# 3. Executar testes de validação matemática
npm test

# 4. Gerar build de produção
npm run build

# 5. Visualizar build
npm run preview
```

---

## 🧪 Validação Matemática e Testes Automatizados

O projeto inclui suíte de testes com **Vitest** (`npm test`), validando os cenários obrigatórios de precisão física:

1. **MRU:** Com posição inicial $0\text{ m}$ e velocidade $10\text{ m/s}$, após $5\text{ s}$ a posição calculada é rigorosamente $50\text{ m}$.
2. **MRUV:** Com velocidade inicial $0\text{ m/s}$ e aceleração $2\text{ m/s}^2$, após $5\text{ s}$ a velocidade é $10\text{ m/s}$ e o deslocamento é $25\text{ m}$. Satisfaz a Equação de Torricelli $v^2 = v_0^2 + 2a\Delta s$.
3. **Queda Livre:** A partir do repouso sem resistência do ar, após $2\text{ s}$ a distância de queda é de aproximadamente $19{,}62\text{ m}$.
4. **Lançamento Vertical:** No ápice da trajetória, a velocidade vertical instantânea anula-se rigorosamente ($v = 0$), mantendo a aceleração da gravidade $a = -9{,}81\text{ m/s}^2$.
5. **Movimento Relativo:** Dois objetos com a mesma posição inicial encontram-se em $t = 0\text{ s}$; se tiverem velocidades iguais e posições iniciais distintas, não se encontram.
6. **Proteções:** Rejeição de divisão por zero ($\Delta t \le 0$) e tolerâncias numéricas adequadas.

---

## 🌐 Publicação no GitHub e Deploy na Vercel

### 1. Publicar no GitHub

No diretório do projeto, execute os seguintes comandos:

```powershell
# Inicializar o repositório Git (caso ainda não esteja inicializado)
git init

# Adicionar todos os arquivos
git add .

# Criar o primeiro commit
git commit -m "feat: plataforma educacional interativa de fisica - cinematica"

# Conectar ao repositório remoto no GitHub (substitua pela sua URL)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Definir a branch principal e enviar os arquivos
git branch -M main
git push -u origin main
```

---

### 2. Deploy Gratuito na Vercel

A aplicação está 100% pronta para ser publicada na Vercel sem necessidade de qualquer servidor backend ativo:

1. Acesse [vercel.com](https://vercel.com/) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** ➔ **"Project"**.
3. Selecione o repositório que você acabou de subir no GitHub e clique em **"Import"**.
4. A Vercel detectará automaticamente as configurações do Vite:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Clique em **"Deploy"**.
6. Em cerca de 30 segundos sua plataforma estará no ar com link público HTTPS!
7. Graças ao arquivo `vercel.json` incluído na raiz do projeto, todas as rotas e atualizações de página (F5) funcionam sem erro 404.

---

## ⚠️ Limitações Físicas dos Modelos

Como toda ferramenta educacional científica, as simulações operam sob certos modelos e aproximações:

1. **Modelo de Ponto Material:** Os corpos (veículos, esferas) são modelados como partículas pontuais com massa concentrada no centro de massa, desconsiderando rotação própria, momento de inércia ou deformações mecânicas na colisão.
2. **Gravidade Homogênea:** O campo gravitacional é considerado uniforme ($g = 9{,}81\text{ m/s}^2$ constante ao longo de toda a altura simulada), o que é uma excelente aproximação para altitudes próximas à superfície da Terra ($h \le 100\text{ m}$).
3. **Resistência do Ar:** O modelo aerodinâmico utilizado quando ativado é o modelo quadrático ($F_d \propto v^2$), integrado numericamente com passo temporal reduzido ($\Delta t = 0{,}005\text{ s}$). Ele reproduz fielmente a velocidade terminal e a desaceleração progressiva, mas despreza variações de densidade do ar causadas por altitude ou temperatura.
4. **Colisão com o Solo:** Considera-se que o solo absorve o movimento vertical (impacto inelástico), cessando a velocidade vertical para efeito de leitura do tempo total de queda ou de voo.

---

## 📄 Licença

Este projeto é disponibilizado sob a licença **MIT** — livre para uso didático, acadêmico, adaptação e demonstrações em sala de aula.
