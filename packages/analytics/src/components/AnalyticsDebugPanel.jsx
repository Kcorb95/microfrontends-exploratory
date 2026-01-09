'use client';

import { useState, useEffect } from 'react';
import { useAnalyticsClient } from './AnalyticsProvider.jsx';
import {
  MOCK_PROVIDER_INFO,
  GA4_MOCK_INFO,
  AMPLITUDE_MOCK_INFO,
} from '../providers/index.js';

/**
 * Debug panel showing loaded analytics providers and recent events
 * @param {Object} props
 * @param {string} [props.className]
 * @param {boolean} [props.defaultExpanded]
 * @param {'bottom-left' | 'bottom-right'} [props.position]
 */
export function AnalyticsDebugPanel({
  className = '',
  defaultExpanded = false,
  position = 'bottom-right',
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [eventCount, setEventCount] = useState({ track: 0, page: 0, identify: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const client = useAnalyticsClient();

  // Simulate event tracking for demo
  useEffect(() => {
    // Track initial page view
    const timer = setTimeout(() => {
      setEventCount(prev => ({ ...prev, page: prev.page + 1 }));
      setRecentEvents(prev => [
        { type: 'page', name: window.location.pathname, time: new Date() },
        ...prev.slice(0, 4),
      ]);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const providers = [
    { ...MOCK_PROVIDER_INFO, active: true, color: 'bg-indigo-500' },
    { ...GA4_MOCK_INFO, active: true, color: 'bg-red-500' },
    { ...AMPLITUDE_MOCK_INFO, active: true, color: 'bg-blue-500' },
  ];

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={`fixed ${positionClasses[position]} z-50 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 transition-colors ${className}`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span>@repo/analytics</span>
        <div className="flex -space-x-1">
          <span className="h-2 w-2 rounded-full bg-indigo-400 ring-2 ring-indigo-600" title="Console" />
          <span className="h-2 w-2 rounded-full bg-red-400 ring-2 ring-indigo-600" title="GA4" />
          <span className="h-2 w-2 rounded-full bg-blue-400 ring-2 ring-indigo-600" title="Amplitude" />
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 w-96 rounded-lg border border-neutral-200 bg-white shadow-xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-indigo-600 px-4 py-3 rounded-t-lg">
        <div className="flex items-center gap-2 text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-sm font-semibold">@repo/analytics</span>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-white/80 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Providers Section */}
      <div className="p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Active Providers (Mocked)
        </h3>
        <div className="space-y-2">
          {providers.map((provider) => (
            <div
              key={provider.name}
              className="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className={`h-8 w-8 rounded-md ${provider.color} flex items-center justify-center text-white text-lg`}>
                  {provider.icon}
                </span>
                <div>
                  <div className="text-sm font-medium text-neutral-700">
                    {provider.displayName}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {provider.name === 'ga4' && 'G-DEMO12345'}
                    {provider.name === 'amplitude' && 'demo-api-key'}
                    {provider.name === 'mock' && 'Console output'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-xs font-medium text-green-600">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Flow Diagram */}
      <div className="border-t border-neutral-200 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Event Flow
        </h3>
        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center mb-1">
              <span className="text-lg">🖱️</span>
            </div>
            <span className="text-neutral-600">Event</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <svg className="h-4 w-16 text-neutral-300" viewBox="0 0 64 16">
              <path d="M0 8h56M56 8l-6-6M56 8l-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
              <span className="text-lg">📦</span>
            </div>
            <span className="text-neutral-600">@repo/analytics</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <svg className="h-4 w-16 text-neutral-300" viewBox="0 0 64 16">
              <path d="M0 8h56M56 8l-6-6M56 8l-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex -space-x-2">
              <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs ring-2 ring-white">🖥️</div>
              <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-xs ring-2 ring-white">📊</div>
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs ring-2 ring-white">📈</div>
            </div>
            <span className="text-neutral-600">Providers</span>
          </div>
        </div>
      </div>

      {/* API Methods */}
      <div className="border-t border-neutral-200 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Unified API
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-neutral-50 p-2 text-center">
            <code className="text-sm font-bold text-indigo-600">track()</code>
            <div className="text-[10px] text-neutral-500 mt-0.5">Custom Events</div>
          </div>
          <div className="rounded-md bg-neutral-50 p-2 text-center">
            <code className="text-sm font-bold text-indigo-600">page()</code>
            <div className="text-[10px] text-neutral-500 mt-0.5">Page Views</div>
          </div>
          <div className="rounded-md bg-neutral-50 p-2 text-center">
            <code className="text-sm font-bold text-indigo-600">identify()</code>
            <div className="text-[10px] text-neutral-500 mt-0.5">User Identity</div>
          </div>
          <div className="rounded-md bg-neutral-50 p-2 text-center">
            <code className="text-sm font-bold text-indigo-600">reset()</code>
            <div className="text-[10px] text-neutral-500 mt-0.5">Clear Session</div>
          </div>
        </div>
      </div>

      {/* React Hooks */}
      <div className="border-t border-neutral-200 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          React Hooks
        </h3>
        <div className="space-y-1 font-mono text-xs bg-neutral-900 rounded-md p-3 text-green-400">
          <div>import {'{'} useAnalytics {'}'} from '@repo/analytics';</div>
          <div className="text-neutral-500">// Works in all apps automatically</div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-2 rounded-b-lg">
        <p className="text-[10px] text-neutral-500 text-center">
          All events sent to Console, GA4, and Amplitude simultaneously (mocked in demo)
        </p>
      </div>
    </div>
  );
}
