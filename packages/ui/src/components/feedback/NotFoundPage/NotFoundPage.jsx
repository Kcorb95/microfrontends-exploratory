'use client';

import { cn } from '@repo/utils';
import { Button } from '../../base/Button/Button.jsx';
import { Container } from '../../layout/Container/Container.jsx';

/**
 * Styled 404 Not Found page component
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.homeHref]
 * @param {React.ReactNode} [props.children] - Additional content or actions
 */
export function NotFoundPage({
  className,
  title = 'Page not found',
  description = "Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.",
  homeHref = '/',
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
        {/* 404 Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
            404 Error
          </span>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <svg
            className="mx-auto h-48 w-48 text-neutral-300"
            fill="none"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            {/* Abstract geometric illustration */}
            <circle cx="100" cy="100" r="80" strokeWidth="2" stroke="currentColor" strokeDasharray="8 4" />
            <rect x="70" y="70" width="60" height="60" rx="8" strokeWidth="2" stroke="currentColor" fill="none" />
            <path d="M85 100 L95 110 L115 90" strokeWidth="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
            <circle cx="60" cy="60" r="8" fill="currentColor" opacity="0.3" />
            <circle cx="140" cy="140" r="6" fill="currentColor" opacity="0.3" />
            <circle cx="150" cy="70" r="4" fill="currentColor" opacity="0.2" />
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
          <Button as="a" href={homeHref} variant="primary" size="lg">
            Go back home
          </Button>
          <Button
            as="a"
            href="javascript:history.back()"
            variant="secondary"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Go back
          </Button>
        </div>

        {/* Additional content */}
        {children && <div className="mt-8">{children}</div>}

        {/* Helpful links */}
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="mb-4 text-sm font-medium text-neutral-500">Helpful links</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/" className="text-primary-600 hover:text-primary-700 hover:underline">
              Home
            </a>
            <a href="/docs" className="text-primary-600 hover:text-primary-700 hover:underline">
              Documentation
            </a>
            <a href="/platform" className="text-primary-600 hover:text-primary-700 hover:underline">
              Platform
            </a>
            <a href="/templates" className="text-primary-600 hover:text-primary-700 hover:underline">
              Templates
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
