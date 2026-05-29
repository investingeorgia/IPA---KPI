import React from 'react';

function Card({
  title,
  children,
  actions,
  soft = false,
  className = '',
  style,
  onClick,
}) {
  const baseClass = soft ? 'card-soft' : 'card';
  const hasHeader = Boolean(title || actions);

  return (
    <div
      className={[baseClass, className].filter(Boolean).join(' ')}
      style={{ cursor: onClick ? 'pointer' : undefined, ...style }}
      onClick={onClick}
    >
      {hasHeader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          {title && (
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              {title}
            </div>
          )}
          {!title && <div />}
          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export { Card };
export default Card;
