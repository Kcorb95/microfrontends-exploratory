'use client';

import { useState, useEffect } from 'react';
import { cn } from '@repo/utils';

const componentInfo = {
  Header: {
    description: 'Main navigation header component',
    location: 'packages/ui/src/components/navigation/Header/Header.jsx',
    usage: 'Imported in each app layout.jsx from @repo/ui',
    note: 'Same component renders identically across all micro-frontend apps. Changes here update all apps.',
  },
  Footer: {
    description: 'Site-wide footer component',
    location: 'packages/ui/src/components/navigation/Footer/Footer.jsx',
    usage: 'Imported in each app layout.jsx from @repo/ui',
    note: 'Shared footer configuration defined in packages/ui/src/config/layout.js',
  },
  SearchBox: {
    description: 'Search input with autocomplete support',
    location: 'packages/search/src/components/SearchBox.jsx',
    usage: 'Imported from @repo/search in app layouts',
    note: 'Part of the @repo/search package - search functionality shared across all apps',
  },
  AppIndicator: {
    description: 'Shows which micro-frontend app is serving the current page',
    location: 'packages/ui/src/components/debug/AppIndicator.jsx',
    usage: 'Passed to Header component in each app layout',
    note: 'Demonstrates which app handles each route in the micro-frontend architecture',
  },
};

/**
 * Debug badge showing component origin - clickable with info tooltip
 * Only visible in development mode by default
 */
export function SharedBadge({
  package: packageName,
  component,
  className,
  position = 'top-right',
  alwaysShow = false,
}) {
  const [mounted, setMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!mounted) return null;

  // Only show in development unless alwaysShow is true
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev && !alwaysShow) return null;

  const positionClasses = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1',
    'bottom-left': 'bottom-1 left-1',
    'bottom-right': 'bottom-1 right-1',
  };

  const infoPosition = {
    'top-left': 'top-full left-0 mt-1',
    'top-right': 'top-full right-0 mt-1',
    'bottom-left': 'bottom-full left-0 mb-1',
    'bottom-right': 'bottom-full right-0 mb-1',
  };

  const info = componentInfo[component] || {
    description: `Shared ${component} component`,
    location: `${packageName}/src/components/${component}`,
    usage: `Imported from ${packageName}`,
    note: 'This component is shared across all micro-frontend apps',
  };

  return (
    <div className={cn('absolute z-[100]', positionClasses[position], className)}>
      <button
        onClick={() => setShowInfo(!showInfo)}
        className={cn(
          'flex items-center gap-1 rounded-md px-2 py-1',
          'bg-purple-600/90 text-[10px] font-medium text-white shadow-sm',
          'backdrop-blur-sm cursor-pointer hover:bg-purple-700/90 transition-colors',
          'border border-purple-400/30'
        )}
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <span className="opacity-75">{packageName}</span>
        <span>/</span>
        <span>{component}</span>
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
            <div className="bg-purple-600 px-3 py-2 rounded-t-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Shared Component
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
                <div className="font-semibold text-neutral-900 mb-1">{component}</div>
                <div className="text-neutral-600">{info.description}</div>
              </div>

              <div>
                <div className="font-medium text-neutral-500 uppercase tracking-wide text-[10px] mb-1">
                  Package
                </div>
                <code className="block bg-neutral-100 rounded px-2 py-1 text-purple-700">
                  {packageName}
                </code>
              </div>

              <div>
                <div className="font-medium text-neutral-500 uppercase tracking-wide text-[10px] mb-1">
                  Source
                </div>
                <code className="block bg-neutral-100 rounded px-2 py-1 text-neutral-700 text-[10px] break-all">
                  {info.location}
                </code>
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-neutral-600 leading-relaxed">
                    {info.note}
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
