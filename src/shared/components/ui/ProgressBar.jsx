import React from 'react';

function resolveColor(value, colorProp) {
  if (colorProp) return colorProp;
  if (value >= 70) return 'green';
  if (value >= 40) return 'amber';
  return 'red';
}

function buildClass(color, size) {
  const parts = ['pb'];
  if (color === 'amber') parts.push('pb-amber');
  if (color === 'red')   parts.push('pb-red');
  if (size === 'sm')     parts.push('sm');
  if (size === 'lg')     parts.push('lg');
  return parts.join(' ');
}

function ProgressBar({
  value,
  color,
  size = 'md',
  showLabel = false,
  className = '',
}) {
  const safeValue = Math.max(0, Math.min(100, value ?? 0));
  const resolvedColor = resolveColor(safeValue, color);
  const pbClass = [buildClass(resolvedColor, size), className].filter(Boolean).join(' ');

  return (
    <div
      style={{
        display: showLabel ? 'flex' : 'block',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div className={pbClass}>
        <div className="pb-fill" style={{ width: `${safeValue}%` }} />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: 11,
            color: 'var(--ink-3)',
            minWidth: 32,
            textAlign: 'right',
            flexShrink: 0,
          }}
        >
          {safeValue}%
        </span>
      )}
    </div>
  );
}

export { ProgressBar };
export default ProgressBar;
