import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calculateMRUV, generateTimeSeries } from '../physics/kinematics';
import { formatNumber } from '../physics/units';
import SimulationCanvas from '../components/SimulationCanvas';
import SimulationControls from '../components/SimulationControls';
import NumericInput from '../components/NumericInput';
import FormulaCard from '../components/FormulaCard';
import PhysicsChart from '../components/PhysicsChart';
import { Lightbulb, CheckCircle, Zap } from 'lucide-react';

export default function AcceleratedMotion({ isTeacherMode }) {
  // Parâmetros do MRUV
  const [s0, setS0] = useState(0);
  const [v0, setV0] = useState(2);
  const [a, setA] = useState(2);
  const [duration, setDuration] = useState(8);

  // Estado da simulação
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeChartTab, setActiveChartTab] = useState('position'); // 'position' | 'velocity' | 'acceleration'

  // Pergunta de investigação
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);
  const [tested, setTested] = useState(false);

  const animFrameRef = useRef(null);
  const lastWallTimeRef = useRef(null);

  // Estado atual dos cálculos no instante simTime
  const currentState = useMemo(() => {
    return calculateMRUV(s0, v0, a, simTime);
  }, [s0, v0, a, simTime]);

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
    if (simTime >= duration) setSimTime(0);
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
  };
  const handleStep = () => {
    setIsPlaying(false);
    setSimTime((prev) => Math.min(prev + 0.5, duration));
  };

  // Séries temporais para gráficos
  const chartData = useMemo(() => {
    return generateTimeSeries((t) => {
      const state = calculateMRUV(s0, v0, a, t);
      // Movimento uniforme comparativo com a mesma velocidade inicial (a = 0)
      const uniformPos = s0 + v0 * t;
      return {
        time: t,
        pos: Number(state.position.toFixed(2)),
        uniformPos: Number(uniformPos.toFixed(2)),
        vel: Number(state.velocity.toFixed(2)),
        acc: Number(state.acceleration.toFixed(2))
      };
    }, duration, 40);
  }, [s0, v0, a, duration]);

  // Limites da régua
  const finalPos = calculateMRUV(s0, v0, a, duration).position;
  const minPos = Math.min(-10, Math.floor(Math.min(s0, finalPos) / 10) * 10 - 10);
  const maxPos = Math.max(100, Math.ceil(Math.max(s0, finalPos) / 10) * 10 + 10);

  return (
    <div>
      <div className="sim-page-header">
        <div className="sim-page-title-row">
          <div>
            <div className="badge badge-amber" style={{ marginBottom: '0.4rem' }}>
              Módulo 3 • Aceleração Constante
            </div>
            <h1 className="sim-page-title">Movimento Retilíneo Uniformemente Variado (MRUV)</h1>
          </div>
          <p className="teacher-hide" style={{ color: 'var(--color-text-muted)', maxWidth: '520px', fontSize: '0.95rem' }}>
            No MRUV, a aceleração é constante e diferente de zero, fazendo a velocidade variar linearmente no tempo e a posição crescer de forma parabólica.
          </p>
        </div>
      </div>

      <div className="sim-layout">
        <div>
          <div className="sim-stage-card">
            <div className="sim-stage-header">
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                Laboratório de MRUV — Aceleração, Velocidade e Deslocamento
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {a > 0 ? (currentState.velocity >= 0 ? 'Movimento Acelerado' : 'Movimento Retardado (Frenagem)') : a < 0 ? (currentState.velocity > 0 ? 'Movimento Retardado' : 'Movimento Acelerado em Sentido Retrógrado') : 'Movimento Uniforme (a = 0)'}
              </span>
            </div>

            <SimulationCanvas
              mode="horizontal"
              pos1={currentState.position}
              vel1={currentState.velocity}
              acc1={currentState.acceleration}
              label1="Veículo"
              color1="#d97706"
              minPos={minPos}
              maxPos={maxPos}
              showVectors={true}
              showRuler={true}
            />

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

            {/* Painel Digital de Leituras */}
            <div className="readouts-panel">
              <div className="readout-card">
                <div className="readout-label">Posição s(t)</div>
                <div className="readout-value" style={{ color: '#d97706' }}>
                  {formatNumber(currentState.position, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Velocidade Instantânea v(t)</div>
                <div className="readout-value" style={{ color: '#059669' }}>
                  {formatNumber(currentState.velocity, 1)}
                  <span className="readout-unit">m/s</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Aceleração Constante (a)</div>
                <div className="readout-value" style={{ color: '#dc2626' }}>
                  {formatNumber(currentState.acceleration, 1)}
                  <span className="readout-unit">m/s²</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Deslocamento (Δs)</div>
                <div className="readout-value">
                  {formatNumber(currentState.deltaS, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Abas de Gráficos Científicos */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className={`chart-tab-btn ${activeChartTab === 'position' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('position')}
              >
                Posição × Tempo (s × t)
              </button>
              <button
                className={`chart-tab-btn ${activeChartTab === 'velocity' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('velocity')}
              >
                Velocidade × Tempo (v × t)
              </button>
              <button
                className={`chart-tab-btn ${activeChartTab === 'acceleration' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('acceleration')}
              >
                Aceleração × Tempo (a × t)
              </button>
            </div>

            {activeChartTab === 'position' && (
              <PhysicsChart
                title="Posição × Tempo: Parábola s(t) = s₀ + v₀t + (1/2)at²"
                data={chartData}
                lines={[
                  { key: 'pos', name: 'MRUV (Curva Parabólica)', color: '#d97706', unit: 'm' },
                  { key: 'uniformPos', name: 'Comparação MRU (Sem Aceleração a=0)', color: '#94a3b8', unit: 'm' }
                ]}
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Posição s (m)"
                currentTime={simTime}
                slopeMeaning="A reta tangente a cada instante desta parábola tem inclinação igual à velocidade instantânea v(t). Note como a curva se afasta da reta pontilhada do MRU!"
              />
            )}

            {activeChartTab === 'velocity' && (
              <PhysicsChart
                title="Velocidade × Tempo: Variação Linear v(t) = v₀ + a · t"
                data={chartData}
                lines={[
                  { key: 'vel', name: 'Velocidade Instantânea v(t)', color: '#059669', unit: 'm/s' }
                ]}
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Velocidade v (m/s)"
                currentTime={simTime}
                slopeMeaning="A inclinação da reta no gráfico v × t fornece o valor constante da aceleração: Δv / Δt = a."
                areaMeaning="A área sob o gráfico trapezoidal ou triangular da velocidade entre 0 e t corresponde precisamente ao deslocamento escalar total Δs."
              />
            )}

            {activeChartTab === 'acceleration' && (
              <PhysicsChart
                title="Aceleração × Tempo: Reta Horizontal Constante a(t) = a"
                data={chartData}
                lines={[
                  { key: 'acc', name: 'Aceleração Constante a', color: '#dc2626', unit: 'm/s²' }
                ]}
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Aceleração a (m/s²)"
                currentTime={simTime}
                areaMeaning="A área do retângulo sob o gráfico a × t entre dois instantes representa a variação de velocidade Δv = a · Δt."
              />
            )}
          </div>
        </div>

        {/* Painel Lateral com Parâmetros e Torricelli */}
        <div className="sim-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">
              Parâmetros do Movimento
            </h3>

            <NumericInput
              label="Posição Inicial (s₀)"
              value={s0}
              onChange={(val) => {
                setS0(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-20}
              max={50}
              step={5}
              unit="m"
            />

            <NumericInput
              label="Velocidade Inicial (v₀)"
              value={v0}
              onChange={(val) => {
                setV0(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-10}
              max={20}
              step={1}
              unit="m/s"
            />

            <NumericInput
              label="Aceleração Constante (a)"
              value={a}
              onChange={(val) => {
                setA(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-5}
              max={6}
              step={0.5}
              unit="m/s²"
              description={a < 0 ? 'Aceleração negativa (frenagem se v > 0)' : 'Aceleração positiva'}
            />

            <NumericInput
              label="Duração da Simulação"
              value={duration}
              onChange={(val) => {
                setDuration(Math.max(2, val));
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={2}
              max={20}
              step={1}
              unit="s"
            />

            {/* Fórmulas Horárias com KaTeX vivo */}
            <FormulaCard
              title="Função Horária do Espaço"
              latex="s(t) = s_0 + v_0 t + \frac{1}{2} a t^2"
              substitutionLatex={`s(${formatNumber(simTime, 1)}) = ${s0} + (${v0})(${formatNumber(simTime, 1)}) + \\frac{1}{2}(${a})(${formatNumber(simTime, 1)})^2 = ${formatNumber(currentState.position, 1)}\\text{ m}`}
            />

            <FormulaCard
              title="Função Horária da Velocidade"
              latex="v(t) = v_0 + a \cdot t"
              substitutionLatex={`v(${formatNumber(simTime, 1)}) = ${v0} + (${a})(${formatNumber(simTime, 1)}) = ${formatNumber(currentState.velocity, 1)}\\text{ m/s}`}
            />

            {/* Destaque Exclusivo: Equação de Torricelli */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: 10, border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#92400e', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={16} />
                Equação de Torricelli (Sem o Tempo)
              </div>
              <div style={{ fontSize: '0.85rem', color: '#78350f', marginBottom: '0.5rem' }}>
                Permite calcular a velocidade final a partir unicamente do deslocamento Δs:
              </div>
              <FormulaCard
                title="Torricelli em Tempo Real"
                latex="v^2 = v_0^2 + 2 a \Delta s"
                substitutionLatex={`v^2 = (${v0})^2 + 2(${a})(${formatNumber(currentState.deltaS, 1)}) = ${formatNumber(currentState.torricelliVSquared, 1)} \\implies |v| = ${formatNumber(currentState.torricelliSpeed, 2)}\\text{ m/s}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modo Aluno: Aprendizagem Guiada */}
      <div className="pedagogy-section teacher-hide">
        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <Lightbulb size={20} color="var(--accent-amber)" />
            Investigação Guiada: O Efeito da Aceleração
          </h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Partindo do repouso (v₀ = 0), se <strong>dobrarmos o tempo de movimento</strong> sob uma aceleração constante, o que ocorrerá com a distância percorrida?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              className={`exercise-option-btn ${selectedHypothesis === 'quadruplica' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedHypothesis('quadruplica');
                setTested(true);
              }}
            >
              A distância percorrida será quadruplicada (4 vezes maior), devido ao termo quadrático t².
            </button>
            <button
              className={`exercise-option-btn ${selectedHypothesis === 'dobra' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedHypothesis('dobra');
                setTested(true);
              }}
            >
              A distância percorrida apenas dobrará de valor.
            </button>
          </div>

          {tested && (
            <div className={`exercise-feedback-box ${selectedHypothesis === 'quadruplica' ? 'feedback-success' : 'feedback-error'}`}>
              <strong>{selectedHypothesis === 'quadruplica' ? 'Exatamente!' : 'Atenção à potência de t!'}</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Como Δs = (1/2)·a·t², a distância percorrida varia com o <strong>quadrado</strong> do tempo. Se t passa de 2s para 4s (o dobro), t² passa de 4 para 16 (4 vezes mais!). Esta é a razão geométrica pela qual o gráfico s × t se curva como uma parábola.
              </p>
            </div>
          )}
        </div>

        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <CheckCircle size={20} color="var(--accent-emerald)" />
            Exemplo Resolvido com Torricelli
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Problema:</strong> Um veículo parte do repouso (v₀ = 0) com aceleração constante de a = 2 m/s² ao longo de uma reta de Δs = 25 metros. Qual é a sua velocidade ao final desse trecho?
            </p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Aplicação da Equação de Torricelli:</strong> v² = v₀² + 2 · a · Δs.</li>
              <li><strong>Substituição:</strong> v² = 0² + 2 · (2) · (25) = 100.</li>
              <li><strong>Cálculo da Raiz:</strong> v = √100 = <strong>10,0 m/s</strong> (ou 36 km/h).</li>
            </ol>
            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: 6, fontSize: '0.8rem', borderLeft: '3px solid var(--accent-emerald)' }}>
              <strong>Nota:</strong> Sem precisar determinar o tempo de 5 segundos, Torricelli fornece a velocidade final diretamente a partir do espaço percorrido.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
