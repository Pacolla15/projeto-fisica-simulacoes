/**
 * Módulo de Cinemática - Cálculos físicos fundamentais
 * Padrão: Sistema Internacional (SI)
 */

import { EPSILON, findLargestPositiveRoot } from './validation.js';

export const STANDARD_GRAVITY = 9.81; // m/s²

// ==========================================
// MÓDULO 1: VELOCIDADE MÉDIA
// ==========================================
/**
 * Calcula a velocidade média v_m = Δs / Δt
 * @param {number} s0 Posição inicial (m)
 * @param {number} sf Posição final (m)
 * @param {number} dt Intervalo de tempo (s)
 */
export function calculateAverageVelocity(s0, sf, dt) {
  if (dt <= EPSILON) {
    return {
      deltaS: sf - s0,
      deltaT: dt,
      averageVelocity: 0,
      distanceTraveled: Math.abs(sf - s0),
      isValid: false,
      error: 'O intervalo de tempo deve ser estritamente maior que zero.'
    };
  }
  const deltaS = sf - s0;
  const averageVelocity = deltaS / dt;
  // Em trajetória retilínea univariada sem inversão de sentido, a distância percorrida é |Δs|
  const distanceTraveled = Math.abs(deltaS);

  return {
    deltaS,
    deltaT: dt,
    averageVelocity,
    distanceTraveled,
    isValid: true,
    error: null
  };
}

/**
 * Posição no instante t para velocidade média constante
 */
export function getAverageVelocityStateAt(s0, sf, totalDuration, currentTime) {
  const t = Math.max(0, Math.min(currentTime, totalDuration));
  const progress = totalDuration > 0 ? t / totalDuration : 0;
  const currentPos = s0 + (sf - s0) * progress;
  const vm = totalDuration > 0 ? (sf - s0) / totalDuration : 0;
  return {
    time: t,
    position: currentPos,
    velocity: vm,
    displacementSoFar: currentPos - s0,
    distanceSoFar: Math.abs(currentPos - s0),
    isFinished: currentTime >= totalDuration
  };
}

// ==========================================
// MÓDULO 2: MOVIMENTO RETILÍNEO UNIFORME (MRU)
// ==========================================
/**
 * Posição em função do tempo no MRU: s(t) = s0 + v * t
 * @param {number} s0 Posição inicial (m)
 * @param {number} v Velocidade constante (m/s)
 * @param {number} t Instante de tempo (s)
 */
export function calculateMRU(s0, v, t) {
  const pos = s0 + v * t;
  const deltaS = pos - s0;
  return {
    time: t,
    position: pos,
    velocity: v,
    acceleration: 0,
    deltaS,
    distance: Math.abs(deltaS)
  };
}

// ==========================================
// MÓDULO 3: MOVIMENTO RETILÍNEO UNIFORMEMENTE VARIADO (MRUV)
// ==========================================
/**
 * Cálculos do MRUV:
 * v(t) = v0 + a * t
 * s(t) = s0 + v0 * t + 0.5 * a * t²
 * Torricelli: v² = v0² + 2 * a * Δs
 * @param {number} s0 Posição inicial (m)
 * @param {number} v0 Velocidade inicial (m/s)
 * @param {number} a Aceleração constante (m/s²)
 * @param {number} t Instante de tempo (s)
 */
export function calculateMRUV(s0, v0, a, t) {
  const currentV = v0 + a * t;
  const deltaS = v0 * t + 0.5 * a * t * t;
  const currentPos = s0 + deltaS;

  // Distância total percorrida (se houver inversão de movimento quando v(t) cruza zero)
  let totalDistance = Math.abs(deltaS);
  if (a !== 0) {
    const tStop = -v0 / a;
    if (tStop > 0 && tStop < t) {
      // Houve inversão no instante tStop
      const posAtStop = s0 + v0 * tStop + 0.5 * a * tStop * tStop;
      const d1 = Math.abs(posAtStop - s0);
      const d2 = Math.abs(currentPos - posAtStop);
      totalDistance = d1 + d2;
    }
  }

  // Torricelli: v² = v0² + 2 * a * Δs
  const torricelliVSquared = v0 * v0 + 2 * a * deltaS;

  return {
    time: t,
    position: currentPos,
    velocity: currentV,
    acceleration: a,
    deltaS,
    distance: totalDistance,
    torricelliVSquared: Math.max(0, torricelliVSquared),
    torricelliSpeed: Math.sqrt(Math.max(0, torricelliVSquared))
  };
}

