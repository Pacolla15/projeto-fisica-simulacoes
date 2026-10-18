/**
 * Validação de entradas e regras físicas para Cinemática
 */

export const EPSILON = 1e-7;

/**
 * Converte e valida um número de entrada
 * @param {any} val
 * @param {number} fallback
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function sanitizeNumber(val, fallback = 0, min = -Infinity, max = Infinity) {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return fallback;
  }
  return Math.min(Math.max(num, min), max);
}

/**
 * Resolve equação de 2º grau: a * x² + b * x + c = 0
 * Retorna todas as raízes reais encontradas
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {number[]}
 */
export function solveQuadratic(a, b, c) {
  if (Math.abs(a) < EPSILON) {
    // Equação linear: b * x + c = 0 => x = -c / b
    if (Math.abs(b) < EPSILON) {
      return []; // Sem raiz ou infinitas
    }
    return [-c / b];
  }

  const delta = b * b - 4 * a * c;
  if (delta < -EPSILON) {
    return []; // Raízes complexas não têm significado físico de tempo real aqui
  }

  if (Math.abs(delta) < EPSILON) {
    return [-b / (2 * a)];
  }

  const sqrtDelta = Math.sqrt(Math.max(0, delta));
  const r1 = (-b + sqrtDelta) / (2 * a);
  const r2 = (-b - sqrtDelta) / (2 * a);
  return [r1, r2].sort((x, y) => x - y);
}

/**
 * Retorna a menor raiz não-negativa (ex: instante futuro de impacto t >= 0)
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {number | null}
 */
export function findSmallestPositiveRoot(a, b, c) {
  const roots = solveQuadratic(a, b, c);
  const positiveRoots = roots.filter(r => r >= -EPSILON).map(r => (Math.abs(r) < EPSILON ? 0 : r));
  if (positiveRoots.length === 0) return null;
  return Math.min(...positiveRoots);
}

/**
 * Retorna a maior raiz positiva (ex: instante final em que o projétil atinge o solo)
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {number | null}
 */
export function findLargestPositiveRoot(a, b, c) {
  const roots = solveQuadratic(a, b, c);
  const positiveRoots = roots.filter(r => r >= -EPSILON).map(r => (Math.abs(r) < EPSILON ? 0 : r));
  if (positiveRoots.length === 0) return null;
  return Math.max(...positiveRoots);
}
