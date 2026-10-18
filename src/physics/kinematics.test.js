import { describe, it, expect } from 'vitest';
import {
  calculateAverageVelocity,
  calculateMRU,
  calculateMRUV,
  calculateFreeFall,
  calculateVerticalLaunch,
  calculateRelativeMotion,
  STANDARD_GRAVITY
} from './kinematics.js';

describe('Cálculos Cinemáticos - Validação Científica', () => {
  describe('Módulo 1: Velocidade Média', () => {
    it('deve calcular corretamente a velocidade média para s0 = 0 m, sf = 100 m e dt = 10 s', () => {
      const res = calculateAverageVelocity(0, 100, 10);
      expect(res.isValid).toBe(true);
      expect(res.deltaS).toBe(100);
      expect(res.deltaT).toBe(10);
      expect(res.averageVelocity).toBe(10);
      expect(res.distanceTraveled).toBe(100);
    });

    it('deve calcular velocidade média negativa quando sf < s0', () => {
      const res = calculateAverageVelocity(80, 20, 6);
      expect(res.deltaS).toBe(-60);
      expect(res.averageVelocity).toBe(-10);
      expect(res.distanceTraveled).toBe(60);
    });

    it('deve rejeitar divisão por zero quando dt <= 0', () => {
      const res = calculateAverageVelocity(0, 100, 0);
      expect(res.isValid).toBe(false);
      expect(res.averageVelocity).toBe(0);
      expect(res.error).toBeDefined();
    });
  });

  describe('Módulo 2: Movimento Retilíneo Uniforme (MRU)', () => {
    it('com posição inicial de 0 m e velocidade de 10 m/s, após 5 s a posição deve ser 50 m', () => {
      const res = calculateMRU(0, 10, 5);
      expect(res.position).toBe(50);
      expect(res.velocity).toBe(10);
      expect(res.deltaS).toBe(50);
      expect(res.acceleration).toBe(0);
    });

    it('com posição inicial de 20 m e velocidade negativa de -4 m/s após 3 s', () => {
      const res = calculateMRU(20, -4, 3);
      expect(res.position).toBe(8);
      expect(res.deltaS).toBe(-12);
      expect(res.distance).toBe(12);
    });
  });

  describe('Módulo 3: Movimento Retilíneo Uniformemente Variado (MRUV)', () => {
    it('com velocidade inicial de 0 m/s e aceleração de 2 m/s², após 5 s a velocidade deve ser 10 m/s e o deslocamento deve ser 25 m', () => {
      const res = calculateMRUV(0, 0, 2, 5);
      expect(res.velocity).toBe(10);
      expect(res.deltaS).toBe(25);
      expect(res.position).toBe(25);
    });

    it('deve satisfazer a equação de Torricelli v² = v0² + 2*a*Δs', () => {
      const s0 = 10;
      const v0 = 5;
      const a = 3;
      const t = 4;
      const res = calculateMRUV(s0, v0, a, t);
      // v(4) = 5 + 3*4 = 17 m/s
      // v² = 289
      // v0² + 2*a*Δs = 25 + 2*3*(5*4 + 0.5*3*16) = 25 + 6*(20 + 24) = 25 + 264 = 289
      expect(res.velocity).toBe(17);
      expect(res.torricelliVSquared).toBe(289);
      expect(res.torricelliSpeed).toBeCloseTo(17, 5);
    });
  });

  describe('Módulo 4: Queda Livre', () => {
    it('a partir do repouso, sem resistência do ar, após 2 s a distância de queda deve ser aproximadamente 19,62 m', () => {
      // h(2) = h0 - 0.5 * 9.81 * 4 = h0 - 19.62
      // Distância de queda = 19.62 m
      const h0 = 100;
      const v0 = 0;
      const t = 2;
      const res = calculateFreeFall(h0, v0, t, 9.81, false);
      expect(res.fallDistance).toBeCloseTo(19.62, 2);
      expect(res.velocity).toBeCloseTo(-19.62, 2);
      expect(res.height).toBeCloseTo(100 - 19.62, 2);
    });

    it('deve identificar o impacto com o solo e zerar a altura', () => {
      const h0 = 20;
      // t_impact = sqrt(2*20 / 9.81) = sqrt(4.077) ≈ 2.019 s
      const res = calculateFreeFall(h0, 0, 5, 9.81, false);
      expect(res.hasImpacted).toBe(true);
      expect(res.height).toBe(0);
      expect(res.fallDistance).toBeCloseTo(20, 2);
    });
  });

  describe('Módulo 5: Lançamento Vertical', () => {
    it('no instante de altura máxima, a velocidade vertical deve ser zero, com aceleração atuando', () => {
      const h0 = 0;
      const v0 = 29.43; // 3 * 9.81 m/s => t_pico = 3.0 s
      const res = calculateVerticalLaunch(h0, v0, 3.0, 9.81);
      expect(res.peakTime).toBeCloseTo(3.0, 2);
      expect(res.velocity).toBeCloseTo(0, 4);
      expect(res.acceleration).toBeCloseTo(-9.81, 2);
      expect(res.isAtPeak).toBe(true);
      // Altura máxima = 0 + (29.43)^2 / (2 * 9.81) = 44.145 m
      expect(res.maxHeight).toBeCloseTo(44.145, 2);
    });
  });

  describe('Módulo 6: Movimento Relativo e Encontro de Objetos', () => {
    it('dois objetos com a mesma posição inicial devem ter um encontro em t = 0', () => {
      const res = calculateRelativeMotion(20, 5, 20, 10);
      expect(res.willMeet).toBe(true);
      expect(res.meetingTime).toBeCloseTo(0, 5);
      expect(res.meetingPosition).toBeCloseTo(20, 5);
    });

    it('se tiverem velocidades iguais e posições iniciais diferentes, não deverão se encontrar sob MRU', () => {
      const res = calculateRelativeMotion(0, 15, 50, 15);
      expect(res.willMeet).toBe(false);
      expect(res.meetingTime).toBeNull();
      expect(res.meetingStatus).toBe('parallel');
    });

    it('dois objetos em sentidos opostos se encontrando no tempo correto', () => {
      // Objeto 1: s1_0 = 0, v1 = 20 m/s
      // Objeto 2: s2_0 = 100, v2 = -30 m/s
      // Encontro: (20 - (-30)) * t = 100 => 50 t = 100 => t = 2 s
      // Posição: 40 m
      const res = calculateRelativeMotion(0, 20, 100, -30);
      expect(res.willMeet).toBe(true);
      expect(res.meetingTime).toBeCloseTo(2.0, 4);
      expect(res.meetingPosition).toBeCloseTo(40.0, 4);
      expect(res.meetingStatus).toBe('in_range');
    });
  });
});
