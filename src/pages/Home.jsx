import React from 'react';
import {
  Gauge,
  TrendingUp,
  Zap,
  ArrowDownCircle,
  Rocket,
  GitFork,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Atom,
  GraduationCap,
  Sparkles,
  Layers,
  LineChart
} from 'lucide-react';
import { MODULES } from '../data/modulesMeta';

// Mapeamento dinâmico de ícones Lucide
const ICONS = {
  Gauge,
  TrendingUp,
  Zap,
  ArrowDownCircle,
  Rocket,
  GitFork
};

export default function Home({ onSelectModule, onNavigate }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="badge badge-blue" style={{ marginBottom: '1rem' }}>
              <Atom size={14} /> Laboratório Virtual de Cinemática
            </div>
            <h1 className="hero-title">
              Explore a Física em <span>Movimento</span>
            </h1>
            <p className="hero-subtitle">
              Uma plataforma educacional completa inspirada no PhET. Aprenda Cinemática manipulando variáveis reais, visualizando gráficos em tempo real e compreendendo a matemática por trás dos fenômenos físicos.
            </p>
            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => {
                  onSelectModule('velocidade-media');
                  onNavigate('simulations');
                }}
              >
                <span>Explorar Simulações</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn-secondary"
                onClick={() => onNavigate('theory')}
              >
                <BookOpen size={18} />
                <span>Estudar a Teoria</span>
              </button>
            </div>
          </div>

          {/* Animação / Ilustração Científica Interativa */}
          <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Simulação Viva: Cinemática Escalar
              </span>
              <span className="badge badge-green">Ao Vivo</span>
            </div>

            {/* Prévia SVG animada */}
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <svg viewBox="0 0 400 120" style={{ width: '100%', height: 'auto', display: 'block' }}>
                {/* Linha de Referência */}
                <line x1="20" y1="80" x2="380" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                {[20, 110, 200, 290, 380].map((x, i) => (
                  <g key={i}>
                    <line x1={x} y1="75" x2={x} y2="85" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x={x} y="98" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="var(--font-mono)">
                      {i * 25}m
                    </text>
                  </g>
                ))}

                {/* Carro em movimento */}
                <g transform="translate(180, 62)">
                  <rect x="-18" y="-4" width="36" height="14" rx="4" fill="#2563eb" />
                  <circle cx="-10" cy="10" r="4" fill="#1e293b" />
                  <circle cx="10" cy="10" r="4" fill="#1e293b" />
                  <line x1="0" y1="3" x2="32" y2="3" stroke="#16a34a" strokeWidth="2.5" markerEnd="url(#arrow-vel)" />
                  <text x="0" y="-10" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2563eb">
                    v = 10 m/s
                  </text>
                </g>
              </svg>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
                <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Posição s(t)</div>
                  <div style={{ fontWeight: 'bold', color: '#0f172a', fontFamily: 'var(--font-mono)' }}>50,0 m</div>
                </div>
                <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Velocidade v</div>
                  <div style={{ fontWeight: 'bold', color: '#16a34a', fontFamily: 'var(--font-mono)' }}>10,0 m/s</div>
                </div>
                <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Aceleração a</div>
                  <div style={{ fontWeight: 'bold', color: '#dc2626', fontFamily: 'var(--font-mono)' }}>0,0 m/s²</div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-subtle)', marginTop: '0.75rem', textAlign: 'center' }}>
              Todas as simulações executam cálculos reais de equações diferenciais e cinemáticas do Sistema Internacional.
            </p>
          </div>
        </div>
      </section>

      {/* Introdução à Cinemática */}
      <section style={{ padding: '3rem 0 1rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>O que é Cinemática?</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
              A Descrição Matemática do Movimento
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
              A <strong>Cinemática</strong> é o ramo fundamental da Mecânica Clássica que estuda e descreve o movimento dos corpos geométricos e materiais ao longo do tempo, sem se preocupar inicialmente com as causas desse movimento (as forças, estudadas pela Dinâmica). Compreender posições, velocidades, acelerações e trajetórias é a chave para toda a Física Moderna.
            </p>
          </div>

          {/* Cards de Destaque Pedagógico */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                <GraduationCap size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>
                Didática para Professores
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Demonstre em sala de aula em tempo real. Altere parâmetros com sliders ao vivo, use o <strong>Modo Professor</strong> ampliado para projetores e mostre a conexão direta entre equações e gráficos.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 8, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>
                Exploração Ativa para Alunos
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Aprenda por meio da experimentação guiada. Teste hipóteses com as perguntas investigativas, veja o passo a passo de exercícios e observe o impacto de cada variável.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 8, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                <LineChart size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>
                Gráficos Científicos Vivos
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Compreenda a física geométrica: inclinação da curva de posição como velocidade instantânea e área sob o gráfico de velocidade como deslocamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Simulações Disponíveis */}
      <section style={{ backgroundColor: '#ffffff', padding: '3.5rem 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="badge badge-blue" style={{ alignSelf: 'flex-start' }}>Laboratórios Disponíveis</div>
            <h2 className="section-title">
              Módulos de Simulação Interativa
            </h2>
            <p className="section-desc">
              Selecione um dos 6 módulos fundamentais para iniciar sua experimentação interativa.
            </p>
          </div>

          <div className="modules-grid">
            {MODULES.map((m) => {
              const IconComp = ICONS[m.iconName] || Atom;
              return (
                <div key={m.id} className="module-card">
                  <div>
                    <div className="module-card-top">
                      <div className="module-icon-box" style={{ backgroundColor: m.color }}>
                        <IconComp size={24} />
                      </div>
                      <span className="badge" style={{ backgroundColor: `${m.color}18`, color: m.color }}>
                        {m.badge}
                      </span>
                    </div>

                    <h3 className="module-card-title">
                      Módulo {m.number}: {m.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {m.subtitle}
                    </p>
                    <p className="module-card-desc">
                      {m.description}
                    </p>

                    <div className="module-formula-preview">
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--color-text-main)' }}>
                        {m.formula}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', backgroundColor: m.color }}
                    onClick={() => {
                      onSelectModule(m.id);
                      onNavigate('simulations');
                    }}
                  >
                    <span>Iniciar Experimento</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Como Utilizar as Simulações */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', alignItems: 'center' }}>
            <span className="badge badge-green">Guia Prático</span>
            <h2 className="section-title">Como Tirar o Máximo Proveito da Plataforma</h2>
            <p className="section-desc" style={{ maxWidth: '640px' }}>
              Siga os passos recomendados pela pedagogia de exploração ativa para consolidar o aprendizado.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-600)', marginBottom: '0.5rem' }}>01</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Observe os Parâmetros</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Examine as condições iniciais (posição s₀, velocidade v₀, aceleração a). Note as unidades no Sistema Internacional (m, s, m/s, m/s²).
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>02</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Formule uma Hipótese</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Antes de iniciar a simulação, tente prever mentalmente onde o objeto estará em determinado instante ou quando ocorrerá o impacto.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>03</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Execute e Pause</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Pressione Iniciar para acompanhar o movimento. Use o botão <strong>Passo</strong> para avançar quadro a quadro e analisar instantes críticos como o ápice da trajetória.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>04</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Conecte ao Gráfico</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Acompanhe a linha vertical vermelha que percorre o gráfico em tempo real conforme a simulação avança, relacionando o fenômeno visual à geometria das curvas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
