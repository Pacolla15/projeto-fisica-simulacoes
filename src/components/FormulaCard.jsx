import React, { useMemo } from 'react';
import katex from 'katex';
import { BookOpen } from 'lucide-react';

/**
 * Componente que renderiza fórmulas matemáticas com KaTeX e exibe a substituição dinâmica de variáveis
 */
export default function FormulaCard({
  title = 'Fórmula em Aplicação',
  latex,
  substitutionLatex,
  description,
  variables = []
}) {
  const renderedFormula = useMemo(() => {
    if (!latex) return null;
    try {
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false
      });
    } catch {
      return latex;
    }
  }, [latex]);

  const renderedSubst = useMemo(() => {
    if (!substitutionLatex) return null;
    try {
      return katex.renderToString(substitutionLatex, {
        displayMode: true,
        throwOnError: false
      });
    } catch {
      return substitutionLatex;
    }
  }, [substitutionLatex]);

  return (
    <div className="live-formula-card">
      <div className="live-formula-title">
        <BookOpen size={16} />
        {title}
      </div>

      {renderedFormula && (
        <div
          className="math-display"
          dangerouslySetInnerHTML={{ __html: renderedFormula }}
        />
      )}

      {description && (
        <p style={{ fontSize: '0.85rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
          {description}
        </p>
      )}

      {renderedSubst && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase' }}>
            Substituição com os parâmetros atuais:
          </div>
          <div
            className="live-formula-subst"
            dangerouslySetInnerHTML={{ __html: renderedSubst }}
          />
        </div>
      )}

      {variables.length > 0 && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
            Significado das Variáveis:
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {variables.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.2rem' }}>
                <strong style={{ color: 'var(--primary-900)', fontFamily: 'var(--font-mono)' }}>{item.symbol}</strong>: {item.name} ({item.unit})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
