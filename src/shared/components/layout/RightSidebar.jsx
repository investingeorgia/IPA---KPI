import Icon from '@shared/components/ui/Icon';

export default function RightSidebar({ title, children, onClose }) {
  return (
    <div
      style={{
        width: 360,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderLeft: '1px solid var(--line)',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--line)',
          flex: '0 0 auto',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
          {title}
        </span>
        <button className="btn-icon" onClick={onClose} aria-label="Close">
          <Icon name="x" />
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
}
