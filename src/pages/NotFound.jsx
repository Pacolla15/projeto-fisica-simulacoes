import React from 'react';
import { Home, Compass } from 'lucide-react';

export default function NotFound({ onNavigate }) {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '6rem 1.25rem' }}>
      <div style={{ display: 'inline-flex', padding: '1rem', background: '#eff6ff', borderRadius: '50%', color: 'var(--primary-600)', marginBottom: '1.5rem' }}>
        <Compass size={48} />
      </div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>404 — Ponto Fora da Trajetória</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 2rem' }}>
        A coordenada solicitada não faz parte do espaço amostral da nossa plataforma de física.
      </p>
      <button className="btn-primary" onClick={() => onNavigate('home')}>
        <Home size={18} />
        <span>Retornar ao Início</span>
      </button>
    </div>
  );
}
