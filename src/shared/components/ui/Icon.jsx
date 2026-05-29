export default function Icon({ name, className = 'icon' }) {
  const shared = {
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const renderPaths = () => {
    switch (name) {
      case 'grid':
        return (
          <>
            <rect x="1" y="1" width="6" height="6" {...shared} />
            <rect x="9" y="1" width="6" height="6" {...shared} />
            <rect x="1" y="9" width="6" height="6" {...shared} />
            <rect x="9" y="9" width="6" height="6" {...shared} />
          </>
        );

      case 'target':
        return (
          <>
            <circle cx="8" cy="8" r="6" {...shared} />
            <circle cx="8" cy="8" r="2" {...shared} />
            <line x1="8" y1="2" x2="8" y2="1" {...shared} />
            <line x1="8" y1="14" x2="8" y2="15" {...shared} />
            <line x1="2" y1="8" x2="1" y2="8" {...shared} />
            <line x1="14" y1="8" x2="15" y2="8" {...shared} />
          </>
        );

      case 'list':
        return (
          <>
            <line x1="1" y1="4" x2="15" y2="4" {...shared} />
            <line x1="1" y1="8" x2="15" y2="8" {...shared} />
            <line x1="1" y1="12" x2="15" y2="12" {...shared} />
          </>
        );

      case 'users':
        return (
          <>
            <circle cx="6" cy="5" r="3" {...shared} />
            <path d="M1,14 C1,11 3,9.5 6,9.5 S11,11 11,14" {...shared} />
            <circle cx="11" cy="5" r="2" {...shared} />
            <path d="M11,10 c2,0 4,1 4,3.5" {...shared} />
          </>
        );

      case 'db':
        return (
          <>
            <ellipse cx="8" cy="3" rx="6" ry="2" {...shared} />
            <line x1="2" y1="3" x2="2" y2="13" {...shared} />
            <line x1="14" y1="3" x2="14" y2="13" {...shared} />
            <path d="M2,8 Q8,10 14,8" {...shared} />
            <ellipse cx="8" cy="13" rx="6" ry="2" {...shared} />
          </>
        );

      case 'doc':
        return (
          <>
            <rect x="2" y="1" width="12" height="14" rx="2" {...shared} />
            <line x1="5" y1="5" x2="11" y2="5" {...shared} />
            <line x1="5" y1="8" x2="11" y2="8" {...shared} />
            <line x1="5" y1="11" x2="9" y2="11" {...shared} />
          </>
        );

      case 'bolt':
        return (
          <path d="M10,1 L4,9 L8,9 L6,15 L12,7 L8,7 Z" {...shared} />
        );

      case 'bell':
        return (
          <>
            <path d="M3,10 C3,6.7 5,4 8,4 S13,6.7 13,10 L14,12 H2 L3,10 Z" {...shared} />
            <path d="M6.5,12 Q6.5,14 8,14 Q9.5,14 9.5,12" {...shared} />
          </>
        );

      case 'search':
        return (
          <>
            <circle cx="7" cy="7" r="4.5" {...shared} />
            <line x1="10.5" y1="10.5" x2="14" y2="14" {...shared} />
          </>
        );

      case 'chevDown':
        return (
          <path d="M4,6 L8,10 L12,6" {...shared} />
        );

      case 'chevRight':
        return (
          <path d="M6,4 L10,8 L6,12" {...shared} />
        );

      case 'chevLeft':
        return (
          <path d="M10,4 L6,8 L10,12" {...shared} />
        );

      case 'logout':
        return (
          <>
            <path d="M10,8 H2" {...shared} />
            <path d="M5,5 L2,8 L5,11" {...shared} />
            <path d="M7,3 h5 a1,1 0 0,1 1,1 v8 a1,1 0 0,1 -1,1 H7" {...shared} />
          </>
        );

      case 'plus':
        return (
          <>
            <line x1="8" y1="2" x2="8" y2="14" {...shared} />
            <line x1="2" y1="8" x2="14" y2="8" {...shared} />
          </>
        );

      case 'check':
        return (
          <path d="M3,8 L6.5,12 L13,5" {...shared} />
        );

      case 'x':
        return (
          <>
            <line x1="3" y1="3" x2="13" y2="13" {...shared} />
            <line x1="13" y1="3" x2="3" y2="13" {...shared} />
          </>
        );

      case 'edit':
        return (
          <>
            <path d="M11,2 L14,5 L5,14 H2 V11 Z" {...shared} />
            <line x1="9" y1="4" x2="12" y2="7" {...shared} />
          </>
        );

      case 'trash':
        return (
          <>
            <line x1="1" y1="5" x2="15" y2="5" {...shared} />
            <rect x="3" y="5" width="10" height="9" rx="1" {...shared} />
            <path d="M6,5 V3 h4 v2" {...shared} />
            <line x1="6" y1="8" x2="6" y2="12" {...shared} />
            <line x1="10" y1="8" x2="10" y2="12" {...shared} />
          </>
        );

      case 'arrowRight':
        return (
          <>
            <line x1="2" y1="8" x2="14" y2="8" {...shared} />
            <path d="M10,4 L14,8 L10,12" {...shared} />
          </>
        );

      case 'eye':
        return (
          <>
            <path d="M1,8 C3,4 6,2 8,2 S13,4 15,8 C13,12 10,14 8,14 S3,12 1,8 Z" {...shared} />
            <circle cx="8" cy="8" r="2.5" {...shared} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <svg className={className} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      {renderPaths()}
    </svg>
  );
}
