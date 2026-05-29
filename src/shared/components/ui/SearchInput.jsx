import React from 'react';
import Icon from '@shared/components/ui/Icon';

function SearchInput({
  value,
  onChange,
  placeholder,
  className = '',
  style,
}) {
  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
    >
      <span
        style={{
          position: 'absolute',
          left: 10,
          color: 'var(--ink-3)',
          display: 'flex',
          pointerEvents: 'none',
        }}
      >
        <Icon name="search" className="icon icon-sm" />
      </span>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: 32,
          paddingRight: value ? 32 : 12,
          ...style,
        }}
      />
      {value && (
        <button
          className="btn-icon"
          style={{ position: 'absolute', right: 6, padding: 4 }}
          onClick={() => onChange('')}
          aria-label="Clear search"
          type="button"
        >
          <Icon name="x" className="icon icon-sm" />
        </button>
      )}
    </div>
  );
}

export { SearchInput };
export default SearchInput;
