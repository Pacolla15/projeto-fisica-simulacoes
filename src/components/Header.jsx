import React, { useState, useEffect } from 'react';
import {
  Atom,
  Presentation,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Maximize,
  Minimize,
  Home
} from 'lucide-react';

export default function Header({
  activeTab,
  onNavigate,
  isTeacherMode,
  onToggleTeacherMode
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <button
            className="logo-group"
            onClick={() => onNavigate('home')}
            style={{ cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <div className="logo-icon-wrap">
              <Atom size={24} />
            </div>
            <div className="logo-title">
              Física<span>Lab</span>
              <span className="logo-badge">Cinemática</span>
            </div>
          </button>

          <nav className="nav-links teacher-hide">
            <button
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              <Home size={18} />
              <span>Início</span>
            </button>
            <button
              className={`nav-link ${activeTab === 'theory' ? 'active' : ''}`}
              onClick={() => onNavigate('theory')}
            >
              <BookOpen size={18} />
              <span>Teoria</span>
            </button>
            <button
              className={`nav-link ${activeTab === 'simulations' ? 'active' : ''}`}
              onClick={() => onNavigate('simulations')}
            >
              <PlayCircle size={18} />
              <span>Simulações</span>
            </button>
            <button
              className={`nav-link ${activeTab === 'exercises' ? 'active' : ''}`}
              onClick={() => onNavigate('exercises')}
            >
              <CheckCircle2 size={18} />
              <span>Exercícios</span>
            </button>
          </nav>

          <div className="nav-actions">
            {/* Botão de Modo Professor */}
            <button
              className={`teacher-toggle-btn ${isTeacherMode ? 'active' : ''}`}
              onClick={onToggleTeacherMode}
              title={isTeacherMode ? 'Desativar modo apresentação do professor' : 'Ativar modo projetor/apresentação em sala de aula'}
            >
              <Presentation size={18} />
              <span>{isTeacherMode ? 'Modo Professor Ativo' : 'Modo Professor'}</span>
            </button>

            {/* Tela cheia */}
            <button
              className="teacher-toggle-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Sair da tela cheia' : 'Exibir em tela cheia'}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Banner informativo quando o Modo Professor estiver ativo */}
      {isTeacherMode && (
        <div className="teacher-banner">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="teacher-banner-text">
              <Presentation size={18} color="#38bdf8" />
              <strong>Modo Apresentação do Professor:</strong> layout otimizado para projetores com controles expandidos e tipografia ampliada.
            </div>
            <button
              onClick={onToggleTeacherMode}
              style={{ color: '#93c5fd', textDecoration: 'underline', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Voltar ao modo normal
            </button>
          </div>
        </div>
      )}
    </>
  );
}