// ==========================================
// MÓDULO 4: QUEDA LIVRE
// ==========================================
/**
 * Simula queda vertical de altura h0.
 * Convenção padrão: Eixo vertical positivo para CIMA.
 * Solo em y = 0.
 * Aceleração da gravidade atua para baixo: a = -g.
 * v(t) = v0 - g * t
 * h(t) = h0 + v0 * t - 0.5 * g * t²
 *
 * Se airResistance for true, usamos integração numérica passo-a-passo:
 * dv/dt = -g - (k/m) * v * |v|
 * dh/dt = v
 */
export function calculateFreeFall(h0, v0 = 0, t = 0, g = STANDARD_GRAVITY, airResistance = false, kDrag = 0.08, mass = 1.0) {
  const safeH0 = Math.max(0, h0);

  // Caso ideal (sem resistência do ar)
  if (!airResistance) {
    // Instante do impacto: 0 = h0 + v0*t - 0.5*g*t² => 0.5*g*t² - v0*t - h0 = 0
    // a_quad = 0.5 * g, b_quad = -v0, c_quad = -h0
    const impactTime = findLargestPositiveRoot(0.5 * g, -v0, -safeH0) ?? 0;

    const clampedT = Math.min(t, impactTime);
    const hasImpacted = t >= impactTime && impactTime > 0;

    const currentH = hasImpacted ? 0 : Math.max(0, safeH0 + v0 * clampedT - 0.5 * g * clampedT * clampedT);
    const currentV = hasImpacted ? -(v0 * v0 + 2 * g * safeH0 > 0 ? Math.sqrt(v0 * v0 + 2 * g * safeH0) : 0) : v0 - g * clampedT;
    const fallDistance = safeH0 - currentH;

    return {
      time: clampedT,
      height: currentH,
      velocity: currentV,
      speed: Math.abs(currentV),
      acceleration: hasImpacted ? 0 : -g,
      fallDistance,
      impactTime,
      impactVelocity: -Math.sqrt(Math.max(0, v0 * v0 + 2 * g * safeH0)),
      hasImpacted,
      isAirResistant: false
    };
  }

  // Com resistência do ar (modelo numérico RK2 / Euler com dt pequeno)
  const dtStep = 0.005;
  let curT = 0;
  let curH = safeH0;
  let curV = v0;
  let curA = -g;
  let impactTime = 0;

  const stepsLimit = 10000;
  let step = 0;

  while (curH > 0 && curT < t && step < stepsLimit) {
    step++;
    const dragAcc = -(kDrag / mass) * curV * Math.abs(curV);
    curA = -g + dragAcc;

    curV += curA * dtStep;
    curH += curV * dtStep;
    curT += dtStep;

    if (curH <= 0) {
      curH = 0;
      impactTime = curT;
      break;
    }
  }

  if (curH <= 0 && impactTime === 0) {
    impactTime = curT;
  }

  const hasImpacted = curH <= 0;
  // Velocidade terminal teórica para queda para baixo (v < 0): |v_term| = sqrt(m * g / k)
  const terminalSpeed = Math.sqrt((mass * g) / kDrag);

  return {
    time: curT,
    height: Math.max(0, curH),
    velocity: curV,
    speed: Math.abs(curV),
    acceleration: hasImpacted ? 0 : curA,
    fallDistance: safeH0 - Math.max(0, curH),
    impactTime: impactTime || curT,
    impactVelocity: curV,
    hasImpacted,
    isAirResistant: true,
    terminalSpeed
  };
}

// ==========================================
// MÓDULO 5: LANÇAMENTO VERTICAL
// ==========================================
/**
 * Lançamento vertical para cima a partir de h0 com velocidade inicial v0 > 0.
 * Referencial positivo para cima.
 * v(t) = v0 - g * t
 * h(t) = h0 + v0 * t - 0.5 * g * t²
 * Altura máxima: h_max = h0 + v0² / (2*g)
 * Tempo de subida ao ápice: t_pico = v0 / g
 */
export function calculateVerticalLaunch(h0, v0, t, g = STANDARD_GRAVITY) {
  const safeH0 = Math.max(0, h0);
  const safeV0 = Math.max(0, v0);

  const tPeak = g > 0 ? safeV0 / g : 0;
  const maxDeltaH = g > 0 ? (safeV0 * safeV0) / (2 * g) : 0;
  const maxHeight = safeH0 + maxDeltaH;

  // Tempo total de voo até o solo h = 0: 0.5 * g * t² - v0 * t - h0 = 0
  const totalFlightTime = findLargestPositiveRoot(0.5 * g, -safeV0, -safeH0) ?? (2 * tPeak);

  const clampedT = Math.min(t, totalFlightTime);
  const hasLanded = t >= totalFlightTime && totalFlightTime > 0;

  let currentH = 0;
  let currentV = 0;
  let currentA = -g;

  if (hasLanded) {
    currentH = 0;
    currentV = 0;
    currentA = 0;
  } else {
    currentH = Math.max(0, safeH0 + safeV0 * clampedT - 0.5 * g * clampedT * clampedT);
    currentV = safeV0 - g * clampedT;
    // No pico exato
    if (Math.abs(clampedT - tPeak) < 1e-4) {
      currentV = 0;
    }
  }

  const isGoingUp = !hasLanded && clampedT < tPeak;
  const isAtPeak = !hasLanded && Math.abs(clampedT - tPeak) < 1e-4;
  const isGoingDown = !hasLanded && clampedT > tPeak;

  return {
    time: clampedT,
    height: currentH,
    velocity: currentV,
    speed: Math.abs(currentV),
    acceleration: currentA,
    initialHeight: safeH0,
    initialVelocity: safeV0,
    peakTime: tPeak,
    maxHeight,
    maxDeltaH,
    totalFlightTime,
    hasLanded,
    isGoingUp,
    isAtPeak,
    isGoingDown
  };
}

