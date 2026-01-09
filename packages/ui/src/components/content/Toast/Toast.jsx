'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@repo/utils';

const ToastContext = createContext(null);

const toastVariants = cva(
  'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-white border border-neutral-200 text-neutral-900',
        success: 'bg-success-50 border border-success-500 text-success-700',
        warning: 'bg-warning-50 border border-warning-500 text-warning-700',
        error: 'bg-error-50 border border-error-500 text-error-700',
        info: 'bg-info-50 border border-info-500 text-info-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Toast provider component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    const newToast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast notifications
 * @returns {{ toast: (options: ToastOptions) => string, dismiss: (id: string) => void }}
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    toast: context.addToast,
    dismiss: context.removeToast,
  };
}

/**
 * Toast container (renders all toasts)
 */
function ToastContainer() {
  const context = useContext(ToastContext);

  if (!context?.toasts.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {context.toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          onClose={() => context.removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

/**
 * Individual toast component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {'default' | 'success' | 'warning' | 'error' | 'info'} [props.variant]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {() => void} [props.onClose]
 */
export function Toast({
  className,
  variant,
  title,
  description,
  onClose,
  ...props
}) {
  const iconMap = {
    success: (
      <svg className="h-5 w-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-info-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(toastVariants({ variant }), className)}
      role="alert"
      {...props}
    >
      {variant && variant !== 'default' && iconMap[variant]}
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        {description && (
          <p className={cn('text-sm', title && 'mt-1', !title && 'font-medium')}>
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export { toastVariants };
