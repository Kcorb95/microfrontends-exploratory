'use client';

import { useState, useEffect } from 'react';
import { cn } from '@repo/utils';

/**
 * Debug badge showing component origin - clickable with info tooltip
 * Only visible in development mode by default
 */
export function SharedBadge({
  package: packageName,
  component,
  position = 'top-right',
  className,
}) {
  const [mounted, setMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!mounted) return null;

  // Only show in development
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) return null;

  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  const infoPosition = {
    'top-left': 'top-full left-0 mt-1',
    'top-right': 'top-full right-0 mt-1',
    'bottom-left': 'bottom-full left-0 mb-1',
    'bottom-right': 'bottom-full right-0 mb-1',
  };

  return (
    <div className={cn('absolute z-[100]', positionClasses[position], className)}>
      <button
        onClick={() => setShowInfo(!showInfo)}
        className={cn(
          'flex items-center gap-1 rounded-sm px-1.5 py-0.5',
          'bg-amber-500 text-[9px] font-medium text-white shadow-sm',
          'cursor-pointer hover:bg-amber-600 transition-colors'
        )}
      >
        {packageName}
        {component && ` / ${component}`}
      </button>

      {showInfo && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-[99]"
            onClick={() => setShowInfo(false)}
          />

          {/* Info Panel */}
          <div
            className={cn(
              'absolute z-[101] w-72 rounded-lg border border-neutral-200 bg-white shadow-xl',
              infoPosition[position]
            )}
          >
            <div className="bg-amber-500 px-3 py-2 rounded-t-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Shared Package
                </span>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-white/70 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-3 space-y-3 text-xs">
              <div>
                <div className="font-semibold text-neutral-900 mb-1">{component || 'SearchBox'}</div>
                <div className="text-neutral-600">Search input with autocomplete support</div>
              </div>

              <div>
                <div className="font-medium text-neutral-500 uppercase tracking-wide text-[10px] mb-1">
                  Package
                </div>
                <code className="block bg-neutral-100 rounded px-2 py-1 text-amber-700">
                  {packageName}
                </code>
              </div>

              <div>
                <div className="font-medium text-neutral-500 uppercase tracking-wide text-[10px] mb-1">
                  Source
                </div>
                <code className="block bg-neutral-100 rounded px-2 py-1 text-neutral-700 text-[10px] break-all">
                  packages/search/src/components/SearchBox.jsx
                </code>
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-neutral-600 leading-relaxed">
                    Part of the @repo/search package. Search functionality is defined once and used across all micro-frontend apps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
