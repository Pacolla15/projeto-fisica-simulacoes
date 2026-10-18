import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Info } from 'lucide-react';

/**
 * Gráfico científico responsivo com indicador do instante atual
 */
export default function PhysicsChart({
  title,
  data = [],
  lines = [
    { key: 'val', name: 'Valor', color: '#2563eb', unit: '' }
  ],
  xAxisKey = 'time',
  xAxisLabel = 'Tempo t (s)',
  yAxisLabel = '',
  currentTime = null,
  slopeMeaning = null,
  areaMeaning = null,
  height = 240
}) {
  return (
    <div className="chart-container-card">
      <div className="chart-header-row">
        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-main)' }}>
          {title}
        </h4>
        {yAxisLabel && (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: '600' }}>
            Eixo vertical: {yAxisLabel}
          </span>
        )}
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 25, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={xAxisKey}
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(val, name) => [`${Number(val).toFixed(2)}`, name]}
              labelFormatter={(lbl) => `t = ${Number(lbl).toFixed(2)} s`}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, borderColor: '#cbd5e1', fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />}

            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            ))}

            {currentTime !== null && (
              <ReferenceLine
                x={Number(currentTime.toFixed(2))}
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{ value: `t = ${currentTime.toFixed(1)}s`, fill: '#dc2626', fontSize: 11, position: 'top' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {(slopeMeaning || areaMeaning) && (
        <div className="chart-explanation-box">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.825rem' }}>
            <Info size={16} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              {slopeMeaning && (
                <div>
                  <strong>Propriedade da Inclinação:</strong> {slopeMeaning}
                </div>
              )}
              {areaMeaning && (
                <div style={{ marginTop: '0.25rem' }}>
                  <strong>Propriedade da Área:</strong> {areaMeaning}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
