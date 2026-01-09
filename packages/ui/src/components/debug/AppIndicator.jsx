'use client';

import { useState, useEffect } from 'react';
import { cn } from '@repo/utils';

const appInfo = {
  core: {
    description: 'Core marketing app serving homepage, pricing, and downloads',
    routes: ['/', '/pricing', '/downloads'],
    note: 'This is the primary app that handles the main marketing routes. It has the highest stability requirements.',
  },
  platform: {
    description: 'Platform features and product pages',
    routes: ['/platform/*'],
    note: 'Dedicated app for platform/product feature pages. Can be deployed independently from core.',
  },
  templates: {
    description: 'Template gallery and showcase',
    routes: ['/templates/*'],
    note: 'Standalone app for browsing and managing templates. Isolated deployment cycle.',
  },
  'release-notes': {
    description: 'Release notes and changelog',
    routes: ['/release-notes/*'],
    note: 'Dedicated app for version history and updates. Can be updated frequently without affecting other apps.',
  },
  docs: {
    description: 'Documentation and learning resources',
    routes: ['/docs/*'],
    note: 'Documentation app with separate deployment. Uses a different domain in production.',
  },
  lp: {
    description: 'Landing pages (Prismic-powered)',
    routes: ['/lp/*'],
    note: 'Dynamic landing pages managed through Prismic CMS. Marketing team can create pages without deploys.',
  },
  'kitchen-sink': {
    description: 'Catch-all app for unmatched routes',
    routes: ['/* (fallback)'],
    note: 'Handles any routes not matched by other apps. Useful for experimental features and 404 handling.',
  },
};

/**
 * Visual indicator showing current app context - clickable with info tooltip
 * Only visible in development mode by default
 */
export function AppIndicator({
  appName,
  appId,
  environment,
  className,
  variant = 'full',
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

  const envColors = {
    development: 'bg-yellow-500',
    preview: 'bg-blue-500',
    beta: 'bg-purple-500',
    production: 'bg-green-500',
  };

  const envColor = envColors[environment] || 'bg-neutral-500';

  // Get app key from appId (e.g., "@apps/core" -> "core")
  const appKey = appId?.replace('@apps/', '') || appName?.toLowerCase();
  const info = appInfo[appKey] || {
    description: `${appName} micro-frontend app`,
    routes: ['Unknown'],
    note: 'This app is part of the micro-frontends architecture.',
  };

  if (variant === 'minimal') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={cn(
            'flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1',
            'cursor-pointer hover:bg-neutral-200 transition-colors',
            className
          )}
        >
          <span className={cn('h-2 w-2 rounded-full', envColor)} />
          <span className="text-sm font-medium text-neutral-700">{appName}</span>
        </button>

        {showInfo && <InfoPopup info={info} appName={appName} appKey={appKey} environment={environment} onClose={() => setShowInfo(false)} />}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className={cn(
          'flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm',
          'cursor-pointer hover:border-primary-300 hover:shadow-md transition-all',
          className
        )}
      >
        {/* App Icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-100">
          <svg
            className="h-4 w-4 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        </div>

        {/* App Info */}
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-neutral-900">{appName}</span>
          {appId && (
            <span className="text-xs text-neutral-500 font-mono">{appId}</span>
          )}
        </div>

        {/* Environment Badge */}
        {environment && (
          <div
            className={cn(
              'ml-2 flex items-center gap-1 rounded-full px-2 py-0.5',
              envColor,
              'text-[10px] font-medium uppercase tracking-wide text-white'
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            {environment}
          </div>
        )}

        {/* Click indicator */}
        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {showInfo && <InfoPopup info={info} appName={appName} appKey={appKey} environment={environment} onClose={() => setShowInfo(false)} />}
    </div>
  );
}

function InfoPopup({ info, appName, appKey, environment, onClose }) {
  return (
    <>
      {/* Backdrop to close on click outside */}
      <div
        className="fixed inset-0 z-[99]"
        onClick={onClose}
      />

      {/* Info Panel - positioned to stay on screen */}
      <div className="absolute top-full left-0 mt-2 z-[101] w-80 rounded-lg border border-neutral-200 bg-white shadow-xl">
        <div className="bg-primary-600 px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              <span className="text-sm font-semibold text-white">
                Current App
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 text-sm">
          <div>
            <div className="font-semibold text-neutral-900 text-base mb-1">{appName}</div>
            <div className="text-neutral-600">{info.description}</div>
          </div>

          <div>
            <div className="font-medium text-neutral-500 uppercase tracking-wide text-[10px] mb-2">
              Package
            </div>
            <code className="block bg-neutral-100 rounded px-3 py-2 text-primary-700 font-mono text-xs">
              @apps/{appKey}
            </code>
          </div>

          <div>
            <div className="font-medium text-neutral-500 uppercase tracking-wide text-[10px] mb-2">
              Routes Handled
            </div>
            <div className="flex flex-wrap gap-1">
              {info.routes.map((route, i) => (
                <span key={i} className="inline-block bg-neutral-100 rounded px-2 py-1 text-xs font-mono text-neutral-700">
                  {route}
                </span>
              ))}
            </div>
          </div>

          {environment && (
            <div>
              <div className="font-medium text-neutral-500 uppercase tracking-wide text-[10px] mb-2">
                Environment
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'h-2 w-2 rounded-full',
                  environment === 'development' ? 'bg-yellow-500' :
                  environment === 'preview' ? 'bg-blue-500' :
                  environment === 'production' ? 'bg-green-500' : 'bg-neutral-500'
                )} />
                <span className="text-sm capitalize">{environment}</span>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-neutral-100">
            <div className="flex items-start gap-2">
              <svg className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-neutral-600 leading-relaxed text-xs">
                {info.note}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3">
              <svg className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-amber-800 leading-relaxed text-xs">
                <strong>Micro-frontend demo:</strong> Each route is served by an independent Next.js app. Navigate to different sections to see the app indicator change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
