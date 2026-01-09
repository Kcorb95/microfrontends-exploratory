'use client';

import { useEffect, useRef } from 'react';

import { useAnalytics } from './use-analytics.js';

/**
 * Hook to track page views automatically
 * @param {Object} [options]
 * @param {string} [options.path] - Override path
 * @param {Object} [options.properties] - Additional properties
 */
export function usePageView(options = {}) {
  const { page } = useAnalytics();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per mount
    if (hasTracked.current) return;
    hasTracked.current = true;

    page(options.path, options.properties);
  }, [page, options.path, options.properties]);
}

/**
 * Hook for route change tracking (App Router)
 * Use this with usePathname and useSearchParams from next/navigation
 * @param {string} pathname - Current pathname
 * @param {Object} [searchParams] - Search params object
 */
export function useRouteChangeTracking(pathname, searchParams) {
  const { page } = useAnalytics();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Only track if path changed
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      const search = searchParams?.toString();
      const fullPath = search ? `${pathname}?${search}` : pathname;

      page(fullPath);
    }
  }, [pathname, searchParams, page]);
}
