import React from 'react';
import { Atom, ExternalLink, Cpu, BookCheck, ShieldCheck } from 'lucide-react';
import { MODULES } from '../data/modulesMeta';

export default function Footer({ onSelectModule, onNavigate }) {
  return (
    <footer className="footer teacher-hide">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo-title" style={{ marginBottom: '0.75rem' }}>
              <Atom size={22} color="var(--primary-600)" />
              Física<span>Lab</span> — Cinemática
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem', maxWidth: '420px' }}>
              Plataforma educacional aberta de física interativa dedicada ao ensino de Cinemática Escalar e Vetorial, projetada para professores em sala de aula e alunos em estudo guiado.
            </p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Cpu size={15} /> React + Vite
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={15} /> 100% Local & Sem Banco de Dados
              </span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
              Simulações Interativas
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              {MODULES.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => {
                      onSelectModule(m.id);
                      onNavigate('simulations');
                    }}
                    style={{ color: 'var(--color-text-muted)', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >
                    Módulo {m.number}: {m.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
              Navegação e Estudo
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li>
                <button
                  onClick={() => onNavigate('theory')}
                  style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  Fundamentos Teóricos Completos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('exercises')}
                  style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  Banco de Exercícios Interativos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  Página Inicial
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
          <div>
            © {new Date().getFullYear()} FísicaLab. Plataforma educacional para Ensino Médio e Superior.
          </div>
          <div>
            Inspirada na metodologia pedagógica de simulações interativas abertas (PhET).
          </div>
        </div>
      </div>
    </footer>
  );
}
