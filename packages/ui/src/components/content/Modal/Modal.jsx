'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@repo/utils';

const ModalContext = createContext(null);

/**
 * Modal root component
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {React.ReactNode} props.children
 */
export function Modal({ open, onClose, children }) {
  const modalRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  // Only render portal on client side
  if (typeof window === 'undefined') return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        {/* Modal */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          className="relative z-50"
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  );
}

/**
 * Modal content wrapper
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'full'} [props.size]
 * @param {React.ReactNode} props.children
 */
export function ModalContent({ className, size = 'md', children, ...props }) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <div
      className={cn(
        'w-full rounded-lg bg-white p-6 shadow-xl',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Modal header
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function ModalHeader({ className, children, ...props }) {
  const context = useContext(ModalContext);

  return (
    <div className={cn('mb-4 flex items-start justify-between', className)} {...props}>
      <div>{children}</div>
      <button
        type="button"
        onClick={context?.onClose}
        className="ml-4 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        aria-label="Close modal"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Modal title
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function ModalTitle({ className, children, ...props }) {
  return (
    <h2 className={cn('text-lg font-semibold text-neutral-900', className)} {...props}>
      {children}
    </h2>
  );
}

/**
 * Modal description
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function ModalDescription({ className, children, ...props }) {
  return (
    <p className={cn('mt-1 text-sm text-neutral-500', className)} {...props}>
      {children}
    </p>
  );
}

/**
 * Modal body
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function ModalBody({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Modal footer
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function ModalFooter({ className, children, ...props }) {
  return (
    <div className={cn('mt-6 flex justify-end gap-3', className)} {...props}>
      {children}
    </div>
  );
}
