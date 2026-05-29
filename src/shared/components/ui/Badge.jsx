import React from 'react';

const classMap = {
  green:  'badge badge-green',
  yellow: 'badge badge-amber',
  red:    'badge badge-red',
  gray:   'badge badge-gray',
  blue:   'badge',
};

const blueStyle = {
  background: '#DEE2F0',
  color: '#2D3E7A',
};

function Badge({
  label,
  color = 'gray',
  dot = false,
  className = '',
  style,
}) {
  const baseClass = classMap[color] ?? 'badge badge-gray';
  const colorStyle = color === 'blue' ? blueStyle : {};

  return (
    <span
      className={[baseClass, className].filter(Boolean).join(' ')}
      style={{ ...colorStyle, ...style }}
    >
      {dot && <span className="badge-dot" />}
      {label}
    </span>
  );
}

export { Badge };
export default Badge;
