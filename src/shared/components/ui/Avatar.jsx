export function Avatar({ user, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : '';
  const className = ['avatar', sizeClass].filter(Boolean).join(' ');

  if (!user) {
    return (
      <div
        className={className}
        style={{ background: 'var(--ink-4)', color: '#fff' }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{ background: user.color, color: '#fff' }}
    >
      {(user.initials || '').slice(0, 2)}
    </div>
  );
}

export default Avatar;
