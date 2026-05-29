import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@shared/components/ui/Icon';

const sizeMap = {
  sm: '420px',
  md: '540px',
  lg: '720px',
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: sizeMap[size] ?? sizeMap.md }}
      >
        <div className="modal-head">
          <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export { Modal };
export default Modal;
