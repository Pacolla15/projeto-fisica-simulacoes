import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calculateFreeFall, generateTimeSeries, STANDARD_GRAVITY } from '../physics/kinematics';
import { formatNumber, formatQuantity } from '../physics/units';
import SimulationCanvas from '../components/SimulationCanvas';
import SimulationControls from '../components/SimulationControls';
import NumericInput from '../components/NumericInput';
import FormulaCard from '../components/FormulaCard';
import PhysicsChart from '../components/PhysicsChart';
import { Lightbulb, CheckCircle, Wind, ShieldAlert } from 'lucide-react';

export default function FreeFall({ isTeacherMode }) {
  // Parâmetros da Queda
  const [h0, setH0] = useState(50);
  const [v0, setV0] = useState(0);
  const [g, setG] = useState(STANDARD_GRAVITY);
  const [airResistance, setAirResistance] = useState(false);
  const [dragK, setDragK] = useState(0.08); // Coeficiente de arrasto
  const [mass, setMass] = useState(1.0); // Massa (kg)

  // Estado da simulação
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeChartTab, setActiveChartTab] = useState('height'); // 'height' | 'velocity' | 'acceleration'

  // Pergunta de investigação
  const [dragInquiryAnswer, setDragInquiryAnswer] = useState(null);
  const [showInquiryFeedback, setShowInquiryFeedback] = useState(false);

  const animFrameRef = useRef(null);
  const lastWallTimeRef = useRef(null);

  // Cálculos no instante simTime
  const currentState = useMemo(() => {
    return calculateFreeFall(h0, v0, simTime, g, airResistance, dragK, mass);
  }, [h0, v0, simTime, g, airResistance, dragK, mass]);

  // Tempo máximo visível do experimento
  const maxExperimentTime = useMemo(() => {
    const idealImpact = calculateFreeFall(h0, v0, 100, g, false).impactTime;
    return Math.max(2, Math.ceil(idealImpact * 1.3));
  }, [h0, v0, g]);

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
        // Verifica se houve impacto com o solo
        const probe = calculateFreeFall(h0, v0, nextTime, g, airResistance, dragK, mass);
        if (probe.hasImpacted) {
          setIsPlaying(false);
          return probe.impactTime;
        }
        if (nextTime >= maxExperimentTime) {
          setIsPlaying(false);
          return maxExperimentTime;
        }
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, h0, v0, g, airResistance, dragK, mass, speed, maxExperimentTime]);

  const handlePlay = () => {
    if (currentState.hasImpacted || simTime >= maxExperimentTime) {
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
    setSimTime((prev) => prev + 0.1);
  };

  // Séries temporais para gráficos
  const chartData = useMemo(() => {
    const totalT = Math.max(currentState.impactTime * 1.1, 1);
    return generateTimeSeries((t) => {
      const state = calculateFreeFall(h0, v0, t, g, airResistance, dragK, mass);
      return {
        time: t,
        height: Number(state.height.toFixed(2)),
        velocity: Number(state.velocity.toFixed(2)),
        acceleration: Number(state.acceleration.toFixed(2))
      };
    }, totalT, 40);
  }, [h0, v0, g, airResistance, dragK, mass, currentState.impactTime]);

  return (
    <div>
      <div className="sim-page-header">
        <div className="sim-page-title-row">
          <div>
            <div className="badge badge-red" style={{ marginBottom: '0.4rem' }}>
              Módulo 4 • Movimento Vertical
            </div>
            <h1 className="sim-page-title">Queda Livre e Resistência do Ar</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className={`sim-ctrl-btn ${airResistance ? 'btn-play' : ''}`}
              onClick={() => {
                setAirResistance(!airResistance);
                setSimTime(0);
                setIsPlaying(false);
              }}
              style={{ fontSize: '0.85rem' }}
            >
              <Wind size={16} />
              <span>{airResistance ? 'Resistência do Ar: ATIVADA' : 'Resistência do Ar: DESATIVADA'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="sim-layout">
        <div>
          <div className="sim-stage-card">
            <div className="sim-stage-header">
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                Laboratório de Queda Vertical — Torre de Altura
              </span>
              <span style={{ fontSize: '0.8rem', color: currentState.hasImpacted ? '#dc2626' : 'var(--color-text-muted)', fontWeight: currentState.hasImpacted ? 'bold' : 'normal' }}>
                {currentState.hasImpacted ? 'Impacto com o Solo (h = 0 m)!' : 'Em Queda no Ar'}
              </span>
            </div>

            <SimulationCanvas
              mode="vertical"
              pos1={currentState.height}
              vel1={currentState.velocity}
              acc1={currentState.acceleration}
              color1="#dc2626"
              minPos={0}
              maxPos={Math.max(60, Math.ceil(h0 / 10) * 10 + 10)}
              showVectors={true}
              showRuler={true}
              hasImpacted={currentState.hasImpacted}
              airResistance={airResistance}
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
              isFinished={currentState.hasImpacted}
            />

            <div className="readouts-panel">
              <div className="readout-card">
                <div className="readout-label">Altura Atual h(t)</div>
                <div className="readout-value" style={{ color: '#dc2626' }}>
                  {formatNumber(currentState.height, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Distância de Queda</div>
                <div className="readout-value">
                  {formatNumber(currentState.fallDistance, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Velocidade Instantânea</div>
                <div className="readout-value" style={{ color: '#16a34a' }}>
                  {formatNumber(currentState.velocity, 1)}
                  <span className="readout-unit">m/s</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                  Rapidez: {formatNumber(currentState.speed, 1)} m/s
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Instante do Impacto</div>
                <div className="readout-value" style={{ color: '#7c3aed' }}>
                  {formatNumber(currentState.impactTime, 2)}
                  <span className="readout-unit">s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Abas de Gráficos */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                className={`chart-tab-btn ${activeChartTab === 'height' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('height')}
              >
                Altura × Tempo (h × t)
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

            {activeChartTab === 'height' && (
              <PhysicsChart
                title="Altura em Função do Tempo: h(t) = h₀ - (1/2)gt²"
                data={chartData}
                lines={[
                  { key: 'height', name: airResistance ? 'Altura (Com Arrasto)' : 'Altura (Queda Livre Ideal)', color: '#dc2626', unit: 'm' }
                ]}
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Altura h (m)"
                currentTime={simTime}
                slopeMeaning="A inclinação da curva decrescente é negativa e fornece a velocidade vertical instantânea v(t). O ponto onde a curva atinge o eixo horizontal (h = 0) marca o instante exato do impacto com o solo."
              />
            )}

            {activeChartTab === 'velocity' && (
              <PhysicsChart
                title="Velocidade Vertical: v(t) = v₀ - gt"
                data={chartData}
                lines={[
                  { key: 'velocity', name: 'Velocidade Vertical v(t)', color: '#16a34a', unit: 'm/s' }
                ]}
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Velocidade v (m/s)"
                currentTime={simTime}
                slopeMeaning={airResistance ? 'Com resistência do ar, a inclinação diminui até se tornar nula quando o corpo atinge a velocidade terminal constante.' : 'No vácuo, a inclinação é rigorosamente constante e igual a -g = -9,81 m/s².'}
              />
            )}

            {activeChartTab === 'acceleration' && (
              <PhysicsChart
                title="Aceleração Vertical em Função do Tempo"
                data={chartData}
                lines={[
                  { key: 'acceleration', name: 'Aceleração a(t)', color: '#7c3aed', unit: 'm/s²' }
                ]}
                xAxisLabel="Tempo t (s)"
                yAxisLabel="Aceleração a (m/s²)"
                currentTime={simTime}
                areaMeaning="No caso ideal, a = -9,81 m/s² constante. Com resistência do ar, o módulo da aceleração cai continuamente em direção a zero à medida que a força de arrasto equilibra o peso."
              />
            )}
          </div>
        </div>

        {/* Painel Lateral */}
        <div className="sim-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Parâmetros da Queda</h3>

            <NumericInput
              label="Altura Inicial (h₀)"
              value={h0}
              onChange={(val) => {
                setH0(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={5}
              max={100}
              step={5}
              unit="m"
              description="Altura do ponto de soltura em relação ao solo"
            />

            <NumericInput
              label="Velocidade Inicial Vertical (v₀)"
              value={v0}
              onChange={(val) => {
                setV0(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-10}
              max={15}
              step={1}
              unit="m/s"
              description="0 = Solto do repouso; > 0 = Lançado para cima; < 0 = Atirado para baixo"
            />

            <NumericInput
              label="Magnitude da Gravidade (g)"
              value={g}
              onChange={(val) => {
                setG(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={1.62}
              max={24.79}
              step={0.1}
              unit="m/s²"
              description="9.81 m/s² (Terra) • 1.62 (Lua) • 3.71 (Marte)"
            />

            {airResistance && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                  Modelo Físico de Arrasto do Ar: F_arrasto = -k · v · |v|
                </div>
                <NumericInput
                  label="Coeficiente de Arrasto (k)"
                  value={dragK}
                  onChange={setDragK}
                  min={0.02}
                  max={0.25}
                  step={0.01}
                  unit=""
                />
                <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: '0.5rem' }}>
                  <strong>Velocidade Terminal Teórica:</strong> {formatNumber(currentState.terminalSpeed, 1)} m/s ({formatNumber(currentState.terminalSpeed * 3.6, 1)} km/h).
                </div>
              </div>
            )}

            <FormulaCard
              title="Equação da Queda Livre (Referencial Cima +)"
              latex="h(t) = h_0 + v_0 t - \frac{1}{2} g t^2"
              substitutionLatex={`h(${formatNumber(simTime, 1)}) = ${h0} + (${v0})(${formatNumber(simTime, 1)}) - \\frac{1}{2}(${g})(${formatNumber(simTime, 1)})^2 = ${formatNumber(currentState.height, 1)}\\text{ m}`}
              variables={[
                { symbol: 'h(t)', name: 'Altura no instante t', unit: 'm' },
                { symbol: 'h₀', name: 'Altura inicial de soltura', unit: 'm' },
                { symbol: 'g', name: 'Aceleração da gravidade', unit: 'm/s²' },
                { symbol: 't_impacto', name: 'Instante em que atinge o solo (h = 0)', unit: 's' }
              ]}
            />
          </div>

          <div className="sidebar-card teacher-hide">
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>
              Diferença entre Altura e Deslocamento
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              <p>• <strong>Altura h(t):</strong> Coordenada vertical em relação ao solo (h = 0).</p>
              <p>• <strong>Deslocamento Δh:</strong> h(t) - h₀ = -{formatNumber(currentState.fallDistance, 1)} m (negativo porque desceu).</p>
              <p>• <strong>Distância de Queda:</strong> {formatQuantity(currentState.fallDistance, 'm')} (positivo).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modo Aluno: Aprendizagem Guiada */}
      <div className="pedagogy-section teacher-hide">
        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <Lightbulb size={20} color="var(--accent-amber)" />
            Investigação Científica: O Papel da Resistência do Ar
          </h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            No vácuo, a velocidade de queda de um corpo continuaria aumentando indefinidamente enquanto houvesse altura. Na presença da atmosfera terrestre, o que ocorre após algum tempo de queda livre?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              className={`exercise-option-btn ${dragInquiryAnswer === 'terminal' ? 'selected' : ''}`}
              onClick={() => {
                setDragInquiryAnswer('terminal');
                setShowInquiryFeedback(true);
              }}
            >
              A força de arrasto do ar se iguala ao peso, a aceleração zera e o corpo atinge uma velocidade constante (velocidade terminal).
            </button>
            <button
              className={`exercise-option-btn ${dragInquiryAnswer === 'recua' ? 'selected' : ''}`}
              onClick={() => {
                setDragInquiryAnswer('recua');
                setShowInquiryFeedback(true);
              }}
            >
              A força do ar vence a gravidade e o objeto começa a subir de volta.
            </button>
          </div>

          {showInquiryFeedback && (
            <div className={`exercise-feedback-box ${dragInquiryAnswer === 'terminal' ? 'feedback-success' : 'feedback-error'}`}>
              <strong>{dragInquiryAnswer === 'terminal' ? 'Correto!' : 'Reveja os conceitos de dinâmica!'}</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                À medida que a velocidade de descida cresce, a resistência do ar para cima aumenta proporcionalmente a v². Quando F_arrasto = Peso, a resultante é nula (Fr = 0), a aceleração torna-se zero e a velocidade estabiliza na chamada <em>velocidade terminal</em>.
              </p>
            </div>
          )}
        </div>

        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <CheckCircle size={20} color="var(--accent-emerald)" />
            Exemplo Resolvido: Queda a partir do Repouso
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Problema:</strong> Um objeto é solto do repouso (v₀ = 0) do alto de uma torre de h₀ = 100 m sem resistência do ar com g = 9,81 m/s². Qual é a distância percorrida após t = 2,0 segundos?
            </p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Fórmula da distância de queda:</strong> d_queda = (1/2) · g · t².</li>
              <li><strong>Substituição:</strong> d_queda = 0,5 · 9,81 · (2,0)² = 0,5 · 9,81 · 4 = <strong>19,62 metros</strong>.</li>
              <li><strong>Altura restante:</strong> h(2) = 100 - 19,62 = <strong>80,38 metros</strong>.</li>
            </ol>
            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: 6, fontSize: '0.8rem', borderLeft: '3px solid var(--accent-emerald)' }}>
              <strong>Nota Pedagógica:</strong> A gravidade acelera o corpo uniformemente a uma taxa de 9,81 m/s a cada segundo de queda livre no vácuo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
