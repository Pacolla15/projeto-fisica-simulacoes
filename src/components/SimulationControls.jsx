import React from 'react';
import { Play, Pause, RotateCcw, StepForward, Clock } from 'lucide-react';
import { formatNumber } from '../physics/units';

export default function SimulationControls({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStep,
  currentTime = 0,
  speed = 1,
  onSpeedChange,
  isFinished = false
}) {
  return (
    <div className="sim-controls-bar">
      <div className="sim-btn-group">
        {!isPlaying ? (
          <button
            className="sim-ctrl-btn btn-play"
            onClick={onPlay}
            disabled={isFinished}
            title={isFinished ? 'Reinicie para executar novamente' : 'Iniciar ou continuar a simulação'}
          >
            <Play size={18} />
            <span>{currentTime > 0 && !isFinished ? 'Continuar' : 'Iniciar'}</span>
          </button>
        ) : (
          <button
            className="sim-ctrl-btn btn-pause"
            onClick={onPause}
            title="Pausar a simulação"
          >
            <Pause size={18} />
            <span>Pausar</span>
          </button>
        )}

        {onStep && (
          <button
            className="sim-ctrl-btn"
            onClick={onStep}
            disabled={isPlaying || isFinished}
            title="Avançar um passo de tempo (0.1s)"
          >
            <StepForward size={16} />
            <span>Passo</span>
          </button>
        )}

        <button
          className="sim-ctrl-btn"
          onClick={onReset}
          title="Reiniciar a simulação para o instante inicial t = 0"
        >
          <RotateCcw size={16} />
          <span>Reiniciar</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Marcador de Tempo Simulado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-text-main)' }}>
          <Clock size={18} color="var(--primary-600)" />
          <span>t = {formatNumber(currentTime, 2)} s</span>
        </div>

        {/* Multiplicador de Velocidade de Animação */}
        {onSpeedChange && (
          <div className="sim-speed-selector" title="Velocidade de reprodução da simulação">
            <button
              className={`sim-speed-btn ${speed === 0.5 ? 'active' : ''}`}
              onClick={() => onSpeedChange(0.5)}
            >
              0.5x
            </button>
            <button
              className={`sim-speed-btn ${speed === 1 ? 'active' : ''}`}
              onClick={() => onSpeedChange(1)}
            >
              1.0x
            </button>
            <button
              className={`sim-speed-btn ${speed === 2 ? 'active' : ''}`}
              onClick={() => onSpeedChange(2)}
            >
              2.0x
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