// ==========================================
// MÓDULO 6: MOVIMENTO RELATIVO E ENCONTRO DE OBJETOS
// ==========================================
/**
 * Encontro de dois móveis em MRU:
 * s1(t) = s1_0 + v1 * t
 * s2(t) = s2_0 + v2 * t
 * Condição de encontro: s1(t) = s2(t) => (v1 - v2) * t = s2_0 - s1_0
 * t_enc = (s2_0 - s1_0) / (v1 - v2)
 */
export function calculateRelativeMotion(s1_0, v1, s2_0, v2, maxDuration = 20) {
  const deltaV = v1 - v2;
  const deltaS0 = s2_0 - s1_0;

  let meetingTime = null;
  let meetingPosition = null;
  let willMeet = false;
  let meetingStatus = 'no_meeting';
  let statusMessage = '';

  if (Math.abs(deltaV) < EPSILON) {
    // Mesma velocidade
    if (Math.abs(deltaS0) < EPSILON) {
      // Começaram no mesmo ponto
      meetingTime = 0;
      meetingPosition = s1_0;
      willMeet = true;
      meetingStatus = 'always_together';
      statusMessage = 'Os dois móveis possuem a mesma posição inicial e a mesma velocidade; portanto, permanecem juntos durante todo o percurso.';
    } else {
      willMeet = false;
      meetingStatus = 'parallel';
      statusMessage = 'Com velocidades rigorosamente iguais e posições iniciais distintas, os móveis mantêm distância constante e nunca se encontrarão.';
    }
  } else {
    const rawT = deltaS0 / deltaV;
    if (rawT < -EPSILON) {
      willMeet = false;
      meetingStatus = 'past';
      statusMessage = `O encontro teria ocorrido no passado (t = ${rawT.toFixed(2)} s), mas considerando t ≥ 0 eles estão se afastando e não haverá encontro futuro.`;
    } else {
      meetingTime = Math.max(0, rawT);
      meetingPosition = s1_0 + v1 * meetingTime;
      willMeet = true;
      if (meetingTime <= maxDuration) {
        meetingStatus = 'in_range';
        statusMessage = `Haverá encontro no instante t = ${meetingTime.toFixed(2)} s na posição s = ${meetingPosition.toFixed(2)} m.`;
      } else {
        meetingStatus = 'beyond_range';
        statusMessage = `O encontro ocorrerá no instante t = ${meetingTime.toFixed(2)} s (posição s = ${meetingPosition.toFixed(2)} m), além da duração máxima visível da simulação (${maxDuration} s).`;
      }
    }
  }

  return {
    s1_0,
    v1,
    s2_0,
    v2,
    meetingTime,
    meetingPosition,
    willMeet,
    meetingStatus,
    statusMessage,
    relativeVelocity: v1 - v2
  };
}

/**
 * Posições e velocidades de ambos os móveis no instante t
 */
export function getRelativeMotionStateAt(s1_0, v1, s2_0, v2, t) {
  const s1 = s1_0 + v1 * t;
  const s2 = s2_0 + v2 * t;
  const distanceBetween = Math.abs(s1 - s2);
  return {
    time: t,
    pos1: s1,
    vel1: v1,
    pos2: s2,
    vel2: v2,
    distanceBetween
  };
}

// ==========================================
// GERADORES DE SÉRIES TEMPORAIS PARA GRÁFICOS
// ==========================================
/**
 * Gera série de pontos temporais para gráficos com precisão e resolução
 */
export function generateTimeSeries(generatorFn, maxTime, stepCount = 50) {
  const points = [];
  const dt = maxTime / Math.max(1, stepCount);
  for (let i = 0; i <= stepCount; i++) {
    const t = Number((i * dt).toFixed(3));
    points.push(generatorFn(t));
  }
  return points;
}
