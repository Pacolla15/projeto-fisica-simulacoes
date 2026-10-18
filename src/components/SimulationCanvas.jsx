import React from 'react';
import { formatNumber } from '../physics/units';

/**
 * Canvas SVG interativo do laboratório de física para visualização cinemática
 */
export default function SimulationCanvas({
  mode = 'horizontal', // 'horizontal' | 'vertical' | 'relative'
  // Parâmetros do objeto 1 (ou objeto único)
  pos1 = 0,
  vel1 = 0,
  acc1 = 0,
  label1 = 'Móvel A',
  color1 = '#2563eb',

  // Parâmetros do objeto 2 (apenas para modo 'relative')
  pos2 = 0,
  vel2 = 0,
  acc2 = 0,
  label2 = 'Móvel B',
  color2 = '#d97706',

  // Limites da régua visual
  minPos = 0,
  maxPos = 100,

  // Recursos visuais
  showVectors = true,
  showRuler = true,
  hasImpacted = false,
  peakHeight = null,
  airResistance = false
}) {
  const svgWidth = 800;
  const svgHeight = 260;

  // Escala para modo horizontal
  const padX = 60;
  const trackWidth = svgWidth - 2 * padX;
  const posToX = (pos) => {
    const range = Math.max(1, maxPos - minPos);
    const clamped = Math.max(minPos, Math.min(pos, maxPos));
    return padX + ((clamped - minPos) / range) * trackWidth;
  };

  // Escala para modo vertical
  const padBottom = 40;
  const padTop = 30;
  const towerHeight = svgHeight - padBottom - padTop;
  const posToY = (height) => {
    const range = Math.max(1, maxPos - minPos);
    const clamped = Math.max(0, Math.min(height, maxPos));
    return svgHeight - padBottom - (clamped / range) * towerHeight;
  };

  return (
    <div className="sim-stage-canvas-wrap">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {/* Marcadores de setas para vetores */}
          <marker
            id="arrow-vel"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#16a34a" />
          </marker>
          <marker
            id="arrow-acc"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
          </marker>
          <marker
            id="arrow-grav"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#7c3aed" />
          </marker>
          {/* Gradiente de fundo do laboratório */}
          <linearGradient id="labBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* Fundo do laboratório */}
        <rect width={svgWidth} height={svgHeight} fill="url(#labBg)" />

        {/* ============================================================== */}
        {/* MODO HORIZONTAL (MRU, MRUV, VELOCIDADE MÉDIA)                 */}
        {/* ============================================================== */}
        {mode === 'horizontal' && (
          <g>
            {/* Linha da Pista */}
            <line
              x1={padX}
              y1={160}
              x2={svgWidth - padX}
              y2={160}
              stroke="#475569"
              strokeWidth="4"
            />

            {/* Asfalto da pista */}
            <rect
              x={padX}
              y={162}
              width={trackWidth}
              height={14}
              fill="#94a3b8"
              opacity="0.3"
            />

            {/* Régua graduada */}
            {showRuler && (
              <g>
                <line
                  x1={padX}
                  y1={185}
                  x2={svgWidth - padX}
                  y2={185}
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
                {Array.from({ length: 11 }).map((_, idx) => {
                  const val = minPos + ((maxPos - minPos) * idx) / 10;
                  const x = posToX(val);
                  return (
                    <g key={idx}>
                      <line
                        x1={x}
                        y1={180}
                        x2={x}
                        y2={190}
                        stroke="#64748b"
                        strokeWidth={idx % 5 === 0 ? '2' : '1'}
                      />
                      {idx % 2 === 0 && (
                        <text
                          x={x}
                          y={205}
                          textAnchor="middle"
                          fontSize="11"
                          fontFamily="var(--font-mono)"
                          fill="#475569"
                          fontWeight="600"
                        >
                          {val.toFixed(0)}m
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            )}

            {/* Marcador da Origem (s = 0) */}
            {minPos <= 0 && maxPos >= 0 && (
              <g>
                <line
                  x1={posToX(0)}
                  y1={140}
                  x2={posToX(0)}
                  y2={175}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
                <text
                  x={posToX(0)}
                  y={134}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#ef4444"
                  fontWeight="bold"
                >
                  Origem (0m)
                </text>
              </g>
            )}

            {/* Carro / Móvel Principal */}
            {(() => {
              const carX = posToX(pos1);
              const carY = 138;
              return (
                <g transform={`translate(${carX}, ${carY})`}>
                  {/* Sombra */}
                  <ellipse cx="0" cy="20" rx="26" ry="4" fill="rgba(0,0,0,0.18)" />

                  {/* Corpo do Veículo */}
                  <rect
                    x="-24"
                    y="-4"
                    width="48"
                    height="18"
                    rx="6"
                    fill={color1}
                    stroke="#1e3a8a"
                    strokeWidth="1.5"
                  />
                  {/* Teto/Janela */}
                  <path
                    d="M -14 -4 L -8 -16 L 10 -16 L 16 -4 Z"
                    fill="#93c5fd"
                    stroke="#1e3a8a"
                    strokeWidth="1.5"
                  />
                  {/* Rodas */}
                  <circle cx="-14" cy="15" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                  <circle cx="14" cy="15" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />

                  {/* Rótulo de Posição */}
                  <rect
                    x="-32"
                    y="-38"
                    width="64"
                    height="18"
                    rx="4"
                    fill="rgba(255,255,255,0.92)"
                    stroke="#cbd5e1"
                  />
                  <text
                    x="0"
                    y="-25"
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                    fontWeight="700"
                    fill="#0f172a"
                  >
                    s = {formatNumber(pos1, 1)}m
                  </text>

                  {/* Vetor Velocidade (Verde) */}
                  {showVectors && Math.abs(vel1) > 0.05 && (
                    <g>
                      <line
                        x1="0"
                        y1="5"
                        x2={Math.max(-50, Math.min(50, vel1 * 3))}
                        y2="5"
                        stroke="#16a34a"
                        strokeWidth="3"
                        markerEnd="url(#arrow-vel)"
                      />
                      <text
                        x={Math.max(-50, Math.min(50, vel1 * 3))}
                        y="0"
                        fontSize="11"
                        fill="#16a34a"
                        fontWeight="bold"
                        textAnchor={vel1 >= 0 ? 'start' : 'end'}
                      >
                        v = {formatNumber(vel1, 1)}m/s
                      </text>
                    </g>
                  )}

                  {/* Vetor Aceleração (Vermelho) */}
                  {showVectors && Math.abs(acc1) > 0.05 && (
                    <g>
                      <line
                        x1="0"
                        y1="-4"
                        x2={Math.max(-45, Math.min(45, acc1 * 5))}
                        y2="-4"
                        stroke="#dc2626"
                        strokeWidth="2.5"
                        markerEnd="url(#arrow-acc)"
                      />
                      <text
                        x={Math.max(-45, Math.min(45, acc1 * 5))}
                        y="-10"
                        fontSize="10"
                        fill="#dc2626"
                        fontWeight="bold"
                        textAnchor={acc1 >= 0 ? 'start' : 'end'}
                      >
                        a = {formatNumber(acc1, 1)}m/s²
                      </text>
                    </g>
                  )}
                </g>
              );
            })()}
          </g>
        )}

        {/* ============================================================== */}
        {/* MODO RELATIVO (2 CARROS EM PISTAS PARALELAS)                   */}
        {/* ============================================================== */}
        {mode === 'relative' && (
          <g>
            {/* Pista 1 (Carro Azul - Faixa Superior) */}
            <line x1={padX} y1={95} x2={svgWidth - padX} y2={95} stroke="#64748b" strokeWidth="2" />
            <rect x={padX} y={96} width={trackWidth} height={8} fill="#94a3b8" opacity="0.2" />

            {/* Pista 2 (Carro Laranja - Faixa Inferior) */}
            <line x1={padX} y1={165} x2={svgWidth - padX} y2={165} stroke="#64748b" strokeWidth="2" />
            <rect x={padX} y={166} width={trackWidth} height={8} fill="#94a3b8" opacity="0.2" />

            {/* Régua Compartilhada */}
            {showRuler && (
              <g>
                <line x1={padX} y1={190} x2={svgWidth - padX} y2={190} stroke="#64748b" strokeWidth="1.5" />
                {Array.from({ length: 11 }).map((_, idx) => {
                  const val = minPos + ((maxPos - minPos) * idx) / 10;
                  const x = posToX(val);
                  return (
                    <g key={idx}>
                      <line x1={x} y1={185} x2={x} y2={195} stroke="#64748b" strokeWidth="1.5" />
                      <text x={x} y={210} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="#475569">
                        {val.toFixed(0)}m
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Linha conectora de distância relativa entre os dois */}
            <line
              x1={posToX(pos1)}
              y1={85}
              x2={posToX(pos2)}
              y2={155}
              stroke="#9333ea"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Carro 1 (Azul) */}
            {(() => {
              const x1 = posToX(pos1);
              return (
                <g transform={`translate(${x1}, 78)`}>
                  <rect x="-20" y="-4" width="40" height="15" rx="4" fill={color1} stroke="#1e3a8a" strokeWidth="1.5" />
                  <circle cx="-11" cy="11" r="4.5" fill="#1e293b" />
                  <circle cx="11" cy="11" r="4.5" fill="#1e293b" />
                  <text x="0" y="-12" textAnchor="middle" fontSize="11" fontWeight="bold" fill={color1}>
                    {label1}: {formatNumber(pos1, 1)}m
                  </text>
                  {showVectors && (
                    <line x1="0" y1="3" x2={Math.max(-40, Math.min(40, vel1 * 2.5))} y2="3" stroke="#16a34a" strokeWidth="2.5" markerEnd="url(#arrow-vel)" />
                  )}
                </g>
              );
            })()}

            {/* Carro 2 (Laranja) */}
            {(() => {
              const x2 = posToX(pos2);
              return (
                <g transform={`translate(${x2}, 148)`}>
                  <rect x="-20" y="-4" width="40" height="15" rx="4" fill={color2} stroke="#78350f" strokeWidth="1.5" />
                  <circle cx="-11" cy="11" r="4.5" fill="#1e293b" />
                  <circle cx="11" cy="11" r="4.5" fill="#1e293b" />
                  <text x="0" y="-12" textAnchor="middle" fontSize="11" fontWeight="bold" fill={color2}>
                    {label2}: {formatNumber(pos2, 1)}m
                  </text>
                  {showVectors && (
                    <line x1="0" y1="3" x2={Math.max(-40, Math.min(40, vel2 * 2.5))} y2="3" stroke="#16a34a" strokeWidth="2.5" markerEnd="url(#arrow-vel)" />
                  )}
                </g>
              );
            })()}
          </g>
        )}

        {/* ============================================================== */}
        {/* MODO VERTICAL (QUEDA LIVRE E LANÇAMENTO VERTICAL)               */}
        {/* ============================================================== */}
        {mode === 'vertical' && (
          <g>
            {/* Solo / Grama */}
            <rect
              x={0}
              y={svgHeight - padBottom}
              width={svgWidth}
              height={padBottom}
              fill="#15803d"
            />
            <line
              x1={0}
              y1={svgHeight - padBottom}
              x2={svgWidth}
              y2={svgHeight - padBottom}
              stroke="#166534"
              strokeWidth="2"
            />
            <text
              x={svgWidth / 2}
              y={svgHeight - 14}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#ffffff"
            >
              Solo de Referência (h = 0 m)
            </text>

            {/* Torre / Régua Vertical à esquerda */}
            <line
              x1={120}
              y1={padTop}
              x2={120}
              y2={svgHeight - padBottom}
              stroke="#64748b"
              strokeWidth="2"
            />
            {Array.from({ length: 6 }).map((_, idx) => {
              const val = minPos + ((maxPos - minPos) * idx) / 5;
              const y = posToY(val);
              return (
                <g key={idx}>
                  <line x1={112} y1={y} x2={128} y2={y} stroke="#64748b" strokeWidth="1.5" />
                  <text
                    x={104}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    fill="#475569"
                    fontWeight="600"
                  >
                    {val.toFixed(0)}m
                  </text>
                </g>
              );
            })}

            {/* Linha de Altura Máxima Atingida (se fornecida) */}
            {peakHeight !== null && (
              <g>
                <line
                  x1={120}
                  y1={posToY(peakHeight)}
                  x2={svgWidth - 100}
                  y2={posToY(peakHeight)}
                  stroke="#7c3aed"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={svgWidth - 90}
                  y={posToY(peakHeight) + 4}
                  fontSize="11"
                  fontWeight="bold"
                  fill="#7c3aed"
                >
                  h_max = {formatNumber(peakHeight, 1)}m
                </text>
              </g>
            )}

            {/* Partículas de Ar (quando resistência ativada) */}
            {airResistance && (
              <g opacity="0.4">
                {[180, 260, 340, 420, 500, 580].map((px, i) => (
                  <path
                    key={i}
                    d={`M ${px} 80 Q ${px + 10} 100 ${px} 120`}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="3 3"
                  />
                ))}
              </g>
            )}

            {/* Objeto em Queda / Subida (Esfera) */}
            {(() => {
              const ballX = 350;
              const ballY = posToY(pos1);
              return (
                <g transform={`translate(${ballX}, ${ballY})`}>
                  {/* Linha guia de altura */}
                  <line
                    x1={-230}
                    y1="0"
                    x2="300"
                    y2="0"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />

                  {/* Esfera */}
                  <circle
                    cx="0"
                    cy="0"
                    r="16"
                    fill={hasImpacted ? '#ef4444' : color1}
                    stroke="#1e3a8a"
                    strokeWidth="2"
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                  />

                  {/* Rótulo de Altura */}
                  <rect
                    x="24"
                    y="-12"
                    width="85"
                    height="24"
                    rx="4"
                    fill="rgba(255,255,255,0.95)"
                    stroke="#cbd5e1"
                  />
                  <text
                    x="66"
                    y="4"
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                    fontWeight="bold"
                    fill="#0f172a"
                  >
                    h = {formatNumber(pos1, 1)}m
                  </text>

                  {/* Vetor Velocidade (Verde) */}
                  {showVectors && Math.abs(vel1) > 0.05 && (
                    <g>
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2={Math.max(-60, Math.min(60, -vel1 * 2.5))} // y negativo na tela é para CIMA
                        stroke="#16a34a"
                        strokeWidth="3"
                        markerEnd="url(#arrow-vel)"
                      />
                      <text
                        x="-10"
                        y={Math.max(-50, Math.min(50, -vel1 * 2.5))}
                        textAnchor="end"
                        fontSize="11"
                        fill="#16a34a"
                        fontWeight="bold"
                      >
                        v = {formatNumber(vel1, 1)}m/s
                      </text>
                    </g>
                  )}

                  {/* Vetor Gravidade g (sempre para baixo) */}
                  {showVectors && (
                    <g transform="translate(130, -10)">
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="30"
                        stroke="#7c3aed"
                        strokeWidth="2.5"
                        markerEnd="url(#arrow-grav)"
                      />
                      <text
                        x="8"
                        y="20"
                        fontSize="10"
                        fill="#7c3aed"
                        fontWeight="bold"
                      >
                        g = 9,81 m/s²
                      </text>
                    </g>
                  )}
                </g>
              );
            })()}
          </g>
        )}
      </svg>
    </div>
  );
}
