import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  calculateAverageVelocity,
  getAverageVelocityStateAt,
  generateTimeSeries
} from '../physics/kinematics';
import { formatNumber, formatQuantity } from '../physics/units';
import SimulationCanvas from '../components/SimulationCanvas';
import SimulationControls from '../components/SimulationControls';
import NumericInput from '../components/NumericInput';
import FormulaCard from '../components/FormulaCard';
import PhysicsChart from '../components/PhysicsChart';
import { HelpCircle, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';

export default function AverageVelocity({ isTeacherMode }) {
  // Parâmetros de entrada
  const [s0, setS0] = useState(0);
  const [sf, setSf] = useState(80);
  const [duration, setDuration] = useState(8);

  // Estado da simulação temporal
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Pergunta de investigação do aluno
  const [hypothesisTested, setHypothesisTested] = useState(false);
  const [hypothesisAnswer, setHypothesisAnswer] = useState(null);

  const animFrameRef = useRef(null);
  const lastWallTimeRef = useRef(null);

  // Cálculos físicos
  const physicsResult = useMemo(() => {
    return calculateAverageVelocity(s0, sf, duration);
  }, [s0, sf, duration]);

  // Estado instantâneo no instante simTime
  const currentState = useMemo(() => {
    return getAverageVelocityStateAt(s0, sf, duration, simTime);
  }, [s0, sf, duration, simTime]);

  // Loop de animação física por requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) {
      lastWallTimeRef.current = null;
      return;
    }

    const tick = (now) => {
      if (lastWallTimeRef.current === null) {
        lastWallTimeRef.current = now;
      }
      const wallDelta = (now - lastWallTimeRef.current) / 1000;
      lastWallTimeRef.current = now;

      setSimTime((prevTime) => {
        const nextTime = prevTime + wallDelta * speed;
        if (nextTime >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, duration, speed]);

  const handlePlay = () => {
    if (simTime >= duration) {
      setSimTime(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
  };

  const handleStep = () => {
    setIsPlaying(false);
    setSimTime((prev) => Math.min(prev + 0.5, duration));
  };

  // Dados para o gráfico s x t
  const chartData = useMemo(() => {
    return generateTimeSeries((t) => {
      const st = getAverageVelocityStateAt(s0, sf, duration, t);
      return {
        time: t,
        pos: Number(st.position.toFixed(2))
      };
    }, duration, 40);
  }, [s0, sf, duration]);

  // Limites da régua
  const minPos = Math.min(-10, Math.floor(Math.min(s0, sf) / 10) * 10 - 10);
  const maxPos = Math.max(100, Math.ceil(Math.max(s0, sf) / 10) * 10 + 10);

  return (
    <div>
      {/* Header do Módulo */}
      <div className="sim-page-header">
        <div className="sim-page-title-row">
          <div>
            <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>
              Módulo 1 • Fundamentos
            </div>
            <h1 className="sim-page-title">Velocidade Média</h1>
          </div>
          <p className="teacher-hide" style={{ color: 'var(--color-text-muted)', maxWidth: '520px', fontSize: '0.95rem' }}>
            A velocidade média quantifica a rapidez com que a posição de um corpo varia em um intervalo de tempo determinado: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>vm = Δs / Δt</span>.
          </p>
        </div>
      </div>

      <div className="sim-layout">
        {/* Painel Esquerdo: Canvas do Laboratório, Controles e Gráficos */}
        <div>
          <div className="sim-stage-card">
            <div className="sim-stage-header">
              <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                Laboratório Virtual — Pista Retilínea
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Régua calibrada em metros (m)
              </span>
            </div>

            {/* Canvas Interativo */}
            <SimulationCanvas
              mode="horizontal"
              pos1={currentState.position}
              vel1={currentState.velocity}
              acc1={0}
              label1="Veículo"
              color1="#0284c7"
              minPos={minPos}
              maxPos={maxPos}
              showVectors={true}
              showRuler={true}
            />

            {/* Barra de Controles */}
            <SimulationControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onStep={handleStep}
              currentTime={simTime}
              speed={speed}
              onSpeedChange={setSpeed}
              isFinished={simTime >= duration}
            />

            {/* Painel Digital de Leituras em Tempo Real */}
            <div className="readouts-panel">
              <div className="readout-card">
                <div className="readout-label">Posição Atual (s)</div>
                <div className="readout-value">
                  {formatNumber(currentState.position, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Deslocamento (Δs)</div>
                <div className="readout-value" style={{ color: 'var(--primary-600)' }}>
                  {formatNumber(physicsResult.deltaS, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Tempo Total (Δt)</div>
                <div className="readout-value">
                  {formatNumber(duration, 1)}
                  <span className="readout-unit">s</span>
                </div>
              </div>

              <div className="readout-card" style={{ border: '2px solid var(--primary-500)', backgroundColor: '#eff6ff' }}>
                <div className="readout-label" style={{ color: 'var(--primary-700)' }}>Velocidade Média (vm)</div>
                <div className="readout-value" style={{ color: 'var(--primary-700)' }}>
                  {formatNumber(physicsResult.averageVelocity, 2)}
                  <span className="readout-unit">m/s</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', marginTop: '2px' }}>
                  ≈ {formatNumber(physicsResult.averageVelocity * 3.6, 1)} km/h
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico Científico */}
          <PhysicsChart
            title="Gráfico da Posição em Função do Tempo: s × t"
            data={chartData}
            lines={[
              { key: 'pos', name: 'Posição s(t)', color: '#0284c7', unit: 'm' }
            ]}
            xAxisLabel="Tempo t (segundos)"
            yAxisLabel="Posição s (metros)"
            currentTime={simTime}
            slopeMeaning="A inclinação (coeficiente angular da reta) corresponde diretamente ao valor da velocidade média vm."
          />
        </div>

        {/* Painel Direito: Parâmetros e Fórmulas */}
        <div className="sim-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">
              Parâmetros da Simulação
            </h3>

            <NumericInput
              label="Posição Inicial (s₀)"
              value={s0}
              onChange={(v) => {
                setS0(v);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-50}
              max={50}
              step={5}
              unit="m"
              description="Ponto onde o móvel inicia o movimento"
            />

            <NumericInput
              label="Posição Final (sf)"
              value={sf}
              onChange={(v) => {
                setSf(v);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={0}
              max={150}
              step={5}
              unit="m"
              description="Ponto de chegada do móvel"
            />

            <NumericInput
              label="Duração do Percurso (Δt)"
              value={duration}
              onChange={(v) => {
                setDuration(Math.max(1, v));
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={1}
              max={25}
              step={1}
              unit="s"
              description="Intervalo de tempo total gasto"
            />

            {/* Card com KaTeX vivo */}
            <FormulaCard
              title="Equação da Velocidade Média"
              latex="v_m = \frac{\Delta s}{\Delta t} = \frac{s_f - s_0}{t_f - t_0}"
              substitutionLatex={`v_m = \\frac{${sf} - (${s0})}{${duration}} = \\frac{${physicsResult.deltaS}}{${duration}} = ${formatNumber(physicsResult.averageVelocity, 2)}\\text{ m/s}`}
              variables={[
                { symbol: 'vm', name: 'Velocidade Média', unit: 'm/s' },
                { symbol: 'Δs', name: 'Deslocamento escalar (sf - s₀)', unit: 'm' },
                { symbol: 'Δt', name: 'Intervalo de tempo gasto', unit: 's' }
              ]}
            />
          </div>

          {/* Comparação: Deslocamento vs Distância */}
          <div className="sidebar-card teacher-hide">
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
              Deslocamento vs Distância
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              <p style={{ marginBottom: '0.4rem' }}>
                <strong>Deslocamento (Δs):</strong> {formatQuantity(physicsResult.deltaS, 'm')} ({physicsResult.deltaS >= 0 ? 'Sentido progressivo +' : 'Sentido retrógrado -'})
              </p>
              <p>
                <strong>Distância Percorrida:</strong> {formatQuantity(physicsResult.distanceTraveled, 'm')} (Grandeza sempre escalar e positiva).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Pedagógica: Modo Aluno e Aprendizagem Guiada */}
      <div className="pedagogy-section teacher-hide">
        {/* Pergunta de Investigação Interativa */}
        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <Lightbulb size={20} color="var(--accent-amber)" />
            Pergunta de Investigação
          </h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Se você <strong>dobrar a posição final</strong> (aumentando o deslocamento) mantendo exatamente o <strong>mesmo intervalo de tempo</strong>, o que acontecerá com a velocidade média?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              className={`exercise-option-btn ${hypothesisAnswer === 'dobra' ? 'selected' : ''}`}
              onClick={() => {
                setHypothesisAnswer('dobra');
                setHypothesisTested(true);
              }}
            >
              A velocidade média também dobrará de valor.
            </button>
            <button
              className={`exercise-option-btn ${hypothesisAnswer === 'metade' ? 'selected' : ''}`}
              onClick={() => {
                setHypothesisAnswer('metade');
                setHypothesisTested(true);
              }}
            >
              A velocidade média cairá pela metade.
            </button>
            <button
              className={`exercise-option-btn ${hypothesisAnswer === 'constante' ? 'selected' : ''}`}
              onClick={() => {
                setHypothesisAnswer('constante');
                setHypothesisTested(true);
              }}
            >
              A velocidade média permanecerá rigorosamente a mesma.
            </button>
          </div>

          {hypothesisTested && (
            <div className={`exercise-feedback-box ${hypothesisAnswer === 'dobra' ? 'feedback-success' : 'feedback-error'}`}>
              <strong>{hypothesisAnswer === 'dobra' ? 'Correto!' : 'Não exatamente!'}</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Como vm = Δs / Δt, a velocidade média é <em>diretamente proporcional</em> ao deslocamento Δs. Se o deslocamento é duplicado no mesmo tempo, o veículo precisa se mover com o dobro da rapidez. Experimente alterar sf para o dobro no controle deslizante e comprove!
              </p>
            </div>
          )}
        </div>

        {/* Exemplo Resolvido Passo a Passo */}
        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <CheckCircle size={20} color="var(--accent-emerald)" />
            Exemplo Resolvido Passo a Passo
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Problema:</strong> Um automóvel parte da posição inicial s₀ = 20 m e alcança a posição final sf = 140 m em um tempo de 15 segundos. Determine a sua velocidade média em m/s e em km/h.
            </p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Cálculo do Deslocamento:</strong> Δs = sf - s₀ = 140 m - 20 m = 120 m.</li>
              <li><strong>Aplicação da Fórmula:</strong> vm = Δs / Δt = 120 m / 15 s = <strong>8,0 m/s</strong>.</li>
              <li><strong>Conversão para km/h:</strong> Multiplica-se por 3,6: 8,0 × 3,6 = <strong>28,8 km/h</strong>.</li>
            </ol>
            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: 6, fontSize: '0.8rem', borderLeft: '3px solid var(--accent-emerald)' }}>
              <strong>Conclusão Pedagógica:</strong> A velocidade média expressa o ritmo global uniforme equivalente que produziria aquele mesmo deslocamento total no intervalo analisado.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
