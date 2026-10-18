/**
 * Sistema Internacional de Unidades (SI) e conversores para Física - Cinemática
 */

export const UNITS = {
  POSITION: {
    symbol: 'm',
    name: 'metro',
    quantity: 'Posição / Deslocamento / Altura'
  },
  TIME: {
    symbol: 's',
    name: 'segundo',
    quantity: 'Intervalo de tempo'
  },
  VELOCITY: {
    symbol: 'm/s',
    name: 'metro por segundo',
    quantity: 'Velocidade',
    altSymbol: 'km/h',
    toAlt: (ms) => ms * 3.6,
    fromAlt: (kmh) => kmh / 3.6
  },
  ACCELERATION: {
    symbol: 'm/s²',
    name: 'metro por segundo ao quadrado',
    quantity: 'Aceleração'
  }
};

/**
 * Formata um valor numérico para exibição científica legível
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  if (!Number.isFinite(value)) {
    return value > 0 ? '+∞' : '-∞';
  }
  // Tolerância para números muito próximos de zero
  if (Math.abs(value) < 1e-6) {
    return (0).toFixed(decimals);
  }
  return Number(value).toFixed(decimals);
}

/**
 * Formata grandeza física com valor e unidade
 * @param {number} value
 * @param {string} unit
 * @param {number} decimals
 * @returns {string}
 */
export function formatQuantity(value, unit, decimals = 2) {
  return `${formatNumber(value, decimals)} ${unit}`;
}
