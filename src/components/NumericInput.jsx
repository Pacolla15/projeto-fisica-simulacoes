import React from 'react';

/**
 * Controle de entrada duplo: Slider deslizante e Caixa de texto numérica sincronizados
 */
export default function NumericInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  disabled = false,
  description
}) {
  const handleInputChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!Number.isNaN(val)) {
      onChange(Math.min(Math.max(val, min), max));
    }
  };

  const handleSliderChange = (e) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="numeric-input-group">
      <div className="numeric-label-row">
        <label className="numeric-label">
          {label}
        </label>
        <div className="numeric-box-wrap">
          <input
            type="number"
            className="numeric-box"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
          {unit && <span className="numeric-unit-tag">{unit}</span>}
        </div>
      </div>

      <input
        type="range"
        className="numeric-slider"
        value={value}
        onChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />

      <div className="slider-limits">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>

      {description && (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.2rem' }}>
          {description}
        </div>
      )}
    </div>
  );
}
