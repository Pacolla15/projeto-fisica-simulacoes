import React, { useState, useMemo } from 'react';
import { BookOpen, Search, ArrowRight, CheckCircle2, ChevronRight, Bookmark } from 'lucide-react';
import { THEORY_SECTIONS } from '../data/theory';
import katex from 'katex';
import MarkdownMathRenderer from '../components/MarkdownMathRenderer';

export default function Theory({ onSelectModule, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState(THEORY_SECTIONS[0].id);

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return THEORY_SECTIONS;
    const term = searchTerm.toLowerCase();
    return THEORY_SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(term) ||
        sec.summary.toLowerCase().includes(term) ||
        sec.content.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const activeSection = useMemo(() => {
    return (
      THEORY_SECTIONS.find((s) => s.id === selectedSectionId) ||
      filteredSections[0] ||
      THEORY_SECTIONS[0]
    );
  }, [selectedSectionId, filteredSections]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      {/* Cabeçalho da Teoria */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
          <BookOpen size={14} /> Fundamentos Teóricos
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-text-main)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Teoria Completa de Cinemática
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', maxWidth: '720px' }}>
          Uma jornada didática e estruturada pelos conceitos, definições, fórmulas matemáticas e interpretações geométricas que governam o estudo do movimento.
        </p>
      </div>

      {/* Barra de Busca de Conceito */}
      <div style={{ position: 'relative', maxWidth: '480px', marginBottom: '2rem' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Buscar conceito, fórmula ou palavra-chave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.95rem',
            backgroundColor: '#ffffff'
          }}
        />
      </div>

      {/* Layout de Conteúdo: Navegação Lateral + Painel Didático */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Navegação Lateral de Tópicos */}
        <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '0.75rem', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase', padding: '0.5rem 0.75rem', letterSpacing: '0.05em' }}>
            Índice Temático
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {filteredSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: selectedSectionId === sec.id ? '700' : '500',
                  color: selectedSectionId === sec.id ? 'var(--primary-700)' : 'var(--color-text-muted)',
                  backgroundColor: selectedSectionId === sec.id ? 'var(--primary-50)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span>{sec.title}</span>
                {selectedSectionId === sec.id && <ChevronRight size={16} color="var(--primary-600)" />}
              </button>
            ))}
          </div>
        </div>

        {/* Painel Central do Conteúdo Selecionado */}
        <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-blue">{activeSection.badge}</span>
            {activeSection.moduleId && (
              <button
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                onClick={() => {
                  onSelectModule(activeSection.moduleId);
                  onNavigate('simulations');
                }}
              >
                <span>Abrir Simulação Relacionada</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
            {activeSection.title}
          </h2>

          <p style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--primary-900)', background: '#eff6ff', padding: '1rem', borderRadius: 8, borderLeft: '4px solid var(--primary-600)', marginBottom: '1.75rem' }}>
            {activeSection.summary}
          </p>

          {/* Fórmula Principal em Destaque (se houver) */}
          {activeSection.formula && (
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Equação Fundamental do Tópico:
              </div>
              <div
                className="math-display"
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(activeSection.formula, { displayMode: true, throwOnError: false })
                }}
              />
            </div>
          )}

          {/* Renderização Didática Enriquecida com KaTeX e Formatação Completa */}
          <MarkdownMathRenderer content={activeSection.content} />

          {/* Exemplo Resolvido com Passo a Passo Didático */}
          {activeSection.example && (
            <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1.5rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '700', color: 'var(--accent-emerald)', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={20} />
                Exemplo Prático Resolvido Passo a Passo
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '1rem' }}>
                {activeSection.example.problem}
              </p>
              <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {activeSection.example.resolution.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
