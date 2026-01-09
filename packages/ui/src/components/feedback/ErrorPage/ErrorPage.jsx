'use client';

import { cn } from '@repo/utils';
import { Button } from '../../base/Button/Button.jsx';
import { Container } from '../../layout/Container/Container.jsx';

/**
 * Styled error page component for runtime errors
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {Error} [props.error] - The error object
 * @param {() => void} [props.reset] - Function to reset/retry
 * @param {boolean} [props.showDetails] - Show error details (dev mode)
 * @param {React.ReactNode} [props.children]
 */
export function ErrorPage({
  className,
  title = 'Something went wrong',
  description = "We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.",
  error,
  reset,
  showDetails = false,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        'flex min-h-[60vh] flex-col items-center justify-center py-16',
        className
      )}
      {...props}
    >
      <Container className="text-center">
        {/* Error Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
            Error
          </span>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <svg
            className="mx-auto h-48 w-48 text-red-200"
            fill="none"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            {/* Warning/Error illustration */}
            <circle cx="100" cy="100" r="80" strokeWidth="2" stroke="currentColor" />
            <path
              d="M100 60 L100 110"
              strokeWidth="8"
              stroke="currentColor"
              strokeLinecap="round"
            />
            <circle cx="100" cy="135" r="6" fill="currentColor" />
            {/* Decorative elements */}
            <circle cx="45" cy="80" r="4" fill="currentColor" opacity="0.3" />
            <circle cx="155" cy="120" r="5" fill="currentColor" opacity="0.3" />
            <circle cx="160" cy="60" r="3" fill="currentColor" opacity="0.2" />
            <circle cx="50" cy="140" r="3" fill="currentColor" opacity="0.2" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {title}
        </h1>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-md text-lg text-neutral-600">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {reset && (
            <Button onClick={reset} variant="primary" size="lg">
              Try again
            </Button>
          )}
          <Button
            as="a"
            href="/"
            variant={reset ? 'secondary' : 'primary'}
            size="lg"
          >
            Go back home
          </Button>
        </div>

        {/* Error Details (dev mode) */}
        {showDetails && error && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
            <p className="mb-2 text-sm font-medium text-red-800">
              Error details (development only):
            </p>
            <pre className="overflow-x-auto text-xs text-red-700">
              <code>
                {error.message}
                {error.stack && (
                  <>
                    {'\n\n'}
                    {error.stack}
                  </>
                )}
              </code>
            </pre>
          </div>
        )}

        {/* Additional content */}
        {children && <div className="mt-8">{children}</div>}

        {/* Support info */}
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-sm text-neutral-500">
            If this problem persists, please{' '}
            <a href="/contact" className="text-primary-600 hover:text-primary-700 hover:underline">
              contact support
            </a>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}
