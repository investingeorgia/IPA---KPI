import React from 'react';

const sizeStyles = {
  sm: { padding: '6px 12px', fontSize: '12px' },
  md: {},
  lg: { padding: '11px 20px', fontSize: '14px' },
};

const Spinner = () => (
  <span
    style={{
      display: 'inline-block',
      width: 12,
      height: 12,
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'btn-spin 0.6s linear infinite',
      flexShrink: 0,
    }}
    aria-hidden="true"
  />
);

// Inject spin keyframes once
if (typeof document !== 'undefined') {
  const STYLE_ID = '__btn-spin-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '@keyframes btn-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
}

function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon,
  type = 'button',
  className = '',
  children,
  style,
}) {
  const baseClass = (() => {
    switch (variant) {
      case 'primary':   return 'btn btn-primary';
      case 'secondary': return 'btn btn-ghost';
      case 'ghost':     return 'btn btn-ghost';
      case 'danger':    return 'btn';
      default:          return 'btn btn-primary';
    }
  })();

  const dangerStyle = variant === 'danger'
    ? { background: 'var(--danger)', color: '#fff' }
    : {};

  const computedStyle = {
    ...dangerStyle,
    ...sizeStyles[size],
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    ...style,
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={[baseClass, className].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={isDisabled}
      style={computedStyle}
      aria-busy={loading || undefined}
    >
      {loading && <Spinner />}
      {!loading && icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
}

export { Button };
export default Button;
