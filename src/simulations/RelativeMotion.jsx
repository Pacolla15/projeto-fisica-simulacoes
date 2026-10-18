import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  calculateRelativeMotion,
  getRelativeMotionStateAt,
  generateTimeSeries
} from '../physics/kinematics';
import { formatNumber, formatQuantity } from '../physics/units';
import SimulationCanvas from '../components/SimulationCanvas';
import SimulationControls from '../components/SimulationControls';
import NumericInput from '../components/NumericInput';
import FormulaCard from '../components/FormulaCard';
import PhysicsChart from '../components/PhysicsChart';
import { Lightbulb, CheckCircle, Crosshair, AlertTriangle } from 'lucide-react';

export default function RelativeMotion({ isTeacherMode }) {
  // Parâmetros dos Móveis
  const [s1_0, setS1_0] = useState(0);
  const [v1, setV1] = useState(20);

  const [s2_0, setS2_0] = useState(100);
  const [v2, setV2] = useState(-10); // Sentido oposto

  const [duration, setDuration] = useState(10);

  // Estado da simulação
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Pergunta de investigação
  const [relativeInquiry, setRelativeInquiry] = useState(null);
  const [showInquiryFeedback, setShowInquiryFeedback] = useState(false);

  const animFrameRef = useRef(null);
  const lastWallTimeRef = useRef(null);

  // Cálculos de encontro analítico
  const meetingResult = useMemo(() => {
    return calculateRelativeMotion(s1_0, v1, s2_0, v2, duration);
  }, [s1_0, v1, s2_0, v2, duration]);

  // Estado atual no instante simTime
  const currentState = useMemo(() => {
    return getRelativeMotionStateAt(s1_0, v1, s2_0, v2, simTime);
  }, [s1_0, v1, s2_0, v2, simTime]);

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

  // Séries temporais para gráfico conjunto s × t
  const chartData = useMemo(() => {
    return generateTimeSeries((t) => {
      const state = getRelativeMotionStateAt(s1_0, v1, s2_0, v2, t);
      return {
        time: t,
        pos1: Number(state.pos1.toFixed(2)),
        pos2: Number(state.pos2.toFixed(2))
      };
    }, duration, 50);
  }, [s1_0, v1, s2_0, v2, duration]);

  // Limites da régua
  const allPoints = [s1_0, s1_0 + v1 * duration, s2_0, s2_0 + v2 * duration];
  if (meetingResult.meetingPosition !== null && meetingResult.meetingTime <= duration) {
    allPoints.push(meetingResult.meetingPosition);
  }
  const minPos = Math.min(-20, Math.floor(Math.min(...allPoints) / 10) * 10 - 10);
  const maxPos = Math.max(120, Math.ceil(Math.max(...allPoints) / 10) * 10 + 10);

  // Verifica se estão se cruzando neste instante
  const isMeetingNow = Math.abs(currentState.pos1 - currentState.pos2) < 2.0;

  return (
    <div>
      <div className="sim-page-header">
        <div className="sim-page-title-row">
          <div>
            <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>
              Módulo 6 • Cinemática com Dois Corpos
            </div>
            <h1 className="sim-page-title">Movimento Relativo e Encontro de Objetos</h1>
          </div>
          <p className="teacher-hide" style={{ color: 'var(--color-text-muted)', maxWidth: '520px', fontSize: '0.95rem' }}>
            Determine analiticamente o instante e o local de intersecção das trajetórias de dois veículos em Movimento Retilíneo Uniforme.
          </p>
        </div>
      </div>

      <div className="sim-layout">
        <div>
          <div className="sim-stage-card">
            <div className="sim-stage-header">
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                Laboratório de Pista Dupla — Análise de Encontro
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isMeetingNow ? '#7c3aed' : 'var(--color-text-muted)' }}>
                {isMeetingNow ? 'Cruzando no Mesmo Marco Agora!' : meetingResult.statusMessage}
              </span>
            </div>

            <SimulationCanvas
              mode="relative"
              pos1={currentState.pos1}
              vel1={currentState.vel1}
              label1="Carro Azul (1)"
              color1="#2563eb"
              pos2={currentState.pos2}
              vel2={currentState.vel2}
              label2="Carro Laranja (2)"
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

            {/* Painel Digital de Leituras */}
            <div className="readouts-panel">
              <div className="readout-card">
                <div className="readout-label">Posição Carro 1 (Azul)</div>
                <div className="readout-value" style={{ color: '#2563eb' }}>
                  {formatNumber(currentState.pos1, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Posição Carro 2 (Laranja)</div>
                <div className="readout-value" style={{ color: '#d97706' }}>
                  {formatNumber(currentState.pos2, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card">
                <div className="readout-label">Distância entre Eles</div>
                <div className="readout-value" style={{ color: isMeetingNow ? '#7c3aed' : 'var(--color-text-main)' }}>
                  {formatNumber(currentState.distanceBetween, 1)}
                  <span className="readout-unit">m</span>
                </div>
              </div>

              <div className="readout-card" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <div className="readout-label" style={{ color: '#1e40af' }}>Ponto do Encontro</div>
                <div className="readout-value" style={{ color: '#1e40af' }}>
                  {meetingResult.meetingTime !== null ? `${formatNumber(meetingResult.meetingTime, 2)} s` : 'Inexistente'}
                </div>
                {meetingResult.meetingPosition !== null && (
                  <div style={{ fontSize: '0.75rem', color: '#1e40af' }}>
                    em s = {formatNumber(meetingResult.meetingPosition, 1)} m
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gráfico Científico com as duas trajetórias se cruzando */}
          <div style={{ marginTop: '1.5rem' }}>
            <PhysicsChart
              title="Trajetórias no Gráfico s × t — Ponto de Cruzamento"
              data={chartData}
              lines={[
                { key: 'pos1', name: 'Trajetória Carro Azul s₁(t)', color: '#2563eb', unit: 'm' },
                { key: 'pos2', name: 'Trajetória Carro Laranja s₂(t)', color: '#d97706', unit: 'm' }
              ]}
              xAxisLabel="Tempo t (s)"
              yAxisLabel="Posição s (m)"
              currentTime={simTime}
              slopeMeaning="As retas têm coeficientes angulares iguais a v₁ e v₂. O ponto de intersecção exato entre as duas linhas retas no gráfico representa a posição e o instante do encontro físico dos dois veículos."
            />
          </div>
        </div>

        {/* Painel Lateral com Parâmetros dos dois móveis */}
        <div className="sim-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">
              Móvel 1 (Azul)
            </h3>
            <NumericInput
              label="Posição Inicial (s₁₀)"
              value={s1_0}
              onChange={(val) => {
                setS1_0(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-50}
              max={100}
              step={5}
              unit="m"
            />
            <NumericInput
              label="Velocidade (v₁)"
              value={v1}
              onChange={(val) => {
                setV1(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-25}
              max={30}
              step={1}
              unit="m/s"
            />
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-card-title" style={{ color: '#d97706' }}>
              Móvel 2 (Laranja)
            </h3>
            <NumericInput
              label="Posição Inicial (s₂₀)"
              value={s2_0}
              onChange={(val) => {
                setS2_0(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-50}
              max={150}
              step={5}
              unit="m"
            />
            <NumericInput
              label="Velocidade (v₂)"
              value={v2}
              onChange={(val) => {
                setV2(val);
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={-25}
              max={30}
              step={1}
              unit="m/s"
              description="Velocidade negativa = Sentidos opostos"
            />

            <NumericInput
              label="Duração da Análise"
              value={duration}
              onChange={(val) => {
                setDuration(Math.max(2, val));
                setSimTime(0);
                setIsPlaying(false);
              }}
              min={2}
              max={25}
              step={1}
              unit="s"
            />

            <FormulaCard
              title="Equação do Instante de Encontro"
              latex="t_{\text{enc}} = \frac{s_{20} - s_{10}}{v_1 - v_2}"
              substitutionLatex={
                v1 !== v2
                  ? `t_{\\text{enc}} = \\frac{${s2_0} - (${s1_0})}{${v1} - (${v2})} = \\frac{${s2_0 - s1_0}}{${v1 - v2}} = ${meetingResult.meetingTime !== null ? formatNumber(meetingResult.meetingTime, 2) : '—'}\\text{ s}`
                  : `v_1 = v_2 \\implies \\Delta v = 0\\text{ (Não há encontro futuro)}`
              }
              variables={[
                { symbol: 's₁(t)', name: 'Função horária do móvel 1', unit: 'm' },
                { symbol: 's₂(t)', name: 'Função horária do móvel 2', unit: 'm' },
                { symbol: 't_enc', name: 'Instante onde s₁(t) = s₂(t)', unit: 's' }
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
            Investigação de Cinemática Relativa
          </h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Se dois veículos trafegam no mesmo sentido em uma rodovia com <strong>exatamente a mesma velocidade constante</strong> (v₁ = v₂), mas partiram de posições distintas, o que acontecerá com a distância entre eles e quando haverá encontro?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              className={`exercise-option-btn ${relativeInquiry === 'nunca' ? 'selected' : ''}`}
              onClick={() => {
                setRelativeInquiry('nunca');
                setShowInquiryFeedback(true);
              }}
            >
              A distância entre eles permanecerá rigorosamente constante e eles jamais se encontrarão (retas paralelas no gráfico s × t).
            </button>
            <button
              className={`exercise-option-btn ${relativeInquiry === 'eventual' ? 'selected' : ''}`}
              onClick={() => {
                setRelativeInquiry('eventual');
                setShowInquiryFeedback(true);
              }}
            >
              Eles se encontrarão no infinito devido ao efeito da velocidade constante.
            </button>
          </div>

          {showInquiryFeedback && (
            <div className={`exercise-feedback-box ${relativeInquiry === 'nunca' ? 'feedback-success' : 'feedback-error'}`}>
              <strong>{relativeInquiry === 'nunca' ? 'Correto!' : 'Reveja a geometria do gráfico!'}</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Como v_rel = v₁ - v₂ = 0, a taxa de aproximação é nula. No gráfico s × t, as duas retas possuem o mesmo coeficiente angular (mesma inclinação) e coeficientes lineares distintos, sendo geometricamente paralelas e sem ponto comum. Ajuste v₁ = v₂ nos controles e veja o paralelismo no gráfico!
              </p>
            </div>
          )}
        </div>

        <div className="pedagogy-card">
          <h3 className="pedagogy-card-title">
            <CheckCircle size={20} color="var(--accent-emerald)" />
            Exemplo Resolvido: Móveis em Sentidos Opostos
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Problema:</strong> O carro 1 parte de s₁₀ = 0 m com v₁ = 20 m/s. O carro 2 parte de s₂₀ = 100 m no sentido oposto com v₂ = -30 m/s. Em que instante e posição ocorre o cruzamento?
            </p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Igualando as posições:</strong> s₁(t) = s₂(t) ⟹ 0 + 20·t = 100 - 30·t.</li>
              <li><strong>Isolando o tempo:</strong> 20·t + 30·t = 100 ⟹ 50·t = 100 ⟹ <strong>t = 2,0 segundos</strong>.</li>
              <li><strong>Posição do encontro:</strong> s₁(2) = 20 · 2,0 = <strong>40,0 metros</strong>.</li>
            </ol>
            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: 6, fontSize: '0.8rem', borderLeft: '3px solid var(--accent-emerald)' }}>
              <strong>Velocidade Relativa de Aproximação:</strong> Quando trafegam em sentidos contrários, suas velocidades se somam em módulo (|20| + |-30| = 50 m/s), reduzindo o tempo até o encontro.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
