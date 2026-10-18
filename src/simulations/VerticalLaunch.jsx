import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calculateVerticalLaunch, generateTimeSeries, STANDARD_GRAVITY } from '../physics/kinematics';
import { formatNumber, formatQuantity } from '../physics/units';
import SimulationCanvas from '../components/SimulationCanvas';
import SimulationControls from '../components/SimulationControls';
import NumericInput from '../components/NumericInput';
import FormulaCard from '../components/FormulaCard';
import PhysicsChart from '../components/PhysicsChart';
import { Lightbulb, CheckCircle, ArrowUpCircle, Compass } from 'lucide-react';

export default function VerticalLaunch({ isTeacherMode }) {
  // Parâmetros do Lançamento
  const [h0, setH0] = useState(0);
  const [v0, setV0] = useState(25);
  const [g, setG] = useState(STANDARD_GRAVITY);

  // Estado da simulação
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeChartTab, setActiveChartTab] = useState('height'); // 'height' | 'velocity'

  // Pergunta de investigação
  const [apexInquiry, setApexInquiry] = useState(null);
  const [showApexFeedback, setShowApexFeedback] = useState(false);

  const animFrameRef = useRef(null);
  const lastWallTimeRef = useRef(null);

  // Cálculos no instante simTime
  const currentState = useMemo(() => {
    return calculateVerticalLaunch(h0, v0, simTime, g);
  }, [h0, v0, simTime, g]);

  // Tempo total de voo até o solo
  const totalFlightTime = currentState.totalFlightTime;

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
        if (nextTime >= totalFlightTime) {
          setIsPlaying(false);
          return totalFlightTime;
        }
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, totalFlightTime, speed]);

  const handlePlay = () => {
    if (currentState.hasLanded || simTime >= totalFlightTime) {
      setSimTime(0);
    }
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
  };
  const handleStep = () => {
    setIsPlaying(false);
    setSimTime((prev) => Math.min(prev + 0.1, totalFlightTime));
  };

  // Séries temporais para gráficos
  const chartData = useMemo(() => {
    return generateTimeSeries((t) => {
      const state = calculateVerticalLaunch(h0, v0, t, g);
      return {
        time: t,
        height: Number(state.height.toFixed(2)),
        velocity: Number(state.velocity.toFixed(2))
      };
    }, totalFlightTime, 50);
  }, [h0, v0, g, totalFlightTime]);

  const maxRulerHeight = Math.max(60, Math.ceil(currentState.maxHeight / 10) * 10 + 10);

  return (
    <div>
      <div className="sim-page-header">
        <div className="sim-page-title-row">
          <div>
            <div className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
              Módulo 5 • Subida e Descida
            </div>
            <h1 className="sim-page-title">Lançamento Vertical para Cima</h1>
          </div>
          <p className="teacher-hide" style={{ color: 'var(--color-text-muted)', maxWidth: '520px', fontSize: '0.95rem' }}>
            O projétil sobe desacelerando até parar no ápice (v = 0), invertendo o sentido do movimento e descendo acelerado sob a ação contínua da gravidade.
          </p>
        </div>
      </div>

      <div className="sim-layout">
        <div>
          <div className="sim-stage-card">
            <div className="sim-stage-header">
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                Laboratório de Lançamento Vertical — Trajetória de Voo
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: currentState.isAtPeak ? '#7c3aed' : currentState.isGoingUp ? '#059669' : currentState.isGoingDown ? '#d97706' : '#64748b' }}>
                {currentState.hasLanded
                  ? 'Atingiu o Solo'
                  : currentState.isAtPeak
                  ? 'No Ponto Mais Alto (Ápice: v = 0 m/s)'
                  : currentState.isGoingUp
                  ? 'Subindo contra a gravidade'
                  : 'Descendo a favor da gravidade'}
              </span>
            </div>

            <SimulationCanvas
              mode="vertical"
              pos1={currentState.height}
              vel1={currentState.velocity}
              acc1={currentState.acceleration}
              color1="#7c3aed"
              minPos={0}
              maxPos={maxRulerHeight}
              peakHeight={currentState.maxHeight}
              showVectors={true}
              showRuler={true}
              hasImpacted={currentState.hasLanded}
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
              isFinished={currentState.hasLanded}
            />

            {/* Painel Digital de Leituras */}
            <div className="readouts-panel">
              <div className="readout-card">
                <div className="readout-label">Altura Atual h(t)</div>
                <div className="readout-value" style={{ color: '#7c3aed' }}>
                  {formatNumber(currentState.height, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Velocidade Instantânea</div>
                <div className="readout-value" style={{ color: currentState.velocity >= 0 ? '#16a34a' : '#d97706' }}>
                  {formatNumber(currentState.velocity, 1)}
                  <span className="readout-unit">m/s</span>
                </div>
              </div>

              <div className="readout-card" style={{ backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe' }}>
                <div className="readout-label" style={{ color: '#6b21a8' }}>Altura Máxima (h_max)</div>
                <div className="readout-value" style={{ color: '#6b21a8' }}>
                  {formatNumber(currentState.maxHeight, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Tempo de Subida (t_pico)</div>
                <div className="readout-value">
                  {formatNumber(currentState.peakTime, 2)}
                  <span className="readout-unit">s</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                  Tempo Total: {formatNumber(currentState.totalFlightTime, 2)} s
                </div>
              </div>
            </div>
          </div>

          {/* Abas e Gráficos */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                className={`chart-tab-btn ${activeChartTab === 'height' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('height')}
              >
                Gráfico Altura × Tempo (h × t)
              </button>
              <button
                className={`chart-tab-btn ${activeChartTab === 'velocity' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('velocity')}
              >
                Gráfico Velocidade × Tempo (v × t)
              </button>
            </div>

            {activeChartTab === 'height' ? (
              <PhysicsChart
                title="Parábola da Altura: h(t) = h₀ + v₀t - (1/2)gt²"
                data={chartData}
                lines={[
                  { key: 'height', name: 'Altura h(t)', color: '#7c3aed', unit: 'm' }
                ]}
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Altura h (m)"
                currentTime={simTime}
                slopeMeaning="No vértice da parábola (ápice em t_pico), a reta tangente é perfeitamente horizontal (inclinação nula), confirmando que a velocidade se anula instantaneamente: v(t_pico) = 0."
              />
            ) : (
              <PhysicsChart
                title="Velocidade no Lançamento: v(t) = v₀ - gt"
                data={chartData}
                lines={[
                  { key: 'velocity', name: 'Velocidade Vertical v(t)', color: '#16a34a', unit: 'm/s' }
                ]}
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Velocidade v (m/s)"
                currentTime={simTime}
                slopeMeaning="A reta cruza o eixo zero exatamente no instante t_pico = v₀ / g. A inclinação contínua de -9,81 m/s² prova que a aceleração nunca cessa de agir sobre o corpo!"
              />
            )}
          </div>
        </div>

        {/* Painel Lateral */}
        <div className="sim-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Parâmetros do Lançamento</h3>

            <NumericInput
              label="Velocidade Inicial (v₀)"
              value={v0}
              onChange={(val) => {
                setV0(Math.max(1, val));
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={1}
              max={40}
              step={1}
              unit="m/s"
              description="Velocidade de subida com que o corpo é disparado"
            />

            <NumericInput
              label="Altura Inicial (h₀)"
              value={h0}
              onChange={(val) => {
                setH0(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={0}
              max={60}
              step={5}
              unit="m"
              description="Plataforma de lançamento em relação ao solo"
            />

            <NumericInput
              label="Aceleração Gravitacional (g)"
              value={g}
              onChange={(val) => {
                setG(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={1.62}
              max={25}
              step={0.1}
              unit="m/s²"
            />

            <FormulaCard
              title="Equação do Tempo de Subida"
              latex="t_{\text{pico}} = \frac{v_0}{g}"
              substitutionLatex={`t_{\\text{pico}} = \\frac{${v0}}{${g}} = ${formatNumber(currentState.peakTime, 2)}\\text{ s}`}
              variables={[
                { symbol: 't_pico', name: 'Instante no qual v = 0 no ponto mais alto', unit: 's' },
                { symbol: 'v₀', name: 'Velocidade inicial de subida', unit: 'm/s' },
                { symbol: 'g', name: 'Aceleração da gravidade', unit: 'm/s²' }
              ]}
            />

            <FormulaCard
              title="Altura Máxima Atingida"
              latex="h_{\max} = h_0 + \frac{v_0^2}{2g}"
              substitutionLatex={`h_{\\max} = ${h0} + \\frac{(${v0})^2}{2 \\cdot (${g})} = ${h0} + ${formatNumber(currentState.maxDeltaH, 2)} = ${formatNumber(currentState.maxHeight, 2)}\\text{ m}`}
            />
          </div>

          <div className="sidebar-card teacher-hide">
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>
              Atenção Científica Essencial
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              No ponto de altura máxima, o corpo para instantaneamente (<strong>v = 0</strong>), mas a força peso e a aceleração da gravidade (<strong>a = -9,81 m/s²</strong>) continuam agindo normalmente! Sem aceleração, o corpo ficaria levitando para sempre no ar.
            </p>
          </div>
        </div>
      </div>

      {/* Modo Aluno: Aprendizagem Guiada */}
      <div className="pedagogy-section teacher-hide">
        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <Lightbulb size={20} color="var(--accent-amber)" />
            Pergunta Investigativa do Ápice
          </h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            No instante em que o objeto atinge exatamente a <strong>altura máxima</strong>, qual é o valor da sua velocidade e da sua aceleração?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              className={`exercise-option-btn ${apexInquiry === 'correto' ? 'selected' : ''}`}
              onClick={() => {
                setApexInquiry('correto');
                setShowApexFeedback(true);
              }}
            >
              Velocidade instantânea é 0 m/s, mas a aceleração continua sendo g (9,81 m/s² para baixo).
            </button>
            <button
              className={`exercise-option-btn ${apexInquiry === 'incorreto' ? 'selected' : ''}`}
              onClick={() => {
                setApexInquiry('incorreto');
                setShowApexFeedback(true);
              }}
            >
              Tanto a velocidade quanto a aceleração são iguais a zero.
            </button>
          </div>

          {showApexFeedback && (
            <div className={`exercise-feedback-box ${apexInquiry === 'correto' ? 'feedback-success' : 'feedback-error'}`}>
              <strong>{apexInquiry === 'correto' ? 'Perfeito! Raciocínio de físico!' : 'Cuidado com este erro clássico!'}</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Se a aceleração fosse zero no topo, a taxa de variação da velocidade seria nula, e o objeto não começaria a cair de volta! A gravidade atua ininterruptamente sobre o projétil durante todo o voo.
              </p>
            </div>
          )}
        </div>

        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <CheckCircle size={20} color="var(--accent-emerald)" />
            Exemplo Resolvido de Lançamento
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Problema:</strong> Uma bola é lançada para cima do chão (h₀ = 0) com velocidade v₀ = 19,62 m/s. Adotando g = 9,81 m/s², calcule o tempo de subida e a altura máxima atingida.
            </p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Tempo até o topo:</strong> t_pico = v₀ / g = 19,62 / 9,81 = <strong>2,0 segundos</strong>.</li>
              <li><strong>Altura máxima:</strong> h_max = (19,62)² / (2 · 9,81) = 384,94 / 19,62 = <strong>19,62 metros</strong>.</li>
              <li><strong>Tempo total de retorno ao solo:</strong> 2 · t_pico = <strong>4,0 segundos</strong>.</li>
            </ol>
            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: 6, fontSize: '0.8rem', borderLeft: '3px solid var(--accent-emerald)' }}>
              <strong>Propriedade de Simetria:</strong> Sem resistência do ar, o tempo de subida é exatamente igual ao tempo de descida, e a velocidade com que a bola atinge o chão é igual a -v₀.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
