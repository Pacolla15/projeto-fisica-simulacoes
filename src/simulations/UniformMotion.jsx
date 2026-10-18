import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calculateMRU, generateTimeSeries } from '../physics/kinematics';
import { formatNumber } from '../physics/units';
import SimulationCanvas from '../components/SimulationCanvas';
import SimulationControls from '../components/SimulationControls';
import NumericInput from '../components/NumericInput';
import FormulaCard from '../components/FormulaCard';
import PhysicsChart from '../components/PhysicsChart';
import { Lightbulb, CheckCircle, Users } from 'lucide-react';

export default function UniformMotion({ isTeacherMode }) {
  // Parâmetros do Móvel Principal (Móvel A)
  const [s0, setS0] = useState(0);
  const [v, setV] = useState(8);
  const [duration, setDuration] = useState(10);

  // Modo Comparativo de 2 Móveis
  const [compareMode, setCompareMode] = useState(false);
  const [s0_2, setS0_2] = useState(40);
  const [v_2, setV_2] = useState(3);

  // Estado temporal da simulação
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeChartTab, setActiveChartTab] = useState('position'); // 'position' | 'velocity'

  // Pergunta de investigação
  const [inquiryAnswer, setInquiryAnswer] = useState(null);
  const [showInquiryFeedback, setShowInquiryFeedback] = useState(false);

  const animFrameRef = useRef(null);
  const lastWallTimeRef = useRef(null);

  // Cálculos no instante simTime
  const stateA = useMemo(() => calculateMRU(s0, v, simTime), [s0, v, simTime]);
  const stateB = useMemo(() => calculateMRU(s0_2, v_2, simTime), [s0_2, v_2, simTime]);

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
      const mA = calculateMRU(s0, v, t);
      const mB = calculateMRU(s0_2, v_2, t);
      return {
        time: t,
        posA: Number(mA.position.toFixed(2)),
        velA: Number(mA.velocity.toFixed(2)),
        posB: Number(mB.position.toFixed(2)),
        velB: Number(mB.velocity.toFixed(2))
      };
    }, duration, 40);
  }, [s0, v, s0_2, v_2, duration]);

  // Limites da régua
  const allPositions = [s0, s0 + v * duration];
  if (compareMode) {
    allPositions.push(s0_2, s0_2 + v_2 * duration);
  }
  const minPos = Math.min(-10, Math.floor(Math.min(...allPositions) / 10) * 10 - 10);
  const maxPos = Math.max(100, Math.ceil(Math.max(...allPositions) / 10) * 10 + 10);

  return (
    <div>
      <div className="sim-page-header">
        <div className="sim-page-title-row">
          <div>
            <div className="badge badge-green" style={{ marginBottom: '0.4rem' }}>
              Módulo 2 • Velocidade Constante
            </div>
            <h1 className="sim-page-title">Movimento Retilíneo Uniforme (MRU)</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className={`sim-ctrl-btn ${compareMode ? 'btn-play' : ''}`}
              onClick={() => setCompareMode(!compareMode)}
              style={{ fontSize: '0.85rem' }}
            >
              <Users size={16} />
              <span>{compareMode ? 'Desativar Comparador' : 'Comparar 2 Móveis'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="sim-layout">
        <div>
          <div className="sim-stage-card">
            <div className="sim-stage-header">
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                Laboratório de MRU {compareMode ? '— Dois Móveis em Pistas Paralelas' : '— Pista Retilínea'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {v > 0 ? 'Movimento Progressivo (v > 0)' : v < 0 ? 'Movimento Retrógrado (v < 0)' : 'Corpo em Repouso (v = 0)'}
              </span>
            </div>

            <SimulationCanvas
              mode={compareMode ? 'relative' : 'horizontal'}
              pos1={stateA.position}
              vel1={stateA.velocity}
              acc1={0}
              label1="Móvel 1"
              color1="#059669"
              pos2={stateB.position}
              vel2={stateB.velocity}
              acc2={0}
              label2="Móvel 2"
              color2="#d97706"
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

            <div className="readouts-panel">
              <div className="readout-card">
                <div className="readout-label">Posição s(t) Móvel 1</div>
                <div className="readout-value" style={{ color: '#059669' }}>
                  {formatNumber(stateA.position, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Velocidade v (Constante)</div>
                <div className="readout-value" style={{ color: '#059669' }}>
                  {formatNumber(stateA.velocity, 1)}
                  <span className="readout-unit">m/s</span>
                </div>
              </div>

              {compareMode && (
                <>
                  <div className="readout-card">
                    <div className="readout-label">Posição s(t) Móvel 2</div>
                    <div className="readout-value" style={{ color: '#d97706' }}>
                      {formatNumber(stateB.position, 1)}
                      <span className="readout-unit">m</span>
                    </div>
                  </div>
                  <div className="readout-card">
                    <div className="readout-label">Distância entre Ambos</div>
                    <div className="readout-value" style={{ color: '#7c3aed' }}>
                      {formatNumber(Math.abs(stateA.position - stateB.position), 1)}
                      <span className="readout-unit">m</span>
                    </div>
                  </div>
                </>
              )}

              <div className="readout-card">
                <div className="readout-label">Aceleração (a)</div>
                <div className="readout-value">
                  0,0
                  <span className="readout-unit">m/s²</span>
                </div>
              </div>
            </div>
          </div>

          {/* Abas e Gráficos do MRU */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                className={`chart-tab-btn ${activeChartTab === 'position' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('position')}
              >
                Gráfico Posição × Tempo (s × t)
              </button>
              <button
                className={`chart-tab-btn ${activeChartTab === 'velocity' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('velocity')}
              >
                Gráfico Velocidade × Tempo (v × t)
              </button>
            </div>

            {activeChartTab === 'position' ? (
              <PhysicsChart
                title="Posição em Função do Tempo: s(t) = s₀ + v · t"
                data={chartData}
                lines={
                  compareMode
                    ? [
                        { key: 'posA', name: 'Móvel 1 (s₁)', color: '#059669', unit: 'm' },
                        { key: 'posB', name: 'Móvel 2 (s₂)', color: '#d97706', unit: 'm' }
                      ]
                    : [{ key: 'posA', name: 'Posição s(t)', color: '#059669', unit: 'm' }]
                }
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Posição s (m)"
                currentTime={simTime}
                slopeMeaning="No gráfico s × t, a inclinação da reta é constante e equivale à própria velocidade: tan(θ) = Δs / Δt = v. Quanto mais íngreme for a reta, maior será a rapidez do móvel."
              />
            ) : (
              <PhysicsChart
                title="Velocidade em Função do Tempo: v(t) = constante"
                data={chartData}
                lines={
                  compareMode
                    ? [
                        { key: 'velA', name: 'Velocidade 1', color: '#059669', unit: 'm/s' },
                        { key: 'velB', name: 'Velocidade 2', color: '#d97706', unit: 'm/s' }
                      ]
                    : [{ key: 'velA', name: 'Velocidade v(t)', color: '#059669', unit: 'm/s' }]
                }
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Velocidade v (m/s)"
                currentTime={simTime}
                areaMeaning="A área da região retangular sob a reta horizontal da velocidade entre t = 0 e qualquer instante t representa exatamente o deslocamento: Área = base × altura = t × v = Δs."
              />
            )}
          </div>
        </div>

        {/* Painel Lateral */}
        <div className="sim-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Parâmetros do Móvel 1</h3>

            <NumericInput
              label="Posição Inicial (s₀)"
              value={s0}
              onChange={(val) => {
                setS0(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-50}
              max={50}
              step={5}
              unit="m"
            />

            <NumericInput
              label="Velocidade Constante (v)"
              value={v}
              onChange={(val) => {
                setV(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-20}
              max={25}
              step={1}
              unit="m/s"
              description={v < 0 ? 'Velocidade negativa = Sentido retrógrado' : 'Velocidade positiva = Sentido progressivo'}
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
              max={30}
              step={1}
              unit="s"
            />

            {compareMode && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--color-border)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#d97706', marginBottom: '0.75rem' }}>
                  Parâmetros do Móvel 2 (Comparativo)
                </h4>
                <NumericInput
                  label="Posição Inicial (s₂₀)"
                  value={s0_2}
                  onChange={(val) => {
                    setS0_2(val);
                    setSimTime(0);
                    setIsPlaying(false);
                  }}
                  min={-20}
                  max={80}
                  step={5}
                  unit="m"
                />
                <NumericInput
                  label="Velocidade (v₂)"
                  value={v_2}
                  onChange={(val) => {
                    setV_2(val);
                    setSimTime(0);
                    setIsPlaying(false);
                  }}
                  min={-15}
                  max={20}
                  step={1}
                  unit="m/s"
                />
              </div>
            )}

            <FormulaCard
              title="Função Horária da Posição (MRU)"
              latex="s(t) = s_0 + v \cdot t"
              substitutionLatex={`s(${formatNumber(simTime, 1)}) = ${s0} + (${v}) \\cdot (${formatNumber(simTime, 1)}) = ${formatNumber(stateA.position, 1)}\\text{ m}`}
              variables={[
                { symbol: 's(t)', name: 'Posição no instante t', unit: 'm' },
                { symbol: 's₀', name: 'Posição inicial no instante t = 0', unit: 'm' },
                { symbol: 'v', name: 'Velocidade constante (a = 0)', unit: 'm/s' },
                { symbol: 't', name: 'Instante de tempo analisado', unit: 's' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Modo Aluno: Aprendizagem Guiada */}
      <div className="pedagogy-section teacher-hide">
        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <Lightbulb size={20} color="var(--accent-amber)" />
            Pergunta de Investigação do Aluno
          </h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Se você alterar a velocidade <strong>v</strong> para um valor <strong>negativo</strong> (por exemplo, v = -5 m/s), como se comportará a inclinação do gráfico s × t e para qual direção o veículo se moverá?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              className={`exercise-option-btn ${inquiryAnswer === 'retrogrado' ? 'selected' : ''}`}
              onClick={() => {
                setInquiryAnswer('retrogrado');
                setShowInquiryFeedback(true);
              }}
            >
              A reta terá inclinação decrescente e o veículo andará para trás (para a esquerda).
            </button>
            <button
              className={`exercise-option-btn ${inquiryAnswer === 'crescente' ? 'selected' : ''}`}
              onClick={() => {
                setInquiryAnswer('crescente');
                setShowInquiryFeedback(true);
              }}
            >
              A reta continuará crescente, pois o tempo sempre passa para a frente.
            </button>
          </div>

          {showInquiryFeedback && (
            <div className={`exercise-feedback-box ${inquiryAnswer === 'retrogrado' ? 'feedback-success' : 'feedback-error'}`}>
              <strong>{inquiryAnswer === 'retrogrado' ? 'Excelente dedução!' : 'Atenção aos sinais!'}</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Como s(t) = s₀ + v·t, com v &lt; 0 o coeficiente angular é negativo, resultando em uma reta inclinada para baixo. O corpo move-se no sentido contrário à orientação da trajetória (movimento retrógrado). Ajuste o slider para v negativo e teste!
              </p>
            </div>
          )}
        </div>

        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <CheckCircle size={20} color="var(--accent-emerald)" />
            Exemplo Didático Resolvido
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Problema:</strong> Um móvel em MRU parte da posição s₀ = -15 m com velocidade constante v = 5 m/s. Em que instante ele cruzará a origem das posições (s = 0 m)?
            </p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Função horária:</strong> s(t) = -15 + 5 · t.</li>
              <li><strong>Condição de cruzamento da origem:</strong> s(t) = 0.</li>
              <li><strong>Resolução:</strong> 0 = -15 + 5 · t  ⟹  5 · t = 15  ⟹  <strong>t = 3,0 segundos</strong>.</li>
            </ol>
            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: 6, fontSize: '0.8rem', borderLeft: '3px solid var(--accent-emerald)' }}>
              <strong>Conclusão Pedagógica:</strong> A taxa de variação constante permite prever exatamente a posição futura ou o instante de cruzamento de qualquer marco.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
