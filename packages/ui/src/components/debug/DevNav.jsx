'use client';

import { useState, useEffect } from 'react';
import { cn } from '@repo/utils';

const apps = [
  { name: 'Core', path: '/', color: 'bg-blue-500', description: 'Home, pricing, downloads' },
  { name: 'Platform', path: '/platform', color: 'bg-green-500', description: 'Product features' },
  { name: 'Templates', path: '/templates', color: 'bg-purple-500', description: 'Template gallery' },
  { name: 'Docs', path: '/docs', color: 'bg-orange-500', description: 'Documentation' },
  { name: 'Release Notes', path: '/release-notes', color: 'bg-pink-500', description: 'Changelog' },
  { name: 'Landing Pages', path: '/lp/api-testing', color: 'bg-cyan-500', description: 'Marketing LPs' },
  { name: 'About', path: '/about', color: 'bg-yellow-500', description: 'Kitchen-sink: About page' },
  { name: 'Careers', path: '/careers', color: 'bg-red-500', description: 'Kitchen-sink: Job openings' },
  { name: 'Contact', path: '/contact', color: 'bg-indigo-500', description: 'Kitchen-sink: Contact form' },
];

/**
 * Floating dev navigation panel - provides quick access to all micro-frontend apps
 * Only visible in development mode
 */
export function DevNav({ position = 'bottom-left' }) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) return null;

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={cn(
          'fixed z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-colors',
          'bg-neutral-800 text-white hover:bg-neutral-700',
          positionClasses[position]
        )}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>Dev Nav</span>
        <div className="flex -space-x-1">
          {apps.slice(0, 4).map((app) => (
            <span key={app.name} className={cn('h-2 w-2 rounded-full ring-2 ring-neutral-800', app.color)} />
          ))}
        </div>
      </button>
    );
  }

  return (
    <div className={cn('fixed z-50 w-80 rounded-lg border border-neutral-200 bg-white shadow-xl', positionClasses[position])}>
      {/* Header */}
      <div className="flex items-center justify-between bg-neutral-800 px-4 py-3 rounded-t-lg">
        <div className="flex items-center gap-2 text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-sm font-semibold">Dev Navigator</span>
        </div>
        <button onClick={() => setExpanded(false)} className="text-white/80 hover:text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Apps List */}
      <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide px-2 mb-2">
          Jump to App
        </p>
        {apps.map((app) => (
          <a
            key={app.name}
            href={app.path}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 transition-colors group"
          >
            <span className={cn('h-3 w-3 rounded-full flex-shrink-0', app.color)} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-neutral-900 group-hover:text-primary-600">
                {app.name}
              </div>
              <div className="text-xs text-neutral-500 truncate">{app.description}</div>
            </div>
            <span className="text-xs font-mono text-neutral-400">{app.path}</span>
          </a>
        ))}
      </div>

      {/* Footer with Dev Page Link */}
      <div className="border-t border-neutral-200 p-3">
        <a
          href="/dev"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 text-sm font-medium text-neutral-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Full Dev Navigator Page
        </a>
        <p className="text-[10px] text-neutral-400 text-center mt-2">
          Micro-frontends POC - Gateway on localhost:3000
        </p>
      </div>
    </div>
  );
}
