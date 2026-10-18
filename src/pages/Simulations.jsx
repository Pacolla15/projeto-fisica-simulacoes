import React from 'react';
import {
  Gauge,
  TrendingUp,
  Zap,
  ArrowDownCircle,
  Rocket,
  GitFork
} from 'lucide-react';
import { MODULES } from '../data/modulesMeta';

// Simulações
import AverageVelocity from '../simulations/AverageVelocity';
import UniformMotion from '../simulations/UniformMotion';
import AcceleratedMotion from '../simulations/AcceleratedMotion';
import FreeFall from '../simulations/FreeFall';
import VerticalLaunch from '../simulations/VerticalLaunch';
import RelativeMotion from '../simulations/RelativeMotion';

const ICONS = {
  Gauge,
  TrendingUp,
  Zap,
  ArrowDownCircle,
  Rocket,
  GitFork
};

export default function Simulations({
  selectedModuleId,
  onSelectModule,
  isTeacherMode
}) {
  const currentModule = MODULES.find((m) => m.id === selectedModuleId) || MODULES[0];

  return (
    <div className="container" style={{ padding: '1.5rem 1.25rem 4rem' }}>
      {/* Seletor de Módulos (Tabs) no Topo */}
      <div
        className="teacher-hide"
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        {MODULES.map((m) => {
          const IconComp = ICONS[m.iconName] || Gauge;
          const isSelected = m.id === currentModule.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectModule(m.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isSelected ? '700' : '500',
                whiteSpace: 'nowrap',
                border: isSelected ? `2px solid ${m.color}` : '1px solid var(--color-border)',
                backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                color: isSelected ? m.color : 'var(--color-text-muted)',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <IconComp size={18} color={isSelected ? m.color : '#64748b'} />
              <span>Módulo {m.number}: {m.title}</span>
            </button>
          );
        })}
      </div>

      {/* Renderização do Módulo de Simulação Atual */}
      {currentModule.id === 'velocidade-media' && (
        <AverageVelocity isTeacherMode={isTeacherMode} />
      )}
      {currentModule.id === 'mru' && (
        <UniformMotion isTeacherMode={isTeacherMode} />
      )}
      {currentModule.id === 'mruv' && (
        <AcceleratedMotion isTeacherMode={isTeacherMode} />
      )}
      {currentModule.id === 'queda-livre' && (
        <FreeFall isTeacherMode={isTeacherMode} />
      )}
      {currentModule.id === 'lancamento-vertical' && (
        <VerticalLaunch isTeacherMode={isTeacherMode} />
      )}
      {currentModule.id === 'movimento-relativo' && (
        <RelativeMotion isTeacherMode={isTeacherMode} />
      )}
    </div>
  );
}
