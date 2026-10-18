import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Theory from './pages/Theory';
import Simulations from './pages/Simulations';
import Exercises from './pages/Exercises';
import NotFound from './pages/NotFound';

export default function App() {
  // Roteamento amigável por hash da URL (compatível com Vercel SPA)
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '').split('?')[0];
    if (['home', 'theory', 'simulations', 'exercises'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  // Módulo de simulação selecionado (com persistência em localStorage)
  const [selectedModuleId, setSelectedModuleId] = useState(() => {
    try {
      const saved = localStorage.getItem('fisica_lab_last_module');
      return saved || 'velocidade-media';
    } catch {
      return 'velocidade-media';
    }
  });

  // Modo Professor (Apresentação / Projetor)
  const [isTeacherMode, setIsTeacherMode] = useState(() => {
    try {
      return localStorage.getItem('fisica_lab_teacher_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Aplica classe ao body quando o Modo Professor estiver ativo
  useEffect(() => {
    if (isTeacherMode) {
      document.body.classList.add('teacher-mode');
    } else {
      document.body.classList.remove('teacher-mode');
    }
    try {
      localStorage.setItem('fisica_lab_teacher_mode', String(isTeacherMode));
    } catch {}
  }, [isTeacherMode]);

  // Salva o último módulo acessado no localStorage
  const handleSelectModule = (moduleId) => {
    setSelectedModuleId(moduleId);
    try {
      localStorage.setItem('fisica_lab_last_module', moduleId);
    } catch {}
  };

  // Sincroniza navegação com o hash da janela
  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').split('?')[0];
      if (['home', 'theory', 'simulations', 'exercises'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isTeacherMode={isTeacherMode}
        onToggleTeacherMode={() => setIsTeacherMode(!isTeacherMode)}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <Home
            onSelectModule={handleSelectModule}
            onNavigate={handleNavigate}
          />
        )}
        {activeTab === 'theory' && (
          <Theory
            onSelectModule={handleSelectModule}
            onNavigate={handleNavigate}
          />
        )}
        {activeTab === 'simulations' && (
          <Simulations
            selectedModuleId={selectedModuleId}
            onSelectModule={handleSelectModule}
            isTeacherMode={isTeacherMode}
          />
        )}
        {activeTab === 'exercises' && (
          <Exercises
            onSelectModule={handleSelectModule}
            onNavigate={handleNavigate}
          />
        )}
        {!['home', 'theory', 'simulations', 'exercises'].includes(activeTab) && (
          <NotFound onNavigate={handleNavigate} />
        )}
      </main>

      <Footer
        onSelectModule={handleSelectModule}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
