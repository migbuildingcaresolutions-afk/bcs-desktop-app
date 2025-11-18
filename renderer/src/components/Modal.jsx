import { useEffect } from 'react';
import '../styles/Modal.css';

/**
 * Modern Modal Component
 * Features:
 * - Backdrop click to close
 * - ESC key to close
 * - Smooth animations
 * - Multiple sizes
 * - Custom footer actions
 * - Double-click title to fullscreen
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium', // 'small', 'medium', 'large', 'xlarge', 'fullscreen'
  showCloseButton = true,
  footer,
  className = '',
  preventBackdropClose = false
}) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !preventBackdropClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-container modal-${size} ${className}`}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {showCloseButton && (
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close"
              title="Close (ESC)"
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Convenience wrapper for confirmation dialogs
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary', // 'primary', 'danger', 'success'
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className={`btn btn-${confirmVariant}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </>
      }
    >
      <p className="confirm-message">{message}</p>
    </Modal>
  );
}

// File viewer modal for PDFs, images, etc.
export function FileViewerModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType
}) {
  const renderContent = () => {
    if (fileType?.startsWith('image/')) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
        />
      );
    } else if (fileType === 'application/pdf') {
      return (
        <iframe
          src={fileUrl}
          title={fileName}
          style={{ width: '100%', height: '70vh', border: 'none' }}
        />
      );
    } else {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Preview not available for this file type.</p>
          <a href={fileUrl} download={fileName} className="btn btn-primary" style={{ marginTop: '20px' }}>
            Download {fileName}
          </a>
        </div>
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={fileName || 'File Viewer'}
      size="xlarge"
    >
      {renderContent()}
    </Modal>
  );
}

export default Modal;
