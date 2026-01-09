'use client';

import { useCallback } from 'react';
import { useAnalytics } from '../hooks/use-analytics.js';

/**
 * TrackClick component wrapper
 * Tracks click events on children
 * @param {Object} props
 * @param {string} props.event - Event name to track
 * @param {Object} [props.properties] - Additional event properties
 * @param {React.ReactElement} props.children - Child element to wrap
 */
export function TrackClick({ event, properties = {}, children }) {
  const { track } = useAnalytics();

  const handleClick = useCallback(
    (originalOnClick) => (e) => {
      track(event, properties);
      originalOnClick?.(e);
    },
    [track, event, properties]
  );

  // Clone the child and add click handler
  if (!children) return null;

  const child = children;
  const originalOnClick = child.props?.onClick;

  return {
    ...child,
    props: {
      ...child.props,
      onClick: handleClick(originalOnClick),
    },
  };
}

/**
 * Track impression when element becomes visible
 * @param {Object} props
 * @param {string} props.event - Event name to track
 * @param {Object} [props.properties] - Additional event properties
 * @param {React.ReactNode} props.children
 */
export function TrackImpression({ event, properties = {}, children }) {
  const { track } = useAnalytics();

  const handleRef = useCallback(
    (node) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              track(event, properties);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(node);

      return () => observer.disconnect();
    },
    [track, event, properties]
  );

  return <div ref={handleRef}>{children}</div>;
}
